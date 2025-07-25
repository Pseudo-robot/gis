<template>
  <div class="button-filter">
    <button @click="togglePanel" :class="{ active: !panelCollapsed }">
      <i class="fas fa-filter"></i> Filter
    </button>
  </div>

  <div class="map-container" :class="{ collapsed: panelCollapsed }">
    <div class="filter-panel">
      <div class="panel-header">
        <h2><i class="fas fa-filter"></i> Filter Wilayah</h2>
        <button @click="togglePanel" style="background: none;">
          <i class="fas fa-close"></i>
        </button>
      </div>

      <div class="filter-group">
        <h3><i class="fas fa-city"></i> Kota/Kabupaten</h3>
        <select v-model="selectedKota" @change="loadKecamatan">
          <option value="">Pilih Kota/Kabupaten</option>
          <option v-for="kota in kotaList" :key="kota.id" :value="kota">
            {{ kota.name }}
          </option>
        </select>
      </div>

      <div class="filter-group">
        <h3><i class="fas fa-map-marked-alt"></i> Kecamatan</h3>
        <select v-model="selectedKecamatan" @change="loadKelurahan" :disabled="!selectedKota">
          <option value="">Pilih Kecamatan</option>
          <option v-for="kec in kecamatanList" :key="kec.id" :value="kec">
            {{ kec.name }}
          </option>
        </select>
      </div>

      <div class="filter-group">
        <h3><i class="fas fa-map-pin"></i> Kelurahan</h3>
        <select v-model="selectedKelurahan" @change="zoomToLocation" :disabled="!selectedKecamatan">
          <option value="">Pilih Kelurahan</option>
          <option v-for="kel in kelurahanList" :key="kel.id" :value="kel">
            {{ kel.name }}
          </option>
        </select>
      </div>

      <div class="button-reset-apply">
        <button class="reset-btn" @click="resetFilters">
          Reset Filter
        </button>
        <button class="apply-btn" @click="applyFilters">
          Apply Filter
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'

const panelCollapsed = ref(true);

const sampleData = {
  kota: [
    // DKI Jakarta
    { id: 11, provinsi_id: 1, name: "Jakarta Pusat" },
    { id: 12, provinsi_id: 1, name: "Jakarta Selatan" },
    { id: 13, provinsi_id: 1, name: "Jakarta Barat" },
    { id: 14, provinsi_id: 1, name: "Jakarta Timur" },
    { id: 15, provinsi_id: 1, name: "Jakarta Utara" },
  ],
  kecamatan: [
    // Jakarta Pusat
    { id: 111, kota_id: 11, name: "Gambir" },
    { id: 112, kota_id: 11, name: "Sawah Besar" },
    // Jakarta Selatan
    { id: 121, kota_id: 12, name: "Kebayoran Baru" },
    { id: 122, kota_id: 12, name: "Pasar Minggu" },
    // Jakarta Barat
    { id: 131, kota_id: 13, name: "Kebon Jeruk" },
    { id: 132, kota_id: 13, name: "Kalideres" },
    // Jakarta Timur
    { id: 141, kota_id: 14, name: "Cakung" },
    { id: 142, kota_id: 14, name: "Pulo Gadung" },
    // Jakarta Utara
    { id: 151, kota_id: 15, name: "Kalibaru" },
    { id: 152, kota_id: 15, name: "Rorotan" }
  ],
  kelurahan: [
    // Gambir
    { id: 1111, kecamatan_id: 111, name: "Gambir", center: [-6.1761, 106.8170] },
    { id: 1112, kecamatan_id: 111, name: "Kebon Kelapa", center: [-6.1728, 106.8236] },
    // Sawah Besar
    { id: 1121, kecamatan_id: 112, name: "Karang Anyar", center: [-6.1528, 106.8318] },
    { id: 1122, kecamatan_id: 112, name: "Pasar Baru", center: [-6.1608, 106.8324] },
    // Kebayoran Baru
    { id: 1211, kecamatan_id: 121, name: "Selong", center: [-6.2439, 106.7958] },
    { id: 1212, kecamatan_id: 121, name: "Gunung", center: [-6.2403, 106.8024] },
    // Bandung Kulon
    { id: 2111, kecamatan_id: 211, name: "Caringin", center: [-6.9219, 107.5688] },
    { id: 2112, kecamatan_id: 211, name: "Sukaraja", center: [-6.9167, 107.5833] }
  ]
};
let kotaList = [{ id: 11, provinsi_id: 1, name: "Jakarta Pusat" },
{ id: 12, provinsi_id: 1, name: "Jakarta Selatan" },
{ id: 13, provinsi_id: 1, name: "Jakarta Barat" },
{ id: 14, provinsi_id: 1, name: "Jakarta Timur" },
{ id: 15, provinsi_id: 1, name: "Jakarta Utara" }];
const kecamatanList = ref([])
const kelurahanList = ref([]);
const selectedKota = ref(null);
const selectedKecamatan = ref(null);
const selectedKelurahan = ref(null);


