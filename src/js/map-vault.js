/* global OpenSeadragon */
(function () {
    "use strict";
    const base = "{{BASE_PATH}}";
    const assets = base + "maps_converted/";
    const $ = id => document.getElementById(id);
    let languages, catalog, viewer, selected, region = "", page = 1, opened = "", state = "loading";
    let lang = "fr";
    const collapsed = new Set();

    function savedLanguage() {
        try { return localStorage.getItem("lang"); }
        catch (error) { console.warn("Map vault language preference unavailable", error); return null; }
    }

    function words() { return languages[lang].vault; }
    function mapName(map) { return map.id === "monde" ? words().world : map.name; }
    function regionId(map) { return map.regions.map(item => item.id).join("/"); }
    function zoom(factor) {
        viewer.viewport.zoomBy(factor);
        viewer.viewport.applyConstraints();
    }

    function setStatus(key) {
        state = key;
        const failed = key === "error" || key === "invalidLink";
        $("mapStatus").textContent = words()[key];
        $("mapStatus").setAttribute("role", failed ? "alert" : "status");
        $("retryMap").hidden = !failed;
        $("mapViewport").setAttribute("aria-busy", String(key === "loading"));
    }

    function routeLink(nextRegion, map = selected, nextPage = page) {
        const hash = new URLSearchParams({ region: nextRegion });
        if (map) {
            hash.set("map", map.id);
            hash.set("page", String(nextPage));
        }
        return "#" + hash.toString();
    }

    function anchor(label, href, className) {
        const link = document.createElement("a");
        link.textContent = label;
        link.href = href;
        if (className) link.className = className;
        return link;
    }

    function regions() {
        const result = new Map();
        for (const map of catalog.maps) {
            map.regions.forEach((item, index) => {
                const id = map.regions.slice(0, index + 1).map(part => part.id).join("/");
                result.set(id, { ...item, parent: map.regions.slice(0, index).map(part => part.id).join("/") });
            });
        }
        return result;
    }

    function renderCatalog(reveal = false) {
        const known = regions();
        const tree = $("regionTree");
        for (const details of tree.querySelectorAll("details[data-tree-key]")) {
            if (details.open) collapsed.delete(details.dataset.treeKey);
            else collapsed.add(details.dataset.treeKey);
        }
        const groupKey = (id, name) => JSON.stringify(["group", id, name]);
        if (reveal && selected) {
            collapsed.delete("region:");
            selected.regions.forEach((_part, index) => {
                collapsed.delete("region:" + selected.regions.slice(0, index + 1).map(part => part.id).join("/"));
            });
            if (selected.group) collapsed.delete(groupKey(regionId(selected), selected.group));
        }
        tree.setAttribute("aria-label", words().regions);
        function folder(key, name, current = false) {
            const item = document.createElement("li");
            const details = document.createElement("details");
            details.dataset.treeKey = key;
            details.open = !collapsed.has(key);
            const summary = document.createElement("summary");
            summary.className = "vault-region-label";
            if (current) summary.classList.add("vault-current-region");
            summary.textContent = name;
            const children = document.createElement("ul");
            details.append(summary, children);
            item.append(details);
            return { item, children };
        }
        function branch(id, name) {
            const { item, children } = folder("region:" + id, name, id === region);
            const groups = new Map();
            for (const map of catalog.maps.filter(entry => regionId(entry) === id)) {
                const child = document.createElement("li");
                const mapLink = anchor(mapName(map), routeLink(id, map, 1), "vault-map-link");
                mapLink.dataset.mapId = map.id;
                if (map === selected) mapLink.setAttribute("aria-current", "page");
                child.append(mapLink);
                if (map.group) {
                    if (!groups.has(map.group)) {
                        const group = folder(groupKey(id, map.group), map.group);
                        groups.set(map.group, group.children);
                        children.append(group.item);
                    }
                    groups.get(map.group).append(child);
                } else children.append(child);
            }
            for (const [childId, child] of known) {
                if (child.parent === id) children.append(branch(childId, child.name));
            }
            return item;
        }
        const root = document.createElement("ul");
        root.append(branch("", words().worldRegion));
        tree.replaceChildren(root);
    }

    function renderMapInfo() {
        if (!selected) return;
        $("mapTitle").textContent = mapName(selected);
        $("mapViewport").setAttribute("aria-label", mapName(selected));
        $("mapKind").textContent = words().raster;
        $("mapNote").textContent = words().rasterNote;
        $("sourceName").textContent = selected.source;
        document.title = `${mapName(selected)} - ${words().title} - Súriël`;
    }

    function isExpanded() {
        return Boolean(document.fullscreenElement) || $("viewerFrame").classList.contains("vault-expanded");
    }

    function renderExpansion() {
        $("expandMap").textContent = words()[isExpanded() ? "exitFullscreen" : "fullscreen"];
        $("expandMap").setAttribute("aria-pressed", String(isExpanded()));
    }

    function applyLanguage() {
        document.documentElement.lang = lang;
        $("vaultLanguage").value = lang;
        for (const element of document.querySelectorAll("[data-vault]")) element.textContent = words()[element.dataset.vault];
        for (const element of document.querySelectorAll("[data-ui]")) element.textContent = languages[lang].ui[element.dataset.ui];
        renderCatalog();
        renderMapInfo();
        renderExpansion();
        setStatus(state);
    }

    function navigate() {
        const params = new URLSearchParams(location.hash.slice(1));
        const id = params.get("map");
        const map = id === null ? catalog.maps[0] : catalog.maps.find(item => item.id === id);
        const nextPage = Number(params.get("page") || 1);
        const nextRegion = params.get("region") ?? (map ? regionId(map) : "");
        if (!map || !Number.isInteger(nextPage) || nextPage < 1 || nextPage > map.pages.length ||
            (nextRegion !== "" && !regions().has(nextRegion))) {
            viewer.close();
            opened = "";
            setStatus("invalidLink");
            return;
        }
        const reveal = selected !== map || region !== nextRegion;
        selected = map;
        region = nextRegion;
        page = nextPage;
        renderCatalog(reveal);
        renderMapInfo();
        const key = `${map.id}:${page}`;
        if (key !== opened) {
            opened = key;
            setStatus("loading");
            const source = map.pages[page - 1];
            viewer.open(source.type === "image" ? { type: "image", url: assets + source.url } : assets + source.url);
        }
    }

    async function expand() {
        try {
            if (document.fullscreenElement) await document.exitFullscreen();
            else if ($("viewerFrame").classList.contains("vault-expanded")) {
                $("viewerFrame").classList.remove("vault-expanded");
                document.body.classList.remove("vault-expanded-body");
            } else if ($("viewerFrame").requestFullscreen) await $("viewerFrame").requestFullscreen();
            else {
                $("viewerFrame").classList.add("vault-expanded");
                document.body.classList.add("vault-expanded-body");
            }
            renderExpansion();
        } catch (error) {
            console.error("Map vault fullscreen failed", error);
            setStatus("error");
        }
    }

    async function fetchJSON(url) {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${url}`);
        return response.json();
    }

    async function boot() {
        [languages, catalog] = await Promise.all([fetchJSON(base + "languages.json"), fetchJSON(assets + "catalog.json")]);
        const query = new URLSearchParams(location.search).get("lang");
        const saved = savedLanguage();
        lang = languages[query] ? query : languages[saved] ? saved : "fr";
        if (catalog.schema !== 1 || !Array.isArray(catalog.maps) || !catalog.maps.length) throw new Error("Invalid map catalog");
        viewer = OpenSeadragon({
            id: "mapViewport", showNavigationControl: false, showNavigator: true,
            keyboardNavEnabled: false, tabIndex: -1,
            animationTime: 0.5, maxZoomPixelRatio: 2, visibilityRatio: 0.6,
            constrainDuringPan: true, imageLoaderLimit: 4, maxImageCacheCount: 80,
            gestureSettingsTouch: { pinchToZoom: true, flickEnabled: true },
        });
        viewer.addHandler("open", () => {
            const image = viewer.world.getItemAt(0);
            const loaded = () => {
                if (image === viewer.world.getItemAt(0) && image.getFullyLoaded() && state === "loading") setStatus("ready");
            };
            image.addHandler("fully-loaded-change", loaded);
            loaded();
        });
        for (const event of ["open-failed", "tile-load-failed"]) {
            viewer.addHandler(event, detail => {
                console.error("Map vault loading failed", detail);
                setStatus("error");
            });
        }
        viewer.addHandler("zoom", () => {
            if (viewer.world.getItemCount()) $("zoomLevel").textContent = `${Math.round(viewer.viewport.viewportToImageZoom(viewer.viewport.getZoom()) * 100)} %`;
        });
        $("zoomIn").onclick = () => zoom(1.5);
        $("zoomOut").onclick = () => zoom(1 / 1.5);
        $("fitMap").onclick = () => viewer.viewport.goHome();
        $("actualSize").onclick = () => {
            if (viewer.world.getItemCount()) viewer.viewport.zoomTo(viewer.viewport.imageToViewportZoom(1));
        };
        $("expandMap").onclick = expand;
        document.querySelector(".skip").onclick = event => {
            event.preventDefault();
            $("main").focus();
            $("main").scrollIntoView();
        };
        document.addEventListener("fullscreenchange", renderExpansion);
        document.addEventListener("keydown", event => {
            if (event.key === "Escape" && $("viewerFrame").classList.contains("vault-expanded")) expand();
        });
        $("mapViewport").addEventListener("keydown", event => {
            if (!viewer.world.getItemCount() || event.ctrlKey || event.metaKey || event.altKey) return;
            const pan = { ArrowLeft: [-0.1, 0], ArrowRight: [0.1, 0], ArrowUp: [0, -0.1], ArrowDown: [0, 0.1] }[event.key];
            if (pan) {
                viewer.viewport.panBy(new OpenSeadragon.Point(pan[0], pan[1]).divide(viewer.viewport.getZoom()));
                viewer.viewport.applyConstraints();
            } else if (event.key === "+" || event.key === "=") zoom(1.5);
            else if (event.key === "-") zoom(1 / 1.5);
            else if (event.key === "0") viewer.viewport.goHome();
            else return;
            event.preventDefault();
        });
        $("retryMap").onclick = () => { opened = ""; navigate(); };
        $("vaultLanguage").onchange = () => {
            lang = $("vaultLanguage").value;
            try { localStorage.setItem("lang", lang); }
            catch (error) { console.warn("Map vault language preference not saved", error); }
            const url = new URL(location.href);
            url.searchParams.set("lang", lang);
            history.replaceState(null, "", url);
            applyLanguage();
        };
        window.addEventListener("hashchange", navigate);
        navigate();
        applyLanguage();
    }

    boot().catch(error => {
        console.error("Map vault initialization failed", error);
        $("mapStatus").textContent = "Impossible de charger le coffre. Rechargez la page. / Cannot load the vault. Reload the page.";
        $("mapStatus").setAttribute("role", "alert");
        $("retryMap").textContent = "Recharger / Reload";
        $("retryMap").hidden = false;
        $("retryMap").onclick = () => location.reload();
    });
})();
