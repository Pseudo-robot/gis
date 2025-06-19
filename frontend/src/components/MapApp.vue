<template>
    <div id="map" class="map"></div>
    <div class="tools">
        <button @click="toggleLayerList" id="btn-layer-list" class="btn rounded-circle logo" title="Daftar Data">
            <img v-if="!isLayerListVisible" :src="visibleIcon" alt="Show Layer List" class="icon"/>
            <i v-else class="fas fa-times icon-close"></i>
        </button>
    </div>
    <div>
        <button @click="toggleBasemapList" class="btn-basemap">
            <img :src="selectedBasemapImage" alt="Selected Basemap" />
        </button>
    </div>
    <div>
        <MousePosition v-if="mapInstance" :map="mapInstance" />
        <ZoomButton v-if="mapInstance" :map="mapInstance" />
        <HomeButton v-if="mapInstance" :map="mapInstance" />
        <FeatureInfo v-if="mapInstance && overlayGroups" :map="mapInstance" :overlaygroup="overlayGroups" />
        <LayerList v-if="mapInstance && overlayGroups && isLayerListVisible" :map="mapInstance" :overlaygroup="overlayGroups" :layers="vectorLayers" />
        <BasemapList v-if="mapInstance && overlayGroups && isBasemapListVisible"
                     :map="mapInstance"
                     :overlaygroup="overlayGroups"
                     :isvisible="isBasemapListVisible"
                     @update:activeBasemapImage="selectedBasemapImage = $event"
                     @close="isBasemapListVisible = false"/>
        <SearchFeature v-if="mapInstance && overlayGroups" :map="mapInstance" :overlaygroup="overlayGroups" :layers="vectorLayers" />
        <!-- <Sidebar v-if="mapInstance && overlayGroups" :map="mapInstance" :overlaygroup="overlayGroups" /> -->
    </div>
</template>

<script setup>
import 'ol/ol.css';

import { ref, onMounted, provide } from 'vue';
import { Map, View } from 'ol';
import { ScaleLine } from 'ol/control';
import { Tile as TileLayer } from 'ol/layer';
import { fromLonLat } from 'ol/proj';
import { TileWMS } from 'ol/source.js'; 

import MousePosition from './MousePosition.vue';
import ZoomButton from './ZoomButton.vue';
import HomeButton from './HomeButton.vue';
import FeatureInfo from './FeatureInfo.vue';
import LayerList from './LayerList.vue';
import BasemapList from './BasemapList.vue';
import SearchFeature from './SearchFeature.vue';

import { fetchLayer } from './fetchLayer.js'

import layerGroupIcon from '../assets/layers-group.svg';
import defaultBasemap from '../assets/basemap0.png';
// import Sidebar from './Sidebar.vue';

const mapInstance = ref(null);
const overlayGroups = ref(null);
const vectorLayers = ref(null);
const isLayerListVisible = ref(false);
const isBasemapListVisible = ref(false);
const selectedBasemapImage = ref(defaultBasemap);

const visibleIcon = layerGroupIcon

const toggleLayerList = () => {
    isLayerListVisible.value = !isLayerListVisible.value;
};
const toggleBasemapList = () => {
    isBasemapListVisible.value = !isBasemapListVisible.value;
};

onMounted(async () => {
    mapInstance.value = new Map({
        target: 'map',
        view: new View({
        center: fromLonLat([106.8272, -6.1751]), // Jakarta
        zoom: 11,
        maxZoom: 18,
        minZoom: 8,
        }),
        controls: [],
    });

    mapInstance.value.addControl(new ScaleLine({ bar: true, text: false }));
    overlayGroups.value = await fetchLayer();
    overlayGroups.value.forEach(group => mapInstance.value.addLayer(group));
    vectorLayers.value = overlayGroups.value.flatMap(group =>
        group.getLayersArray().filter(layer => !(layer instanceof TileLayer)));
});

</script>

<style scoped>
#map {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    transition: all 500ms ease-out;
}

.btn-basemap {
    border: 0;
    border-radius: 10px;
    width: 10vw;
    max-width: 55px;
    height: 10vw;
    max-height: 55px;
    aspect-ratio: 1 / 1;
    right: 1vw;
    bottom: 1vh;
    z-index: 998;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
}

.btn-basemap img {
    border: 2px solid white;
    width: 50px;               /* Keep the image dimensions */
    height: 50px;
    border-radius: 10px;
}

.btn-basemap:hover img {
    border-color: darkslateblue;
    transition: all 500ms;
}

/* Use :deep() to target global OpenLayers classes within scoped styles */
:deep(.ol-zoom) {
    position: absolute;
    top: 1vh;
    right: 1vw;
    left: auto;
    background-color: transparent;
    transition: all 500ms ease-out;
}

:deep(.ol-zoom-in), :deep(.ol-zoom-out) {
    width: 8vw;
    max-width: 30px;
    height: 8vw;
    max-height: 30px;
    font-size: 1.2rem;
    border-radius: 25%;
    border: 2px solid transparent;
    margin-bottom: 0.5vh;
    cursor: pointer;
    transition: border-color 0.3s ease;
}

:deep(.ol-zoom-in:hover), :deep(.ol-zoom-out:hover){
    border-color: slateblue;
    transition: all 500ms;
}

:deep(.ol-zoom button) {
    width: 30px;
    height: 30px;
    transition: all 500ms;
    cursor: pointer;
}

.btn.logo,
.btn.logo:active:focus {
  background-color: white;
  margin-left: 0.5vw;
  width: 10vw;
  height: 10vw;
  max-width: 40px;
  max-height: 40px;
  border-radius: 50%;
  border: 2px solid transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1);
}

.btn.logo:hover {
  background-color: white;
  border-color: slateblue;
  transition: all 500ms;
}

.icon {
  height: 4vw;
  max-height: 20px;
  width: auto;
}

.tools {
    position: absolute;
    z-index: 1;
    top: 110px;
    left: 0px;
}

/* Responsif tambahan untuk layar kecil */
@media (max-width: 768px) {
  .btn.logo {
    width: 12vw;
    height: 12vw;
  }

  .icon {
    height: 5vw;
  }

  .tools {
    top: 13vh;
    left: 2vw;
  }

  :deep(.ol-zoom-in),
  :deep(.ol-zoom-out) {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .btn.logo {
    width: 14vw;
    height: 14vw;
  }

  .icon {
    height: 6vw;
  }
}
</style>
