<template>
  <div class="layer-manager">
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

      <div v-else class="layer-list">
        <div 
          v-for="layer in activeLayers" 
          :key="layer.id" 
          class="layer-item"
          :class="{ 'active': layer.visible }"
        >
          <div class="layer-info">
            <div class="color-swatch" :style="{ backgroundColor: layer.color }"></div>
            <span class="layer-name">{{ layer.name }}</span>
          </div>
          <div class="layer-actions">
            <label class="toggle-switch">
              <input 
                type="checkbox" 
                v-model="layer.visible"
                @click.stop
              >
              <span class="slider"></span>
            </label>
            <button class="remove-btn" @click.stop="removeLayer(layer.id)">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Side Popup -->
    <div v-if="showLayerDialog" class="side-popup">
      <div class="popup-header">
        <h3>Pilih Layer</h3>
        <button class="close-btn" @click="closeDialog">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="category-container">
        <div 
          v-for="category in categories" 
          :key="category.id" 
          class="category-item"
        >
          <div 
            class="category-header"
            @click="toggleCategory(category.id)"
          >
            <i 
              class="fas fa-chevron-right arrow-icon"
              :class="{ rotated: expandedCategories[category.id] }"
            ></i>
            <span>{{ category.name }}</span>
          </div>

          <div 
            class="layer-options"
            v-show="expandedCategories[category.id]"
          >
            <div 
              v-for="item in category.items" 
              :key="item.id"
              class="layer-option"
              :class="{ 'selected': isSelected(item.id) }"
              @click="toggleLayerSelection(item)"
            >
              <div class="option-color" :style="{ backgroundColor: item.color }"></div>
              <span>{{ item.name }}</span>
              <i 
                class="fas fa-check check-icon"
                v-if="isSelected(item.id)"
              ></i>
            </div>
          </div>
        </div>
      </div>

      <div class="popup-footer">
        <button class="cancel-btn" @click="closeDialog">Batal</button>
        <button class="confirm-btn" @click="addSelectedLayers">Tambahkan</button>
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
import { ref, onMounted } from 'vue';
import { fetchLayer } from './fetchLayer';

// State
const activeLayers = ref([]);
const selectedLayers = ref([]);
const expandedCategories = ref({});
const showLayerDialog = ref(false);
const showConfirmDialog = ref(false);
const loading = ref(false);
const error = ref(null);

// Data layer from fetchLayer.js
const categories = ref([
  {
    id: 'POINT',
    name: 'CIP POINT',
    items: []
  },
  {
    id: 'LINE',
    name: 'CIP LINE',
    items: []
  },
  {
    id: 'DATA',
    name: 'DATA LAINNYA',
    items: []
  }
]);

// Initialization
onMounted(async () => {
  await initializeLayers();
});

async function initializeLayers() {
  try {
    loading.value = true;
    error.value = null;
    
    const [_, overlayGroup] = await fetchLayer();
    const layers = overlayGroup.getLayers().getArray();
    
    // Reset categories
    categories.value.forEach(cat => {
      cat.items = [];
      expandedCategories.value[cat.id] = true;
    });
    
    // Categorize layers
    layers.forEach(layer => {
      const title = layer.get('title');
      const name = layer.get('name') || title.toLowerCase().replace(/\s+/g, '_');
      const style = layer.getStyle();
      let color = '#000000';
      
      if (style) {
        const stroke = style.getStroke();
        if (stroke) color = stroke.getColor();
        else {
          const fill = style.getFill();
          if (fill) color = fill.getColor();
        }
      }
      
      const layerItem = {
        id: name,
        name: title,
        color,
        layer: layer,
        visible: false
      };
      
      // Categorize based on type
      if (name.includes('point') || name.includes('pt') || name.includes('cippt')) {
        categories.value[0].items.push(layerItem);
      } else if (name.includes('line') || name.includes('pl') || name.includes('cipl')) {
        categories.value[1].items.push(layerItem);
      } else {
        categories.value[2].items.push(layerItem);
      }
    });
    
  } catch (err) {
    console.error('Error initializing layers:', err);
    error.value = err.message || 'Failed to load layers';
  } finally {
    loading.value = false;
  }
}

// UI Methods
const showAddLayerDialog = () => {
  selectedLayers.value = activeLayers.value.map(layer => layer.id);
  showLayerDialog.value = true;
};

const closeDialog = () => {
  showLayerDialog.value = false;
};

const toggleCategory = (categoryId) => {
  expandedCategories.value[categoryId] = !expandedCategories.value[categoryId];
};

// Layer Selection Methods
const toggleLayerSelection = (item) => {
  const index = selectedLayers.value.indexOf(item.id);
  if (index === -1) {
    selectedLayers.value.push(item.id);
  } else {
    selectedLayers.value.splice(index, 1);
  }
};

const isSelected = (id) => {
  return selectedLayers.value.includes(id);
};

// Layer Management Methods
const addSelectedLayers = () => {
  categories.value.forEach(category => {
    category.items.forEach(item => {
      if (selectedLayers.value.includes(item.id) && 
          !activeLayers.value.some(l => l.id === item.id)) {
        // Activate the layer in OpenLayers
        item.layer.setVisible(true);
        activeLayers.value.push({
          ...item,
          visible: true
        });
      }
    });
  });
  
  closeDialog();
};

