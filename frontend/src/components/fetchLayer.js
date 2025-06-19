import { Group as LayerGroup, Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM, XYZ, Vector as VectorSource } from 'ol/source';
import TileWMS from 'ol/source/TileWMS';
import { GeoJSON } from 'ol/format';
import { Style, Fill, Stroke, Circle as CircleStyle } from 'ol/style';
import { A } from 'ol/renderer/webgl/FlowLayer';

// Daftar layer yang tersedia (atau bisa kamu fetch dari server nanti)
const layerDefinitions = [
  { name: 'Apartemen', title: 'Apartemen' },
  { name: 'RUSUNAWA', title: 'Rusunawa' },
  { name: 'Rusunami', title: 'Rusunami' }, // Alias untuk RUSUNAWA
  { name: 'htm', title: 'Hunian Terjangkau Milik' },
  { name: 'RPTRA', title: 'RPTRA' },
  // { name: 'CIP_POINT', title: 'Implementasi Berupa Titik' }, 
  // { name: 'CIP_LINE', title: 'Implementasi Berupa Garis' },
  { name: 'v_cip', title: 'Collaborative Implementation Program' }, // Alias untuk CIP_POINT dan CIP_LINE
  { name: 'rwkumuh', title: 'RW Kumuh' },
  // { name: 'RTLH', title: 'RTLH' },
  { name: 'Aset_drCitata', title: 'Aset DPRKP Jakarta' },
  // { name: 'admin_jkt', title: 'Administrasi Jakarta' } // Tambahkan layer HTM
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
  RUSUNAWA: '#ff7f0e',
  Rusunami: '#bcbd22',
  CIP_LINE: '#2ca02c',
  CIP_POINT: '#d62728',
  v_cip: '#2ca02c',
  admin_jkt : '#9467bd',
  rwkumuh : '#8c564b',
  RPTRA: '#e377c2',
  Aset_drCitata: '#7f7f7f',
  // RTLH: '#e377c2',
  htm: '#7f7f7f'
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
