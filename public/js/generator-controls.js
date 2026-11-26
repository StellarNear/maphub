(function () {
    "use strict";

    // The generators keep their editable data in English. Translate menu captions
    // only, so selections, imports and exports retain their original values.
    var labels = {
        "New city": "Nouvelle ville", "New village": "Nouveau village",
        "New house": "Nouvelle maison", "New map": "Nouvelle carte",
        "New view": "Nouvelle vue", "Return to 2D": "Retour à la 2D",
        "View in 3D": "Voir en 3D", "View inside": "Voir l'intérieur",
        "View outside": "Voir l'extérieur", "Open in Dwellings": "Ouvrir dans Bâtiments",
        "Import...": "Importer...", "Export as": "Exporter en",
        "Export as OBJ": "Exporter en OBJ", "Permalink...": "Lien permanent...",
        "Permalink..": "Lien permanent...", "Reroll": "Régénérer",
        "Reroll name": "Régénérer le nom", "Town name": "Nom de la ville",
        "Districts names": "Noms des quartiers", "Reroll geometry": "Régénérer la géométrie",
        "Edit": "Modifier", "Edit...": "Modifier...", "Display": "Affichage",
        "Display...": "Affichage...", "Generator": "Générateur", "Generator...": "Générateur...",
        "Style...": "Style...", "Fullscreen": "Plein écran", "About": "À propos",
        "Zoom in": "Zoom avant", "Zoom out": "Zoom arrière", "Add landmark": "Ajouter un repère",
        "Settlement...": "Agglomération...", "Line measurement": "Mesure en ligne",
        "Curve measurement": "Mesure courbe", "Displace": "Déplacer", "Rotate": "Pivoter",
        "Liquify": "Déformer", "Relax": "Assouplir", "Bloat": "Gonfler",
        "Pinch": "Pincer", "Equalize": "Uniformiser", "Grid": "Grille",
        "Grid...": "Grille...", "Water...": "Eau...", "Rotate...": "Rotation...",
        "Geometry...": "Géométrie...", "Square": "Carrée", "Hexagonal": "Hexagonale",
        "Hidden": "Masquée", "Narrow tunnels": "Tunnels étroits",
        "Rename...": "Renommer...", "Mark": "Marquer", "Unmark": "Démarquer",
        "Mark all": "Tout marquer", "Unmark all": "Tout démarquer",
        "View": "Vue", "Animation": "Animation", "Default": "Par défaut",
        "Ground": "Au sol", "Map": "Carte", "Macro": "Macro",
        "Rotation": "Rotation", "Fly-through": "Survol", "Shuffle styles": "Styles aléatoires",
        "Trees": "Arbres", "Gable roofs": "Toits à pignon", "Windows": "Fenêtres",
        "Random": "Aléatoire", "Box": "Rectangle", "Clear": "Effacer",
        "Submit": "Valider", "Discard": "Annuler", "Advanced...": "Avancé...",
        "Doors": "Portes", "Edge trees": "Arbres en bordure", "Entrances": "Entrées",
        "Glade view": "Vue clairière", "Grass": "Herbe", "Hatching": "Hachures",
        "Rubble": "Décombres", "Shading": "Ombrage", "Small trees": "Petits arbres",
        "Steps": "Marches", "Title": "Titre", "Water": "Eau", "Arrows": "Flèches",
        "Castle": "Château", "Dark": "Sombre", "Dashes": "Tirets", "Detailed": "Détaillé",
        "Dots": "Points", "Double": "Double", "Fade": "Estomper", "Fortified": "Fortifié",
        "Gothic": "Gothique", "Labels": "Étiquettes", "Lights": "Lumières",
        "Log house": "Maison en rondins", "Modern": "Moderne", "Names": "Noms",
        "Numbers": "Numéros", "Open": "Ouvrir", "Parameters...": "Paramètres...",
        "Planks": "Planches", "Props": "Objets", "Regular": "Régulier", "Roof": "Toit",
        "Rooms": "Pièces", "Sci-fi": "Science-fiction", "Shade": "Ombre", "Shrink": "Réduire",
        "Simple": "Simple", "Solid": "Plein", "Tiles": "Tuiles", "Walls": "Murs",
        "Alternative": "Autre", "Apply": "Appliquer", "Auto": "Automatique",
        "Bottom-left": "En bas à gauche", "Bottom-right": "En bas à droite",
        "Customize...": "Personnaliser...", "Delete": "Supprimer", "Edit name": "Modifier le nom",
        "Hide": "Masquer", "Imperial": "Impérial", "Metric": "Métrique",
        "Position": "Position", "Reset": "Réinitialiser", "Style": "Style",
        "Top-left": "En haut à gauche", "Top-right": "En haut à droite", "Unit": "Unité",
        "Buildings": "Bâtiments", "Driveways": "Allées", "Fields": "Champs", "Many": "Beaucoup",
        "None": "Aucun", "Orchards": "Vergers", "Others...": "Autres...", "Relief": "Relief",
        "Roads": "Routes", "Shadows": "Ombres", "Some": "Quelques-uns",
        "Spotlight...": "Éclairage...", "Village": "Village"
    };

    function readLanguage() {
        var query = new URLSearchParams(location.search).get("lang");
        var saved;
        try { saved = localStorage.getItem("lang"); }
        catch (error) { console.warn("Language preference could not be read:", error); }
        return (query || saved || "fr").toLowerCase().split("-")[0] === "fr" ? "fr" : "en";
    }

    // Generators rewrite their URL as maps change; keep the initial choice stable.
    var selectedLanguage = readLanguage();

    globalThis.mapHubTranslateMenu = function (text) {
        return selectedLanguage === "fr" && Object.prototype.hasOwnProperty.call(labels, text) ? labels[text] : text;
    };

    // Keep the original grammar untouched in English and on imported maps.
    globalThis.mapHubCityGrammar = function (grammar) {
        if (selectedLanguage !== "fr") return grammar;
        return Object.assign(grammar, {
            city: ["#proper#"],
            district: ["#districtNoun# de #proper#", "#districtNoun# du #dir#", "#districtNoun# des {artisans|marchands|jardins|tisserands}"],
            centralDistrict: ["vieux #districtNoun#", "#districtNoun# du marché", "centre de #cityName#"],
            castleDistrict: ["citadelle", "#districtNoun# du château", "forteresse"],
            docksDistrict: ["les quais", "port de #proper#", "#districtNoun# du port"],
            bridgeDistrict: ["pont de #proper#", "#districtNoun# du pont"],
            gateDistrict: ["porte de #proper#", "#districtNoun# de la porte"],
            bankDistrict: ["rive du #dir#", "quai de #proper#"],
            parkDistrict: ["jardin de #proper#", "parc de #proper#", "le bois"],
            sprawlDistrict: ["faubourg de #proper#", "#districtNoun# du #dir#", "#district#"],
            north: "nord", south: "sud", east: "est", west: "ouest"
        });
    };
    globalThis.mapHubDistrictNoun = function (noun) {
        if (selectedLanguage !== "fr") return noun;
        return {quarter: "quartier", ward: "quartier", district: "quartier", town: "bourg"}[noun] || noun;
    };

    globalThis.mapHubAddControls = function () {
        var lang = selectedLanguage;
        document.documentElement.lang = lang;
        var controls = document.createElement("div");
        controls.className = "generator-controls";
        var button = document.createElement("button");
        button.type = "button";
        button.textContent = "Menu";
        button.setAttribute("aria-label", lang === "fr" ? "Ouvrir le menu de génération" : "Open generation menu");
        button.addEventListener("click", function () {
            if (typeof globalThis.mapHubOpenMenu === "function") globalThis.mapHubOpenMenu();
            else console.warn("The generator menu is not ready.");
        });
        var select = document.createElement("select");
        select.setAttribute("aria-label", lang === "fr" ? "Langue" : "Language");
        [["fr", "Français"], ["en", "English"]].forEach(function (item) {
            var option = document.createElement("option");
            option.value = item[0];
            option.textContent = item[1];
            select.appendChild(option);
        });
        select.value = lang;
        select.addEventListener("change", function () {
            var message = lang === "fr"
                ? "Changer de langue recharge le générateur. Exportez votre travail avant de continuer. Continuer ?"
                : "Changing language reloads the generator. Export your work before continuing. Continue?";
            if (!confirm(message)) { select.value = lang; return; }
            try { localStorage.setItem("lang", select.value); }
            catch (error) { console.warn("Language preference could not be saved:", error); }
            var url = new URL(location.href);
            url.searchParams.set("lang", select.value);
            location.assign(url.href);
        });
        controls.appendChild(button);
        controls.appendChild(select);
        // Keep controls inside the fullscreen element used by the generators.
        document.getElementById("openfl-content").appendChild(controls);
    };
}());
