<template>
  <div class="tools1">
    <button @click="toggleLayerList" id="btn-layer-list" class="btn rounded-circle logo" title="Daftar Data">
      <img v-if="!isLayerListVisible" :src="visibleIcon" alt="Show Layer List" class="icon" />
      <i v-else class="fas fa-times icon-close"></i>
    </button>
  </div>

  <div class="layer-manager" v-if="isLayerListVisible">
    <!-- Main Panel -->
    <div class="main-panel">
      <h2>Katalog Layer</h2>

      <div class="action-buttons">
        <button class="add-btn" @click="showAddLayerDialog">
          <i class="fas fa-plus"></i> Tambah Layer
        </button>
        <button
          class="delete-btn"
          @click="confirmDeleteAll"
          :disabled="activeLayers.length === 0"
        >
          <i class="fas fa-trash"></i> Hapus Semua
        </button>
      </div>

      <div v-if="activeLayers.length === 0" class="empty-state">
        <i class="fas fa-layer-group"></i>
        <p>Belum ada layer yang ditambahkan</p>
      </div>

      <!-- Grouped by Category -->
      <div v-else class="layer-list">
        <div v-for="group in groupedActive" :key="group.id" class="group-block">
          <div class="group-header">
            <div class="group-title">
              <span class="group-badge">{{ group.name }}</span>
              <span class="group-count">{{ group.items.length }}</span>
            </div>
            <div class="group-actions">
              <button class="group-btn" @click.stop="setGroupVisibility(group.id, true)">
                Tampilkan semua
              </button>
              <button class="group-btn" @click.stop="setGroupVisibility(group.id, false)">
                Sembunyikan semua
              </button>
            </div>
          </div>

          <div class="group-items">
            <div
              v-for="layer in group.items"
              :key="layer.id"
              class="layer-item"
              :class="{ active: layer.visible }"
            >
              <div class="layer-info">
                <div class="color-swatch" :style="{ backgroundColor: layer.color }"></div>
                <span class="layer-name">{{ layer.name }}</span>
              </div>
              <div class="layer-actions">
                <label class="toggle-switch">
                  <input type="checkbox" v-model="layer.visible" @click.stop />
                  <span class="slider"></span>
                </label>
                <button class="remove-btn" @click.stop="removeLayer(layer.id)">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>
        </div> <!-- /group-block -->
      </div>
    </div>

    <!-- Side Popup -->
    <div v-if="showLayerDialog" class="side-popup">
      <!-- Header -->
      <div class="popup-topbar">
        <h3>Katalog Layer</h3>
        <button class="close-btn" @click="closeDialog">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Search global -->
      <div class="popup-search">
        <i class="fas fa-search"></i>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari"
          aria-label="Cari layer"
        />
      </div>

      <!-- Content: 2 columns -->
      <div class="popup-body">
        <!-- Left: filters -->
        <aside class="left-pane">
          <!-- Kategori -->
          <section class="card">
            <header class="card-header" @click="leftCollapse.kategori = !leftCollapse.kategori">
              <span>Kategori</span>
              <i class="fas" :class="leftCollapse.kategori ? 'fa-chevron-down' : 'fa-chevron-up'"></i>
            </header>
            <div class="card-body" v-show="leftCollapse.kategori">
              <ul class="checklist">
                <li v-for="cat in katalogCategories" :key="cat.id">
                  <label class="checkbox-row">
                    <input type="checkbox" :value="cat.id" v-model="selectedCategoryFilters" />
                    <span>{{ cat.name }}</span>
                  </label>
                </li>
              </ul>
            </div>
          </section>

          <!-- SKPD Pelaksana -->
          <section class="card">
            <header class="card-header" @click="leftCollapse.skpd = !leftCollapse.skpd">
              <span>SKPD Pelaksana</span>
              <i class="fas" :class="leftCollapse.skpd ? 'fa-chevron-down' : 'fa-chevron-up'"></i>
            </header>
            <div class="card-body" v-show="leftCollapse.skpd">
              <div class="mini-search">
                <input v-model="skpdQuery" type="text" placeholder="Cari SKPD" aria-label="Cari SKPD" />
              </div>
              <ul class="checklist">
                <li v-for="skpd in filteredSkpd" :key="skpd.id">
                  <label class="checkbox-row">
                    <input type="checkbox" :value="skpd.id" v-model="selectedSkpd" />
                    <span>{{ skpd.name }}</span>
                  </label>
                </li>
              </ul>
            </div>
          </section>
        </aside>

        <!-- Right: items with toggles (live sync) -->
        <main class="right-pane">
          <div class="items-grid">
            <div
              v-for="item in filteredItems"
              :key="item.id"
              class="item-row"
              :class="{ selected: isSelected(item.id) }"
              @click="toggleLayerSelection(item)"
            >
              <label class="switch">
                <input
                  type="checkbox"
                  :checked="isSelected(item.id)"
                  @change.stop="toggleLayerSelection(item)"
                />
                <span class="slider"></span>
              </label>
              <span class="item-name">{{ item.name }}</span>
            </div>
          </div>
        </main>
      </div>
    </div>

    <!-- Confirmation Dialog -->
    <div v-if="showConfirmDialog" class="dialog-overlay">
      <div class="confirmation-dialog">
        <h3>Hapus semua layer?</h3>
        <p>Anda yakin ingin menghapus semua layer?</p>
        <div class="dialog-actions">
          <button class="cancel-btn" @click="cancelDelete">Batal</button>
          <button class="confirm-btn" @click="deleteAllLayers">Hapus</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import layerGroupIcon from '../assets/layers-group.svg'