const toggleLayerVisibility = (layer) => {
  layer.layer.setVisible(layer.visible);
};

const removeLayer = (id) => {
  const index = activeLayers.value.findIndex(layer => layer.id === id);
  if (index !== -1) {
    // Deactivate the layer in OpenLayers
    activeLayers.value[index].layer.setVisible(false);
    activeLayers.value.splice(index, 1);
  }
};

// Delete Methods
const confirmDeleteAll = () => {
  if (activeLayers.value.length > 0) {
    showConfirmDialog.value = true;
  }
};

const cancelDelete = () => {
  showConfirmDialog.value = false;
};

const deleteAllLayers = () => {
  // Deactivate all layers in OpenLayers
  activeLayers.value.forEach(layer => {
    layer.layer.setVisible(false);
  });
  activeLayers.value = [];
  showConfirmDialog.value = false;
};
</script>

<style scoped>
.layer-manager {
  position: absolute;
  top: 180px;
  left: 80px;
  display: flex;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  z-index: 1000;
}

.main-panel {
  width: 300px;
  height: 550px; /* Fixed height */
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  padding: 16px;
  margin-right: 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* Ensures no overflow outside the panel */
}


.main-panel h2 {
  font-size: 1.2rem;
  margin-bottom: 16px;
  color: #333;
  text-align: center; /* Add this line to center the text */
}

.action-buttons {
  display: flex;
  gap: 35px;
  margin-bottom: 16px;
}

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

.add-btn {
  background: #4CAF50;
  color: white;
}

.add-btn:hover {
  background: #3e8e41;
}

.delete-btn {
  background: #f44336;
  color: white;
}

.delete-btn:hover {
  background: #d32f2f;
}

.delete-btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.empty-state {
  padding: 20px;
  text-align: center;
  color: #666;
  font-size: 0.9rem;
}

.empty-state i {
  font-size: 2rem;
  margin-bottom: 8px;
  color: #ddd;
}

.layer-list {
  max-height: 500px;
  overflow-y: auto;
}

.layer-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin-bottom: 8px;
  background: #f9f9f9;
  border-radius: 4px;
  border: 1px solid #eee;
}

.layer-item.active {
  border-color: #2196F3;
  background: #e3f2fd;
}

.layer-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.color-swatch {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 1px solid rgba(0,0,0,0.1);
}

.layer-name {
  font-size: 0.9rem;
}

.layer-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 20px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:checked + .slider:before {
  transform: translateX(20px);
}

.remove-btn {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 4px;
}

.remove-btn:hover {
  color: #f44336;
}

/* Side Popup Styles */
.side-popup {
  width: 300px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  max-height: 580px; /* Batasi tinggi maksimum popup */
  overflow-y: auto; /* Tambahkan scroll jika konten melebihi tinggi maksimum */
  display: flex;
  flex-direction: column;

}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
  flex-shrink: 0; /* Pastikan header tidak menyusut */

}

.popup-header h3 {
  font-size: 1.1rem;
  margin: 0;
}

.popup-content {
  overflow-y: auto; /* Aktifkan scroll vertikal ketika konten melebihi tinggi */
  padding: 16px;
  flex-grow: 1; /* Isi sisa ruang yang tersedia */
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  font-size: 1rem;
}

.close-btn:hover {
  color: #333;
}

.category-container {
  flex: 1;
  overflow-y: auto;
  padding: 0 16px;
}

.category-item {
  margin-bottom: 12px;
}

.category-header {
  display: flex;
  align-items: center;
  padding: 8px 0;
  cursor: pointer;
  font-weight: 500;
  color: #444;
}

.arrow-icon {
  font-size: 0.8rem;
  margin-right: 8px;
  transition: transform 0.2s;
}

.arrow-icon.rotated {
  transform: rotate(90deg);
}

.layer-options {
  margin-left: 16px;
  border-left: 2px solid #eee;
  padding-left: 10px;
}

.layer-option {
  display: flex;
  align-items: center;
  padding: 8px;
  margin-bottom: 4px;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
}

.layer-option:hover {
  background: #f5f5f5;
}

.layer-option.selected {
  background: #e3f2fd;
}

.option-color {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  margin-right: 8px;
  border: 1px solid rgba(0,0,0,0.1);
}

.check-icon {
  margin-left: auto;
  color: #2196F3;
  font-size: 0.8rem;
}

.popup-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px;
  border-top: 1px solid #eee;
}

.cancel-btn {
  background: #f1f1f1;
  color: #333;
}

.cancel-btn:hover {
  background: #e0e0e0;
}

.confirm-btn {
  background: #2196F3;
  color: white;
}

.confirm-btn:hover {
  background: #0b7dda;
}

/* Confirmation Dialog */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.confirmation-dialog {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  width: 300px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}

.confirmation-dialog h3 {
  margin-top: 0;
  font-size: 1.1rem;
}

.confirmation-dialog p {
  margin-bottom: 20px;
  color: #666;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
