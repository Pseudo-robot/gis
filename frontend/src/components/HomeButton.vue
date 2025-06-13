<script setup>
import { ref, onMounted } from 'vue';
import Control from 'ol/control/Control.js';
import View from 'ol/View';
import { fromLonLat } from 'ol/proj';

const props = defineProps({
  map: Object
});

const homeButton = ref(null);

const goToHome = () => {
  let initialZoom = 11;
  let initialLonLat = fromLonLat([106.8272, -6.1751]);
  let maxZoom = 18;
  let minZoom = 8;

  let initialView = new View({
    center: initialLonLat,
    zoom: initialZoom,
    maxZoom: maxZoom,
    minZoom: minZoom,
  });

  props.map.setView(initialView);
  view.animate({
    center: initialCenter,
    duration: 1000, // dalam milidetik (1 detik)
  });

  view.animate({
    zoom: initialZoom,
    duration: 1000,
  });
};

onMounted(() => {
  const homeControl = new Control({
    element: homeButton.value,  // Use ref to attach the Vue template button to OpenLayers
  });
  props.map.addControl(homeControl);
});
</script>

<template>
  <div ref="homeButton" class="myButtonDiv">
    <button class="myButton" @click="goToHome" title="Home"></button>
  </div>
</template>

<style scoped>
.myButton {
    background-color:white;
    background-image: url('../assets/home.svg');
    /* color: slateblue; */
    /* font-weight: 700;
    text-align: center; */
    height: 40px;
    width: 40px;
    border-radius: 100%;
    border: 2px solid transparent;
    /* align-items: center;
    font-size: 25px; */
    background-position: center;
    background-repeat: no-repeat;
    background-size: 20px 20px;
    cursor: pointer;
}

.myButton:hover {
    border-color: slateblue;
    transition: all 500ms;
}

.myButton.clicked {
    color: white;
}

.myButtonDiv {
    top: 60px;
    left: 10px;
    position: absolute;
    /* margin: 100px auto auto 10px; */
}
</style>