/* ===== State utama ===== */
const isLayerListVisible = ref(false)
const activeLayers = ref([])      // daftar layer aktif (sinkron ke main-panel)
const showLayerDialog = ref(false)
const showConfirmDialog = ref(false)
const visibleIcon = layerGroupIcon

/* ===== Dataset katalog ===== */
const katalogCategories = [
  {
    id: 'CAP',
    name: 'CAP',
    items: [
      { id: 'CAP_Apotek', name: 'Apotek', color: '#2E86DE' },
      { id: 'CAP_BankSampah', name: 'Bank Sampah', color: '#17A589' },
      { id: 'CAP_BatasAdmKab', name: 'Batas Administrasi Kabupaten/Kota', color: '#6C3483' },
    ],
  },
  {
    id: 'CIP',
    name: 'CIP',
    items: [
      { id: 'CIP_Jalan', name: 'Jalan', color: '#9C27B0' },
      { id: 'CIP_Apotek', name: 'Apotek', color: '#2E86DE'},
      { id: 'CIP_Saluran', name: 'Saluran', color: '#607D8B' },
      { id: 'CIP_Pagar', name: 'Pagar Pengaman', color: '#795548' },
    ],
  },
  {
    id: 'LAIN',
    name: 'Lainnya',
    items: [
      { id: 'LAIN_RPTRA', name: 'RPTRA', color: '#1ABC9C' },
      { id: 'LAIN_RWKumuh', name: 'RW Kumuh', color: '#D35400' },
    ],
  },
]

/* ===== SKPD (dummy filter) ===== */
const skpdList = [
  { id: 'SUDIN_JAKBAR', name: 'Sudin Jakarta Barat' },
  { id: 'SUDIN_JAKTIM', name: 'Sudin Jakarta Timur' },
  { id: 'SUDIN_JAKTENG', name: 'Sudin Jakarta Tengah' },
  { id: 'SUDIN_JAKUT', name: 'Sudin Jakarta Utara' },
  { id: 'SUDIN_JAKSEL', name: 'Sudin Jakarta Selatan' },
  { id: 'SUDIN_PULAUSERIBU', name: 'Sudin Kepulauan seribu' },
]

/* ===== UI & Filters ===== */
const searchQuery = ref('')
const skpdQuery = ref('')

// DEFAULT: kategori kosong = tampilkan semua data
const selectedCategoryFilters = ref([])

