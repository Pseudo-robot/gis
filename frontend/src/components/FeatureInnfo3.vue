<script setup>
import { ref, onMounted, nextTick } from 'vue'
import Overlay from 'ol/Overlay'
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import { Style, Circle as CircleStyle, Fill, Stroke } from 'ol/style'
// import { ref, onMounted, nextTick } from 'vue';

const props = defineProps(['map'])

const popupEl = ref(null)
const popupOverlay = ref(null)
const currentFeature = ref(null)

function closePopup() {
  if (popupOverlay.value) {
    popupOverlay.value.setPosition(undefined)
  }
}

function viewDetails() {
  if (currentFeature.value) {
    alert(`Lihat detail: ${currentFeature.value.properties?.NAMA_KEGIA}`)
    console.log('Feature:', currentFeature.value)
  }
}

onMounted(async () => {
  await nextTick();
  console.log('popupEl:', popupEl.value)
  // 1. Tambahkan popup ke map
  popupOverlay.value = new Overlay({
    element: popupEl.value,
    autoPan: true,
    autoPanAnimation: { duration: 250 }
  })
  props.map.addOverlay(popupOverlay.value)

  // 2. Ambil data dari API
  const response = await fetch('http://localhost:3000/api/geojson-public/public/Apartemen')
  const geojson = await response.json()

  const vectorSource = new VectorSource({
    features: new GeoJSON().readFeatures(geojson, {
      dataProjection: 'EPSG:4326', // Proyeksi data GeoJSON
      featureProjection: 'EPSG:3857' // Proyeksi peta OpenLayers
    })
  })

  const vectorLayer = new VectorLayer({
    source: vectorSource,
    style: new Style({
      image: new CircleStyle({
        radius: 6,
        fill: new Fill({ color: '#498766' }),
        stroke: new Stroke({ color: '#fff', width: 1 })
      })
    })
  })

  props.map.addLayer(vectorLayer)

  // 3. Tangani klik fitur
  props.map.on('singleclick', (event) => {
    currentFeature.value = null
    popupOverlay.value.setPosition(undefined)

    props.map.forEachFeatureAtPixel(event.pixel, (feature) => {
      const fProps = feature.getProperties()
      delete fProps.geometry

      const coords = feature.getGeometry()?.getCoordinates()
      const extent = feature.getGeometry()?.getExtent()

      currentFeature.value = {
        properties: fProps,
        coordinate: coords
      }

      popupOverlay.value.setPosition(coords)
      props.map.getView().fit(extent, { maxZoom: 16, duration: 1000 })
    })
  })
})
</script>

<template>
  <div ref="popupEl" class="ol-popup" v-if="currentFeature">
    <a href="#" class="ol-popup-closer" @click.prevent="closePopup">×</a>
    <div class="popup-content">
      <div class="popup-title">{{ currentFeature.properties?.NAMA_KEGIA || 'Detail' }}</div>
      <div v-for="(value, key, index) in currentFeature.properties" v-if="index < 3" :key="key">
        <strong>{{ key }}</strong>: {{ value }}
      </div>
      <button class="popup-btn" @click="viewDetails">View Details</button>
    </div>
  </div>
</template>

<style scoped>
.ol-popup {
  position: absolute;
  background-color: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #ccc;
  min-width: 200px;
  bottom: 12px;
  left: -50%;
  transform: translateX(-50%);
  z-index: 1000;
}

.ol-popup:after, .ol-popup:before {
  top: 100%;
  left: 50%;
  border: solid transparent;
  content: "";
  position: absolute;
  pointer-events: none;
}

.ol-popup:after {
  border-top-color: white;
  border-width: 10px;
  margin-left: -10px;
}

.ol-popup:before {
  border-top-color: #ccc;
  border-width: 11px;
  margin-left: -11px;
}

.ol-popup-closer {
  position: absolute;
  top: 2px;
  right: 8px;
  text-decoration: none;
  font-size: 12px;
  color: #aaa;
  background: none;
  border: none;
}

.popup-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 8px;
  color: #333;
}

.popup-btn {
  width: 100%;
  margin-top: 10px;
  padding: 6px 12px;
  background-color: #498766;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.popup-btn:hover {
  background-color: #2563eb;
}
</style>
