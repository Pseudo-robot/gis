<script setup>
import { ref, onMounted } from 'vue';
import Overlay from 'ol/Overlay';

const props = defineProps(['map']);

const featureInfo = ref(null);
const popupEl = ref(null); // DOM element popup
const popupOverlay = ref(null);

function closePopup() {
  if (popupOverlay.value) {
    popupOverlay.value.setPosition(undefined);
  }
}

onMounted(() => {
  popupOverlay.value = new Overlay({
    element: popupEl.value,
    autoPan: true,
    autoPanAnimation: {
      duration: 250,
    },
  });
  props.map.addOverlay(popupOverlay.value);

  props.map.on('singleclick', (event) => {
    featureInfo.value = null;
    popupOverlay.value.setPosition(undefined);

    props.map.forEachFeatureAtPixel(event.pixel, (feature) => {
      const fProps = feature.getProperties();
      delete fProps.geometry;

      featureInfo.value = {
        nama: fProps.nama || null,
        nama_apart: fProps.nama_apart || null,
        nama_rusun: fProps.nama_rusun || null,
        keterangan: fProps.keterangan || null,
        wadmkk: fProps.wadmkk || null,
        lokasi: fProps.lokasi || null,
        foto: fProps.foto || null
      };

      const geometry = feature.getGeometry();
      if (geometry) {
        const coord = geometry.getCoordinates();
        popupOverlay.value.setPosition(coord);

        const extent = geometry.getExtent();
        props.map.getView().fit(extent, { maxZoom: 16, duration: 1000 });
      }
    });
  });
});
</script>

<template>
    <div ref="popupEl" class="ol-popup">
      <a href="#" class="ol-popup-closer" @click.prevent="closePopup">×</a>
      <div class="popup-content">
        <h3>Legenda</h3>
        <p>{{ featureInfo?.nama }}</p>
        <p>{{ featureInfo?.nama_apart }}</p>
        <p>{{ featureInfo?.nama_rusun }}</p>
        <p>{{ featureInfo?.keterangan }}</p>
        <p>{{ featureInfo?.wadmkk }}</p>
        <p>{{ featureInfo?.lokasi }}</p>
        <img v-if="featureInfo?.foto" :src="featureInfo.foto" alt="foto" class="popup-image" />
      </div>
    </div>
  </template>
  

  <style scoped>
  .ol-popup {
    position: absolute;
    background-color: white;
    box-shadow: 0 1px 4px rgba(0,0,0,0.2);
    padding: 15px;
    border-radius: 10px;
    border: 1px solid #ccc;
    min-width: 200px;
    bottom: 12px;
    left: -50%;
    transform: translateX(-50%);
  }
  
  /* Panah kecil */
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
  
  .popup-image {
    width: 100%;
    border-radius: 6px;
    margin-top: 10px;
  }
  </style>
  