const selectedSkpd = ref([]) // belum dipakai untuk filter item (siap kalau data item punya atribut skpd)
const leftCollapse = ref({ kategori: true, skpd: true })

/* ===== Derived ===== */
const allItems = computed(() =>
  katalogCategories.flatMap(cat => cat.items.map(it => ({ ...it, category: cat.id })))
)

const filteredSkpd = computed(() => {
  const q = skpdQuery.value.trim().toLowerCase()
  if (!q) return skpdList
  return skpdList.filter(s => s.name.toLowerCase().includes(q))
})

const filteredItems = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  const catSel = selectedCategoryFilters.value
  return allItems.value.filter(it => {
    const matchText = !q || it.name.toLowerCase().includes(q)
    const matchCat  = catSel.length === 0 || catSel.includes(it.category)
    return matchText && matchCat
  })
})

/* ===== Helpers ===== */
const buildOrderMap = () => {
  const map = new Map()
  katalogCategories.forEach((cat, ci) => {
    cat.items.forEach((it, ii) => map.set(it.id, ci * 100 + ii))
  })
  return map
}
const orderMap = buildOrderMap()

/* ===== Grouped Active Layers ===== */
const groupedActive = computed(() => {
  // urutan grup mengikuti katalogCategories
  const groups = katalogCategories.map(cat => ({
    id: cat.id,
    name: cat.name,
    items: []
  }))

  const indexById = Object.fromEntries(groups.map((g, i) => [g.id, i]))

  activeLayers.value.forEach(l => {
    const idx = indexById[l.category]
    if (idx !== undefined) groups[idx].items.push(l)
  })

  // urutkan item dalam grup pakai orderMap
  groups.forEach(g => {
    g.items.sort(
      (a, b) => (orderMap.get(a.id) ?? 9999) - (orderMap.get(b.id) ?? 9999)
    )
  })

  // tampilkan hanya grup yang punya item
  return groups.filter(g => g.items.length > 0)
})

/* ===== Actions ===== */
const toggleLayerList = () => { isLayerListVisible.value = !isLayerListVisible.value }
const showAddLayerDialog = () => { showLayerDialog.value = true }
const closeDialog = () => { showLayerDialog.value = false }

const isSelected = (id) => activeLayers.value.some(l => l.id === id)

const toggleLayerSelection = (item) => {
  const exists = activeLayers.value.find(l => l.id === item.id)
  if (exists) {
    // OFF: hapus dari activeLayers
    activeLayers.value = activeLayers.value.filter(l => l.id !== item.id)
  } else {
    // ON: tambah ke activeLayers (default visible = true)
    activeLayers.value.push({ ...item, visible: true })
  }
  // urutkan
  activeLayers.value.sort((a, b) => (orderMap.get(a.id) ?? 9999) - (orderMap.get(b.id) ?? 9999))
}

const removeLayer = (id) => {
  activeLayers.value = activeLayers.value.filter(layer => layer.id !== id)
}

const confirmDeleteAll = () => {
  if (activeLayers.value.length > 0) showConfirmDialog.value = true
}
const cancelDelete = () => { showConfirmDialog.value = false }
const deleteAllLayers = () => {
  activeLayers.value = []
  showConfirmDialog.value = false
}

/* ==== Show/Hide semua per kategori ==== */
const setGroupVisibility = (groupId, visible) => {
  activeLayers.value = activeLayers.value.map(l =>
    l.category === groupId ? { ...l, visible } : l
  )
}

/* ===== Integrasi ke OpenLayers di sini ===== */
watch(activeLayers, (layers) => {
  // contoh:
  // layers.forEach(l => toggleOLLayer(l.id, l.visible))
}, { deep: true })
</script>

<style scoped>
.layer-manager {
  position: absolute;
  top: 105px;
  left: 70px;
  display: flex;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  z-index: 1000;
}

