// Initialiser la carte
var map = L.map('map', {
    center: [48.12, -1.67],  // Y, X ... PAS X, Y
    zoom: 16,
    attributionControl: true
});

var fondcarte = {
    OSM: L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png'),
    Positron: L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'),
    ThunderForest: L.tileLayer('https://{s}.tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png'),
    OrthoRM: L.tileLayer.wms('https://public.sig.rennesmetropole.fr/geoserver/ows?', { layers: 'raster:ortho2021' }),
    PlanRM: L.tileLayer.wms('https://public.sig.rennesmetropole.fr/geoserver/ows?', { layers: 'ref_fonds:pvci_simple_gris' })
};

// Appel du fond de carte
fondcarte.OSM.addTo(map);


// Insérer les couches WMS à afficher, TRANSPARENT=TRUE indique à leaflet que c'est une couche et pas un fond de carte
var Cadastre = L.tileLayer.wms('http://geobretagne.fr/geoserver/cadastre/wms', { layers: 'CP.CadastralParcel', format: 'image/png', transparent: true, opacity: 0.3 });

var Bati = L.tileLayer.wms('https://public.sig.rennesmetropole.fr/geoserver/ows?', { layers: 'ref_cad:batiment', format: 'image/png', transparent: true, opacity: 0.5 });

var AmenagCycl = L.tileLayer.wms('https://public.sig.rennesmetropole.fr/geoserver/ows?', { layers: 'trp_doux:v_voirie_amenagement_velo', format: 'image/png', transparent: true, opacity: 1 });

var Trafic = L.tileLayer.wms('https://public.sig.rennesmetropole.fr/geoserver/ows?', { layers: 'trp_rout:v_rva_trafic_fcd', format: 'image/png', transparent: true, opacity: 0.8 });


// Ajout des Stations de vélos
var url = 'https://raw.githubusercontent.com/mastersigat/data/main/velostar.geojson';
$.getJSON(url, function (geojson) {
    var velos = L.geoJson(geojson).addTo(map);
// Ajout Popup
velos.bindPopup(
    function(velos) {console.log(velos.feature.properties); 
        return "<h1> Station : "+velos.feature.properties.nom+"</h1>"+"<hr><h2>"+velos.feature.properties.nombreemplacementstheorique+ "&nbsp; vélos</h2>" ;
    });
});

// Ajouter l'echelle cartographique
L.control.scale().addTo(map)

// Icones pour marqueurs
var rennes2icone = L.icon({ iconUrl: 'https://www.theapolis.de/files/api/public/image/organization/37933/profile_photo/1', iconSize: [30, 30] });
var gareicone = L.icon({ iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Sncf-logo.svg/2560px-Sncf-logo.svg.png', iconSize: [35, 20] });


// Parametres pour popup des marqueurs
var popuprennes2 = '<h1>Université Rennes 2</h1><hr><h3>Ouai cest pas mal</h3> <img src="https://pbs.twimg.com/media/CfHuulnUEAQG7gy.jpg" width="350px">';
var popupgare = '<h1>Gare de Rennes</h1><hr><h3>Ouai cest pas mal</h3> <img src="https://media.ouest-france.fr/v1/pictures/MjAxOTA3ZWMzZDg1ODJkNTI0ZGIxMmJlNTYyMTgwNTU3YTJlZmI?width=1260&height=708&focuspoint=50%2C25&cropresize=1&client_id=bpeditorial&sign=97f5c4f6abfadf289160abbee046dcd9655c5cb1ec35b1c8312f10ee65403959" width="350px">';
var customOptions = { 'maxWidth': '500', 'className': 'custom' };


// Ajouter des marqueurs manuels
var Rennes2 = L.marker([48.118457, -1.702590], { icon: rennes2icone }).bindPopup(popuprennes2, customOptions);
var Gare = L.marker([48.103453, -1.672330], { icon: gareicone }).bindPopup(popupgare, customOptions);

// Ajouter un gestionnaire d'événements pour le survol (hover)
Rennes2.on('mouseover', function (e) { this.openPopup(); });
Gare.on('mouseover', function (e) { this.openPopup(); });

// Ajouter un gestionnaire d'événements pour quitter le survol (hover)
Rennes2.on('mouseout', function (e) { this.closePopup(); });
Gare.on('mouseout', function (e) { this.closePopup(); });


// Controle pour les marqueurs
var couches = { "Université Rennes 2": Rennes2, "Gare SNCF": Gare, "Cadastre": Cadastre, "Batiments": Bati, "Aménagements Cyclables": AmenagCycl, "Trafic en temps réel": Trafic};


// Ajout des menus de controle de l'affichage des fond de carte et couches
var menu1 = L.control.layers(fondcarte, null, { position: 'topleft', collapsed: false }).addTo(map);
var menu2 = L.control.layers(null, couches, { position: 'topright', collapsed: false }).addTo(map);


// Titre pour les menus -- marche pas pour les menus collapsed
menu1.getContainer().insertAdjacentHTML('afterbegin', '<div class="menu-title">Fonds de carte</div>');
menu2.getContainer().insertAdjacentHTML('afterbegin', '<div class="menu-title">Couches</div>');


// Style CSS pour le titre
var style = document.createElement('style');
style.innerHTML = `
    .menu-title {
        font-weight: bold;
        font-size: 14px;
        padding: 5px;
        background: white;
        text-align: center;
    }
    `;
document.head.appendChild(style);




// Ajouter une MiniMap
var miniMapLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png');
var miniMap = new L.Control.MiniMap(miniMapLayer, { toggleDisplay: true, minimized: false, position: 'bottomright' }).addTo(map);


// Ajouter une attribution personnalisée directement via la carte
map.attributionControl.addAttribution('<a href="https://sites-formations.univ-rennes2.fr/mastersigat" target="_blank">Master SIGAT</a> | Source : OSM et Rennes Métropole');