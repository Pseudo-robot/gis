<template>
    <div></div>
</template>

<script setup>
import { onMounted } from 'vue';
import { Zoom } from 'ol/control';

const props = defineProps({
    map: {
        type: Object,
        required: true
    }
});

onMounted(() => {
    const zoomButton = new Zoom();    
    props.map.addControl(zoomButton);
});
</script>

<style scoped>

</style>