/* Panel kiri daftar activeLayers */
.main-panel {
  width: 250px;
  height: 550px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  padding: 0 16px 16px;
  margin-right: 10px;
}
.main-panel h2 {
  font-size: 1.2rem;
  margin-bottom: 16px;
  color: #333;
  text-align: center;
}
.action-buttons { display: flex; gap: 8px; margin-bottom: 16px; }

button {
  padding: 8px 12px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  transition: all 0.2s;
}
.add-btn { background: #4CAF50; color: #fff; }
.add-btn:hover { background: #3e8e41; }
.delete-btn { background: #f44336; color: #fff; }
.delete-btn:hover { background: #d32f2f; }
.delete-btn:disabled { background: #ccc; cursor: not-allowed; }

.empty-state { padding: 20px; text-align: center; color: #666; font-size: 0.9rem; }
.empty-state i { font-size: 2rem; margin-bottom: 8px; color: #ddd; }

.layer-list { max-height: 420px; overflow-y: auto; }
.layer-item {
  display: flex; justify-content: space-between; align-items: center;
  padding: 10px; margin-bottom: 8px; background: #f9f9f9;
  border-radius: 4px; border: 1px solid #eee;
}
.layer-item.active { border-color: #2196F3; background: #e3f2fd; }
.layer-info { display: flex; align-items: center; gap: 10px; }
.color-swatch { width: 16px; height: 16px; border-radius: 4px; border: 1px solid rgba(0,0,0,0.1); }
.layer-name { font-size: 0.9rem; }
.layer-actions { display: flex; align-items: center; gap: 8px; }
.toggle-switch { position: relative; width: 40px; height: 20px; }
.toggle-switch input { opacity: 0; width: 0; height: 0; }
.slider { position: absolute; inset: 0; background: #ccc; transition: .4s; border-radius: 20px; }
.slider:before { content: ""; position: absolute; height: 16px; width: 16px; left: 2px; bottom: 2px; background: #fff; transition: .4s; border-radius: 50%; }
input:checked + .slider { background: #2196F3; }
input:checked + .slider:before { transform: translateX(20px); }
.remove-btn { background: none; border: none; color: #999; cursor: pointer; padding: 4px; }
.remove-btn:hover { color: #f44336; }

/* Box sizing global biar height konsisten */
*, *::before, *::after { box-sizing: border-box; }

/* Group header */
.group-block { margin-bottom: 12px; }
.group-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 6px 8px; margin: 6px 0 8px;
  background: #f1f7ff; border: 1px solid #e3f0ff; border-radius: 6px;
}
.group-title { display: flex; align-items: center; gap: 8px; font-weight: 600; color: #2a437a; }
.group-badge { letter-spacing: .2px; }
.group-count {
  font-size: 12px; padding: 2px 8px; border-radius: 12px;
  background: #e8f0ff; border: 1px solid #d7e6ff;
}
.group-actions { display: flex; gap: 6px; }
.group-btn {
  background: #ffffff; border: 1px solid #d7e6ff; color: #2a437a;
  padding: 4px 8px; border-radius: 6px; font-size: 12px;
}
.group-btn:hover { background: #eef5ff; }

/* Popup utama */
.side-popup {
  width: 860px;
  height: 550px;
  background: #fff;
  border-radius: 12px;
  display: flex; flex-direction: column;
  overflow: hidden;
  border: 1px solid #E6ECF5;
}

/* Header biru */
.popup-topbar {
  display: flex; align-items: center; justify-content: center;
  background: #35b4ed; color: #fff; height: 56px; position: relative;
}
.popup-topbar h3 { margin: 0; font-size: 20px; font-weight: 600; }
.popup-topbar .close-btn {
  position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
  background: transparent; border: none; color: #fff; font-size: 18px; cursor: pointer;
}

/* Search */
.popup-search {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 14px; border-bottom: 1px solid #EEF2F7;
}
.popup-search i { opacity: 0.6; }
.popup-search input {
  width: 100%; height: 34px; border-radius: 20px;
  border: 1px solid #E0E6EF; padding: 0 12px; outline: none;
}

/* Body 2 kolom */
.popup-body {
  display: grid; grid-template-columns: 280px 1fr; gap: 16px;
  padding: 2px; background: #F7F9FC; flex: 1; overflow: hidden;
  min-height: 0; /* penting untuk overflow anak */
}

/* Left pane */
.left-pane {
  display: flex; flex-direction: column; gap: 8px;
  overflow: hidden; padding: 0; width: 100%; margin: 0;
  min-height: 0;
}
.card {
  background: #fff; border-radius: 8px; border: 1px solid #E6ECF5;
  display: flex; flex-direction: column; width: 100%;
  overflow: hidden; margin: 0;
}
.card-header {
  background: #35b4ed; color: #fff; padding: 2px 4px; font-weight: 600;
  border-radius: 8px; width: 100%; display: flex; align-items: stretch; justify-content: space-between;
  cursor: pointer; position: sticky; top: 0; z-index: 1;
  font-size: 0.9rem;
}
.card-body { padding: 4px 6px; overflow: auto; min-height: 0; }
.mini-search { margin-bottom: 4px; }
.mini-search input {
  width: 100%; height: 28px; border-radius: 14px;
  border: 1px solid #E0E6EF; padding: 0 10px; outline: none; font-size: 0.85rem;
}
.checklist { list-style: none; margin: 0; padding: 0; }
.checkbox-row { display: flex; align-items: center; gap: 8px; padding: 4px 0; font-size: 0.9rem; }

/* Right pane */
.right-pane {
  background: #fff; border-radius: 12px; border: 1px solid #E6ECF5;
  padding: 12px; overflow: auto; min-height: 0;
}
.items-grid { display: grid; grid-template-columns: 1fr 1fr; column-gap: 24px; row-gap: 10px; }
.item-row { display: flex; align-items: center; gap: 10px; min-height: 32px; border-radius: 8px; padding: 4px 8px; }
.item-row.selected { background: #F0F6FF; }
.item-name { font-weight: 600; }

/* Switch */
.switch { position: relative; width: 42px; height: 22px; display: inline-block; }
.switch input { opacity: 0; width: 0; height: 0; }
.switch .slider { position: absolute; inset: 0; background: #D7DFEA; border-radius: 22px; transition: .2s; }
.switch .slider:before {
  content: ""; position: absolute; left: 2px; top: 2px; width: 18px; height: 18px;
  background: #fff; border-radius: 50%; transition: .2s;
}
.switch input:checked + .slider { background: #35b4ed; }
.switch input:checked + .slider:before { transform: translateX(20px); }

/* Overlay konfirmasi */
.dialog-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.5);
  display: flex; justify-content: center; align-items: center; z-index: 1000;
}
.confirmation-dialog {
  background: #fff; border-radius: 8px; padding: 20px; width: 300px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}
.confirmation-dialog h3 { margin-top: 0; font-size: 1.1rem; }
.confirmation-dialog p { margin-bottom: 20px; color: #666; }
.dialog-actions { display: flex; justify-content: flex-end; gap: 8px; }

/* Scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: #f1f1f1; }
::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #a8a8a8; }

/* Tombol trigger */
.btn.logo, .btn.logo:active:focus {
  background-color: white;
  margin-left: 10px;
  width: 10vw; height: 10vw; max-width: 50px; max-height: 50px;
  border-radius: 8px; border: 2px solid transparent;
  display: flex; justify-content: center; align-items: center;
  box-shadow: 5px 5px 5px rgba(0,0,0,0.1);
}
.btn.logo:hover { background-color: white; border-color: slateblue; transition: all 500ms; }
.icon { height: 4vw; max-height: 30px; width: auto; }
.tools1 { position: absolute; z-index: 1; top: 105px; left: 0px; }

/* Responsif */
@media (max-width: 768px) {
  .btn.logo { width: 12vw; height: 12vw; }
  .icon { height: 5vw; }
  .tools1 { top: 22vh; left: 2vw; }
}
@media (max-width: 480px) {
  .btn.logo { width: 14vw; height: 14vw; }
  .icon { height: 6vw; }
}
</style>
