(function () {
    "use strict";

    // Display translations leave internal identifiers and user-entered names intact.
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
        "Spotlight...": "Éclairage...", "Village": "Village",
        "Number of floors": "Nombre d'étages", "Parameters": "Paramètres",
        "Floors": "Étages", "As table": "En tableau", "Dots per cell": "Points par case",
        "Room name": "Nom de la pièce", "Export": "Exportation",
        "Hold Shift to specify the entrance location.": "Maintenez Maj pour placer l'entrée.",
        "* Shift+click a tag to learn its effect.": "* Maj + clic sur une étiquette pour connaître son effet.",
        "basement": "sous-sol", "blank": "aveugle", "generic": "ordinaire",
        "hallways": "couloirs", "large": "grand", "low": "bas",
        "mechanical": "géométrique", "medium": "moyen", "organic": "organique",
        "slab": "uniforme", "small": "petit", "spiral": "en colimaçon",
        "square": "rectangulaire", "stairwell": "cage d'escalier",
        "tall": "haut", "transparent": "vitré", "random": "aléatoire",
        "Small": "Petit", "Medium": "Moyen", "Large": "Grand",
        "Basement.": "Avec un sous-sol.", "As few windows as possible.": "Aussi peu de fenêtres que possible.",
        "No special rooms.": "Aucune pièce particulière.",
        "More corridors and rooms with nooks.": "Davantage de couloirs et de pièces avec des alcôves.",
        "Large ground floor.": "Un vaste rez-de-chaussée.", "Low number of floors.": "Peu d'étages.",
        "Inner walls bisect the outer shape.": "Les murs intérieurs découpent la forme extérieure.",
        "Medium-sized ground floor.": "Un rez-de-chaussée de taille moyenne.",
        "Inner walls follow the outer shape.": "Les murs intérieurs suivent la forme extérieure.",
        "All floors have the same shape.": "Tous les étages ont la même forme.",
        "Small ground floor.": "Un petit rez-de-chaussée.",
        "Spiral staircase instead of regular ones.": "Des escaliers en colimaçon.",
        "Rectangular ground plan.": "Un plan rectangulaire.",
        "All staircases are located one above the other.": "Les escaliers sont superposés.",
        "High number of floors.": "De nombreux étages.",
        "As many windows as possible.": "Autant de fenêtres que possible.",
        "No info.": "Aucune précision.", "Message": "Message", "Permalink": "Lien permanent",
        "Map title": "Titre de la carte", "Map parameters": "Paramètres de la carte",
        "Village plate": "Cartouche du village", "Spotlight": "Éclairage",
        "Walls geometry": "Géométrie des murs", "Water level": "Niveau de l'eau",
        "Square grid": "Grille carrée", "Settlement": "Agglomération", "Landmark": "Repère",
        "Districts": "Quartiers", "Landmarks": "Repères", "Compass": "Boussole",
        "Scale bar": "Échelle", "Emblem": "Blason", "Display mode": "Mode d'affichage",
        "Processing": "Traitement", "Roofs": "Toits", "Raised": "En relief",
        "Solids": "Volumes", "Farm fields": "Champs cultivés",
        "Show alleys": "Afficher les ruelles", "Show forests": "Afficher les forêts",
        "Show trees": "Afficher les arbres", "Thin lines": "Traits fins",
        "Tint districts": "Colorer les quartiers", "Weathered roofs": "Toits patinés",
        "Towers": "Tours", "Town": "Ville", "Name": "Nom", "Load": "Charger",
        "Points of interest": "Lieux remarquables", "Reroll names": "Régénérer les noms",
        "Default number": "Nombre par défaut", "Maximum number": "Nombre maximal",
        "Graphics": "Graphismes", "Elements": "Éléments", "Outline": "Contours",
        "Text": "Texte", "Misc": "Divers", "Color scheme": "Palette de couleurs",
        "Font size": "Taille du texte", "Generate": "Générer", "Cancel": "Annuler",
        "Copy": "Copier", "Save": "Enregistrer", "OK": "OK",
        "Size": "Taille", "Size:": "Taille :", "Broken": "Irrégulier",
        "Bold": "Gras", "Italic": "Italique", "Enable": "Activer",
        "Roll": "Tirer au sort", "Population": "Population", "Hide population": "Masquer la population",
        "Lots": "Parcelles", "Block": "Îlots",
        "Terrain": "Terrain", "Houses": "Maisons", "Lighting": "Éclairage",
        "Misc.": "Divers", "Colors": "Couleurs", "Shadow": "Ombre", "Strokes": "Traits",
        "Basic": "Général", "Road": "Route", "Stone": "Pierre", "Wood": "Bois",
        "Color variance": "Variation des couleurs", "Roof slope": "Pente des toits",
        "Roof type": "Type de toit", "Color": "Couleur", "Wide": "Large",
        "Narrow": "Étroit", "Outlining": "Contours", "Merge": "Fusionner",
        "Background": "Fond", "Furrows": "Sillons", "Shallow water": "Eau peu profonde",
        "Deep water": "Eau profonde", "Ripples": "Ondulations", "No. of bands": "Nombre de bandes",
        "Foliage": "Feuillage", "Thicket": "Fourré", "Crown details": "Détails des houppiers",
        "Shape": "Forme", "Shadow color": "Couleur de l'ombre", "Shadow length": "Longueur de l'ombre",
        "Shadow angle": "Angle de l'ombre", "Header": "En-tête", "Ink": "Encre",
        "Paper": "Papier", "Normal stroke": "Trait normal", "Thin stroke": "Trait fin",
        "Legend": "Légende", "Pins": "Épingles", "Toggle all": "Tout inverser",
        "Hachures": "Hachures", "Contours": "Courbes de niveau", "Hard": "Net",
        "Soft": "Doux", "Gable": "À pignon", "Hip": "À croupe", "Flat": "Plat",
        "Ruin": "En ruine", "Cotton": "Arrondi", "Conifer": "Conifère", "Palm": "Palmier",
        "Offset": "Décalage", "Plain": "Uni", "Complex": "Complexe", "Round": "Ronde",
        "Straight": "Droit", "Curved": "Courbe", "Icon": "Icône",
        "Cave Generator": "Générateur de grottes", "City Viewer": "Visionneuse de ville",
        "Medieval Fantasy City Generator": "Générateur de ville médiévale fantastique",
        "Dwellings Generator": "Générateur d'habitations", "Village Generator": "Générateur de village",
        "burrows": "terriers", "hub": "centre", "chambers": "salles", "road": "route",
        "tight": "resserré", "sealed": "clos", "entrance": "entrée", "passage": "passage",
        "junction": "carrefour", "cavities": "cavités", "coral": "corail",
        "chaotic": "chaotique", "varied": "varié", "connected": "interconnecté",
        "tree": "arborescent", "string": "en chaîne", "dry": "sec", "wet": "humide",
        "flooded": "inondé", "coast": "côte", "confluence": "confluence",
        "crossroads": "croisée des chemins", "dead end": "impasse", "dense": "dense",
        "district": "quartier", "estuary": "estuaire", "farmland": "terres cultivées",
        "grove": "bosquet", "highway": "grande route", "island": "île",
        "isolated": "isolé", "no orchards": "sans vergers", "no square": "sans place",
        "palisade": "palissade", "pond": "étang", "river": "rivière",
        "sparse": "clairsemé", "uncultivated": "terres incultes",
        "Many tunnels.": "De nombreux tunnels.", "Round-ish compact caves.": "Des grottes arrondies et compactes.",
        "Several caverns of the same size and few tunnels.": "Plusieurs cavernes de taille semblable, avec peu de tunnels.",
        "Irregular caves with column-like features.": "Des grottes irrégulières ponctuées de colonnes.",
        "High number of loops including short ones.": "De nombreuses boucles, dont certaines courtes.",
        "Coral-like branching caves.": "Des grottes ramifiées comme du corail.",
        "No water.": "Sans eau.", "Single entrance.": "Une seule entrée.",
        "Most of the floor is covered with water.": "La majeure partie du sol est inondée.",
        "One central cavern and several smaller ones.": "Une caverne centrale entourée de cavernes plus petites.",
        "Many entrances.": "De nombreuses entrées.", "Large cave system.": "Un vaste réseau de grottes.",
        "Medium-sized cave system.": "Un réseau de grottes de taille moyenne.",
        "Two entrances.": "Deux entrées.",
        "Road connect one of the entrances with another.": "Une route relie deux entrées.",
        "No entrances.": "Sans entrée.", "Single cave or small cave system.": "Une grotte ou un petit réseau.",
        "Sequence of areas without branching.": "Une succession de salles sans embranchement.",
        "Caves are spawned without much space between them.": "Les grottes sont rapprochées.",
        "Topological tree: no loops.": "Un réseau ramifié sans boucle.",
        "Caves of very different shapes.": "Des grottes aux formes très diverses.",
        "Some water.": "Un peu d'eau.", "Unknown tag": "Étiquette inconnue",
        "Coastal village.": "Un village côtier.", "Two rivers flowing together.": "Deux rivières se rejoignent.",
        "Crossroads or T-junction.": "Un carrefour ou une intersection en T.",
        "Highway ending at a village square.": "Une grande route aboutit sur la place du village.",
        "Densely built village.": "Un village densément bâti.", "Part of a larger settlement.": "Une partie d'une plus grande agglomération.",
        "Mouth of a river.": "L'embouchure d'une rivière.", "Many farm fields.": "De nombreux champs cultivés.",
        "Trees grow thickly around the buildings.": "Les arbres poussent densément autour des bâtiments.",
        "A large road running through the village.": "Une grande route traverse le village.",
        "Island village.": "Un village insulaire.", "No highway - only trails.": "Pas de grande route, seulement des sentiers.",
        "No orchards.": "Aucun verger.", "No village square.": "Aucune place de village.",
        "Wobbly roads.": "Des routes sinueuses.", "A palisade surrounds the village.": "Une palissade entoure le village.",
        "Small pond at the centre.": "Un petit étang au centre.", "Riverside village.": "Un village au bord d'une rivière.",
        "Sparsely built village.": "Un village peu dense.", "No farm fields.": "Aucun champ cultivé."
    };
    var roomNames = {
        "armoury": "salle d'armes", "attic": "grenier", "bathroom": "salle d'eau",
        "bedroom": "chambre", "cellar": "cave", "chapel": "chapelle",
        "room": "pièce", "corridor": "couloir", "stairhall": "cage d'escalier",
        "gallery": "galerie", "greenhouse": "serre", "hall": "vestibule",
        "kitchen": "cuisine", "laboratory": "laboratoire", "library": "bibliothèque",
        "lookout": "guet", "observatory": "observatoire", "secret passage": "passage secret",
        "living room": "salon", "study": "cabinet", "workshop": "atelier",
        "studio": "atelier d'artiste", "trophy room": "salle des trophées",
        "vault": "chambre forte", "storage": "réserve"
    };

    function readLanguage() {
        var query = new URLSearchParams(location.search).get("lang");
        var saved;
        try { saved = localStorage.getItem("lang"); }
        catch (error) { console.warn("Language preference could not be read:", error); }
        var candidates = [query, saved];
        for (var i = 0; i < candidates.length; i++) {
            var lang = (candidates[i] || "").toLowerCase().split("-")[0];
            if (lang === "fr" || lang === "en") return lang;
        }
        return "fr";
    }

    // Generators rewrite their URL as maps change; keep the initial choice stable.
    var selectedLanguage = readLanguage();

    globalThis.mapHubTranslateMenu = function (text) {
        return selectedLanguage === "fr" && Object.prototype.hasOwnProperty.call(labels, text) ? labels[text] : text;
    };
    globalThis.mapHubRoomName = function (text) {
        return selectedLanguage === "fr" && Object.prototype.hasOwnProperty.call(roomNames, text) ? roomNames[text] : text;
    };
    globalThis.mapHubRoomShort = function (name, original) {
        if (selectedLanguage !== "fr") return original;
        return {bathroom: "S. d'eau", stairhall: "Escalier"}[name] || globalThis.mapHubRoomName(name);
    };
    globalThis.mapHubFloorLabel = function (floor, count) {
        if (selectedLanguage !== "fr") return floor === -1 ? "B" : floor === 0 ? "GF" : floor < count ? floor + "F" : "R";
        return floor === -1 ? "Sous-sol" : floor === 0 ? "RDC" : floor < count ? floor + (floor === 1 ? "er" : "e") : "Toit";
    };
    globalThis.mapHubSideLabel = function (side) {
        return selectedLanguage === "fr" ? {L: "Gauche", F: "Devant", R: "Droite", B: "Arrière"}[side] : side;
    };
    globalThis.mapHubModeLabel = function (mode) {
        return selectedLanguage === "fr" ? {P: "Plan", E: "Façade"}[mode] : mode;
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
            prop1: ["clair", "bel", "roche", "mont", "val", "brume", "lune", "aube", "chante", "haute", "ombre", "fleur"],
            prop2: ["val", "bois", "combe", "lande", "rive", "mont", "terre", "fleur", "pierre", "font", "garde", "brume"],
            north: "nord", south: "sud", east: "est", west: "ouest"
        });
    };
    globalThis.mapHubDistrictNoun = function (noun) {
        if (selectedLanguage !== "fr") return noun;
        return {quarter: "quartier", ward: "quartier", district: "quartier", town: "bourg"}[noun] || noun;
    };

    globalThis.mapHubVillageGrammar = function (grammar) {
        if (selectedLanguage !== "fr") return grammar;
        return Object.assign(grammar, {
            village: ["#placeName#", "#placeName#", "#placeName#-sur-#riverName#", "RIVER?-#placeName#-sur-#riverName#"],
            placeName: "#placeStart##placeEnd#",
            placeStart: ["Clair", "Bel", "Roche", "Mont", "Val", "Brume", "Lune", "Aube", "Chante", "Haute", "Fleur", "Font"],
            placeEnd: ["val", "bois", "combe", "lande", "rive", "mont", "terre", "fleur", "pierre", "font", "garde", "brume"],
            riverName: ["Aube", "Brume", "Claironde", "Douce", "Lune"],
            sign: ["Loup Gris", "Dragon d'Or", "Cerf Blanc", "Faucon", "Renard Roux", "Corbeau", "Chevalier", "Sanglier"],
            inn: ["Auberge du #sign#", "Relais du #sign#"],
            tavern: ["Taverne du #sign#", "Au #sign#"],
            smithy: ["Forge de #proper#", "Forge du #sign#"],
            person: ["Demeure de #proper#"],
            temple: ["Temple de #fantasy#", "Sanctuaire de #fantasy#"],
            basic_shop: ["Échoppe de #proper#", "Boulangerie de #proper#", "Herboristerie de #proper#"],
            special_shop: ["Apothicaire", "Bijouterie", "Échoppe d'antiquités", "Barbier"],
            special: ["Maison de guilde", "Maison commune", "Archives", "Bibliothèque", "SHORE?-Phare"]
        });
    };
    globalThis.mapHubDwellingGrammar = function (grammar) {
        if (selectedLanguage !== "fr") return grammar;
        return Object.assign(grammar, {
            title: ["Maison des #feature#", "Demeure de #place#", "SMALL?-Chaumière de #place#", "LARGE?-Manoir des #feature#", "TALL?-Tour de #place#"],
            feature: ["Brumes", "Étoiles", "Roses", "Chênes", "Songes", "Sources"],
            place: ["Clairval", "Bellecombe", "Rochebrune", "Luneterre", "Hautecombe", "Boisclair"]
        });
    };
    globalThis.mapHubCaveGrammar = function (grammar, forest) {
        if (selectedLanguage !== "fr") return grammar;
        return Object.assign(grammar, {
            name: ["#location# des #mystery#", "#location# du #guardian#", "#location# de #proper#"],
            location: forest ? ["Clairière", "Forêt", "Vallée", "Lande", "Bois"] : ["Grotte", "Caverne", "Galerie", "Antre", "Abîme"],
            mystery: ["Brumes", "Ombres", "Étoiles", "Songes", "Échos", "Anciens"],
            guardian: ["Loup", "Dragon", "Corbeau", "Roi Oublié", "Veilleur"]
        });
    };

    globalThis.mapHubAddControls = function () {
        var lang = selectedLanguage;
        document.documentElement.lang = lang;
        document.title = globalThis.mapHubTranslateMenu(document.title);
        var controls = document.createElement("div");
        controls.className = "generator-controls";
        var back = document.createElement("button");
        back.type = "button";
        back.textContent = "←";
        back.setAttribute("aria-label", lang === "fr" ? "Retourner à l'accueil" : "Return to the hub");
        back.title = lang === "fr" ? "Retourner à l'accueil" : "Return to the hub";
        back.addEventListener("click", function () {
            var message = lang === "fr"
                ? "Revenir à l'accueil ? Votre travail non exporté sera perdu."
                : "Return to the hub? Your unexported work will be lost.";
            if (confirm(message)) location.assign("/");
        });
        var button = document.createElement("button");
        button.type = "button";
        button.textContent = "Menu";
        button.setAttribute("aria-label", lang === "fr" ? "Ouvrir le menu de génération" : "Open generation menu");
        button.addEventListener("click", function () {
            if (typeof globalThis.mapHubOpenMenu === "function") globalThis.mapHubOpenMenu();
            else console.warn("The generator menu is not ready.");
        });
        controls.appendChild(back);
        controls.appendChild(button);
        // Keep controls inside the fullscreen element used by the generators.
        document.getElementById("openfl-content").appendChild(controls);
    };
}());