const loadKecamatan = async () => {
  if (!selectedKota.value) return;
  selectedKecamatan.value = null;
  selectedKelurahan.value = null;
  kecamatanList.value = [];
  kelurahanList.value = [];

  kecamatanList.value = sampleData.kecamatan.filter(
    k => k.kota_id === selectedKota.value.id
  );
}

const loadKelurahan = async () => {
  if (!selectedKecamatan.value) return;

  selectedKelurahan.value = null;
  kelurahanList.value = [];

  kelurahanList.value = sampleData.kelurahan.filter(
    k => k.kecamatan_id === selectedKecamatan.value.id
  );
}

const togglePanel = () => {
  panelCollapsed.value = !panelCollapsed.value;
};

const resetFilters = () => {
  selectedKota.value = null;
  selectedKecamatan.value = null;
  selectedKelurahan.value = null;
};

const applyFilters = () => {
   panelCollapsed.value = !panelCollapsed.value;
};
</script>

<style scoped>
.button-filter {
  justify-items: flex-end;
  margin-top: 165px;
  position: absolute;
  right: 0;
  z-index: 1000;
  margin-right: 30px;

  button {
    background: white;
    border: 2px solid rgba(0, 0, 0, 0.2);
    border-radius: 3px;
  }
}

.map-container {
  width: 30%;
  justify-items: flex-end;
  margin-top: 165px;
  background: white;
  position: absolute;
  right: 0;
  z-index: 1000;
  margin-right: 30px;
}

.filter-panel {
  height: 370px;
  width: 100%;
  background: white;
  padding: 1.25rem;
  overflow-y: auto;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  transition: var(--transition);
  border-left: 1px solid #e0e0e0;
}

.map-container.collapsed {
  display: none;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.panel-header h2 {
  font-size: 1.25rem;
  color: var(--dark-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.toggle-panel {
  background: #83dbf6;
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);
}

.toggle-panel:hover {
  background: var(--secondary-color);
  transform: rotate(90deg);
}

.filter-group {
  margin-bottom: 1.5rem;
  position: relative;
}

.filter-group h3 {
  font-size: 1rem;
  margin-bottom: 0.75rem;
  color: var(--dark-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-group select {
  border-radius: 3px;
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  font-size: 0.95rem;
  transition: var(--transition);
  background-color: white;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1rem;
}

.filter-group select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.filter-group select:disabled {
  background-color: #f9f9f9;
  color: #999;
}

.loading {
  padding: 1rem;
  text-align: center;
  color: #666;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.button-reset-apply {
  gap: 8px;
  justify-content: center;
  display: flex;

}

.reset-btn {
  background-color: 1px solid #ddd;
  background-color: #c5c4c4;
  border-radius: 3px;
}

.reset-btn:hover {
  background-color: #d5d4d4;
}

.apply-btn {
  background-color: #78d2ed;
  border-radius: 3px;
}

.apply-btn:hover {
  background-color: #8ee0f9;
}

.map-controls {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.map-control-btn {
  background: green;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--box-shadow);
  cursor: pointer;
  transition: var(--transition);
  color: var(--dark-color);
}

.map-control-btn:hover {
  background: var(--light-color);
  transform: scale(1.1);
}

.map-control-btn.active {
  background: var(--primary-color);
  color: white;
}

@media (max-width: 768px) {
  .map {
    width: 100%;
  }

  .map-container {
    width: 30%;
    justify-items: flex-end;
    margin-top: 165px;
    background: white;
    position: absolute;
    right: 0;
    z-index: 10000;
    margin-right: 30px;
  }

  .filter-panel {
    width: 100%;
    background: white;
    padding: 1.25rem;
    overflow-y: auto;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    transition: var(--transition);
    border-left: 1px solid #e0e0e0;
  }

  .filter-panel:not(.collapsed) {
    transform: translateX(0);
  }
}
</style>