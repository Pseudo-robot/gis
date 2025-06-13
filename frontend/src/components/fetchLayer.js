import { Group as LayerGroup, Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM, XYZ, Vector as VectorSource } from 'ol/source';
import TileWMS from 'ol/source/TileWMS';
import { GeoJSON } from 'ol/format';
import { Style, Fill, Stroke, Circle as CircleStyle } from 'ol/style';

// function getRandomColor() {
//   const letters = '0123456789ABCDEF';
//   let color = '#';
//   for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];
//   return color;
// }

// Daftar layer yang tersedia (atau bisa kamu fetch dari server nanti)
const layerDefinitions = [
  { name: 'Apartemen', title: 'Apartemen' },
  { name: 'Rusun', title: 'Rusunawa' },
  { name: 'CIP_Line', title: 'Implementasi Berupa Garis' },
  { name: 'CIP_Point', title: 'Implementasi Berupa Titik' }
];

// Layer group untuk base dan overlay
const baseLayerGroup = new LayerGroup({
  title: 'Base Maps',
  layers: [
    new TileLayer({
      title: 'CartoDB Positron',
      type: 'base',
      subtype: 'always-on', // membuat layer ini selalu aktif
      visible: true,
      source: new XYZ({
        url: 'https://{a-c}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
      })
    }),
    new TileLayer({
      title: 'Google Map',
      source: new XYZ({ url: 'https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}' }),
      type: 'base',
      visible: false
    }),
    new TileLayer({
      title: 'ESRI Satellite',
      source: new XYZ({ url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}' }),
      type: 'base',
      visible: false
    }),
    new TileLayer({ // ✅ Citra DKI 2023 (langsung dari GeoServer)
      title: 'Citra DKI 2023',
      type: 'base',
      visible: false,
      source: new TileWMS({
        url: 'https://gis-dev.dcktrp.id/gisimagery/dki/dki_2023/ows',
        params: {
          'LAYERS': 'dki:dki_2023',
          'TILED': true,
          'VERSION': '1.3.0',
          'FORMAT': 'image/png',
          'TRANSPARENT': true
        },
        serverType: 'geoserver',
      })
    })
  ]
});

const overlayGroupCustom = new LayerGroup({ title: 'List Data', layers: [] });
// Menggunakan VITE_API_BASE untuk endpoint API
const apiBase = import.meta.env.VITE_API_BASE;

const colorMap = {
  Apartemen: '#1f77b4',
  Rusun: '#ff7f0e',
  CIP_Line: '#2ca02c',
  CIP_Point: '#d62728'
};

const fetchLayer = async () => {
  try {
    layerDefinitions.forEach(def => {
      const color = colorMap[def.name] || '#000000';

      const vectorLayer = new VectorLayer({
        title: def.title,
        source: new VectorSource({
          format: new GeoJSON(),
          url: `${apiBase}/api/geojson-public/public/${def.name}`
        }),
        style: new Style({
          stroke: new Stroke({ color, width: 2 }),
          fill: new Fill({ color: `${color}33` }), // transparan
          image: new CircleStyle({
            radius: 5,
            fill: new Fill({ color }),
            stroke: new Stroke({ color: 'white', width: 1 })
          })
        })
      });

      vectorLayer.setVisible(false);
      overlayGroupCustom.getLayers().push(vectorLayer);
    });

    return [baseLayerGroup, overlayGroupCustom];
  } catch (error) {
    console.error('Error setting up local layers:', error);
    return [];
  }
};

export { fetchLayer, baseLayerGroup, overlayGroupCustom };
