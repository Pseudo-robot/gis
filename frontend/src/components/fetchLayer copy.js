import { Group as LayerGroup, Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM, XYZ, Vector as VectorSource } from 'ol/source';
import TileWMS from 'ol/source/TileWMS';
import { GeoJSON } from 'ol/format';
import { Style, Fill, Stroke, Circle as CircleStyle } from 'ol/style';

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];
  return color;
}

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

const fetchLayer = async () => {
  try {
    layerDefinitions.forEach(def => {
      const vectorLayer = new VectorLayer({
        title: def.title,
        source: new VectorSource({
          format: new GeoJSON(),
          url: `${apiBase}/api/geojson-public/public/${def.name}` // asumsi endpoint backend
        }),
        style: new Style({
          stroke: new Stroke({ color: getRandomColor(), width: 2 }),
          fill: new Fill({ color: 'rgba(0, 0, 255, 0.1)' }),
          image: new CircleStyle({
            radius: 5,
            fill: new Fill({ color: getRandomColor() }),
            stroke: new Stroke({ color: 'white', width: 2 })
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
