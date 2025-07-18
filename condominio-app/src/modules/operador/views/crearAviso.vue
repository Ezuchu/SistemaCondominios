<template>
  <div class="crear-aviso-view">
    <!-- Header -->
    <div class="view-header">
      <button class="back-btn" @click="$emit('back')">
        <i class="bi bi-arrow-left"></i>
      </button>
      <div class="header-content">
        <h2 class="view-title">Crear Nuevo Aviso</h2>
        <p class="view-subtitle">Publica un aviso para los propietarios</p>
      </div>
    </div>

    <div class="form-container">
      <div class="form-card">
        <div class="form-header">
          <h5 class="form-title">
            <i class="bi bi-megaphone me-2"></i>
            Información del Aviso
          </h5>
        </div>
        
        <div class="form-body">
          <form @submit.prevent="crearAviso">
            <div class="form-grid">
              <!-- Título -->
              <div class="form-group form-group--full">
                <label class="form-label">Título del Aviso *</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="formData.titulo"
                  placeholder="Ej: Mantenimiento de ascensores programado"
                  required
                  maxlength="100"
                >
                <small class="form-text">{{ formData.titulo.length }}/100 caracteres</small>
              </div>

              <!-- Tipo -->
              <div class="form-group">
                <label class="form-label">Tipo de Aviso *</label>
                <div class="select-wrapper">
                  <select class="form-select" v-model="formData.tipo" required>
                    <option value="">Seleccionar tipo</option>
                    <option value="mantenimiento">Mantenimiento</option>
                    <option value="asamblea">Asamblea</option>
                    <option value="emergencia">Emergencia</option>
                    <option value="general">General</option>
                  </select>
                  <i class="bi bi-chevron-down select-arrow"></i>
                </div>
              </div>

              <!-- Prioridad -->
              <div class="form-group">
                <label class="form-label">Prioridad</label>
                <div class="priority-buttons">
                  <button 
                    type="button"
                    :class="['priority-btn', { 'priority-btn--active': formData.prioridad === 'baja' }]"
                    @click="formData.prioridad = 'baja'"
                  >
                    <i class="bi bi-circle-fill text-success"></i>
                    Baja
                  </button>
                  <button 
                    type="button"
                    :class="['priority-btn', { 'priority-btn--active': formData.prioridad === 'media' }]"
                    @click="formData.prioridad = 'media'"
                  >
                    <i class="bi bi-circle-fill text-warning"></i>
                    Media
                  </button>
                  <button 
                    type="button"
                    :class="['priority-btn', { 'priority-btn--active': formData.prioridad === 'alta' }]"
                    @click="formData.prioridad = 'alta'"
                  >
                    <i class="bi bi-circle-fill text-danger"></i>
                    Alta
                  </button>
                </div>
              </div>

              <!-- Resumen -->
              <div class="form-group form-group--full">
                <label class="form-label">Resumen *</label>
                <textarea 
                  class="form-control" 
                  rows="2"
                  v-model="formData.resumen"
                  placeholder="Breve descripción que aparecerá en la lista de avisos..."
                  required
                  maxlength="200"
                ></textarea>
                <small class="form-text">{{ formData.resumen.length }}/200 caracteres</small>
              </div>

              <!-- Contenido -->
              <div class="form-group form-group--full">
                <label class="form-label">Contenido del Aviso *</label>
                <div class="editor-toolbar">
                  <button type="button" class="toolbar-btn" @click="insertText('**', '**')" title="Negrita">
                    <i class="bi bi-type-bold"></i>
                  </button>
                  <button type="button" class="toolbar-btn" @click="insertText('*', '*')" title="Cursiva">
                    <i class="bi bi-type-italic"></i>
                  </button>
                  <button type="button" class="toolbar-btn" @click="insertText('### ', '')" title="Título">
                    <i class="bi bi-type-h3"></i>
                  </button>
                  <button type="button" class="toolbar-btn" @click="insertList()" title="Lista">
                    <i class="bi bi-list-ul"></i>
                  </button>
                </div>
                <textarea 
                  ref="contentTextarea"
                  class="form-control content-editor" 
                  rows="12"
                  v-model="formData.contenido"
                  placeholder="Escribe el contenido completo del aviso aquí...

Puedes usar:
- **texto** para negrita
- *texto* para cursiva  
- ### Título para encabezados
- - elemento para listas"
                  required
                ></textarea>
                <small class="form-text">Usa Markdown para dar formato al texto</small>
              </div>
            </div>

            <!-- Preview -->
            <div class="preview-section" v-if="formData.contenido">
              <h6 class="preview-title">
                <i class="bi bi-eye me-2"></i>
                Vista Previa
              </h6>
              <div class="preview-content" v-html="contenidoFormateado"></div>
            </div>

            <!-- Form Actions -->
            <div class="form-actions">
              <button type="button" class="btn btn-outline" @click="$emit('back')">
                <i class="bi bi-x-circle me-2"></i>
                Cancelar
              </button>
              <button type="submit" class="btn btn-primary" :disabled="publicando">
                <span v-if="publicando" class="spinner"></span>
                <i v-else class="bi bi-send me-2"></i>
                {{ publicando ? 'Publicando...' : 'Publicar Aviso' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Tips Card -->
      <div class="tips-card">
        <div class="tips-header">
          <h6 class="tips-title">
            <i class="bi bi-lightbulb me-2"></i>
            Consejos para un Buen Aviso
          </h6>
        </div>
        <div class="tips-body">
          <div class="tip-item">
            <i class="bi bi-check-circle text-success"></i>
            <span>Usa un título claro y descriptivo</span>
          </div>
          <div class="tip-item">
            <i class="bi bi-calendar3 text-info"></i>
            <span>Incluye fechas y horarios específicos</span>
          </div>
          <div class="tip-item">
            <i class="bi bi-person-check text-primary"></i>
            <span>Menciona a quién contactar si hay dudas</span>
          </div>
          <div class="tip-item">
            <i class="bi bi-exclamation-triangle text-warning"></i>
            <span>Usa la prioridad adecuada</span>
          </div>
          <div class="tip-item">
            <i class="bi bi-list-check text-success"></i>
            <span>Organiza la información en listas</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['back', 'created'])

const publicando = ref(false)
const contentTextarea = ref(null)

const formData = ref({
  titulo: '',
  tipo: '',
  prioridad: 'media',
  resumen: '',
  contenido: ''
})

const contenidoFormateado = computed(() => {
  let html = formData.value.contenido
  
  // Convertir markdown básico a HTML
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')
  html = html.replace(/^### (.*$)/gim, '<h6>$1</h6>')
  html = html.replace(/^- (.*$)/gim, '<li>$1</li>')
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
  html = html.replace(/\n/g, '<br>')
  
  return html
})

const insertText = (before, after) => {
  const textarea = contentTextarea.value
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = formData.value.contenido.substring(start, end)
  
  const newText = before + selectedText + after
  formData.value.contenido = 
    formData.value.contenido.substring(0, start) + 
    newText + 
    formData.value.contenido.substring(end)
  
  // Restaurar el foco y la selección
  setTimeout(() => {
    textarea.focus()
    textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length)
  }, 0)
}

const insertList = () => {
  const textarea = contentTextarea.value
  const start = textarea.selectionStart
  
  const listText = '\n- Elemento 1\n- Elemento 2\n- Elemento 3\n'
  formData.value.contenido = 
    formData.value.contenido.substring(0, start) + 
    listText + 
    formData.value.contenido.substring(start)
  
  setTimeout(() => {
    textarea.focus()
    textarea.setSelectionRange(start + listText.length, start + listText.length)
  }, 0)
}

const crearAviso = async () => {
  publicando.value = true
  
  try {
    // Simular publicación
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const nuevoAviso = {
      id: Date.now(),
      ...formData.value,
      fechaPublicacion: new Date().toISOString().split('T')[0],
      creador: 'Carlos Rodríguez',
      vistas: 0
    }
    
    console.log('Nuevo aviso creado:', nuevoAviso)
    emit('created', nuevoAviso)
    
    // Limpiar formulario
    formData.value = {
      titulo: '',
      tipo: '',
      prioridad: 'media',
      resumen: '',
      contenido: ''
    }
    
  } catch (error) {
    console.error('Error al crear aviso:', error)
  } finally {
    publicando.value = false
  }
}
</script>

<style scoped lang="scss">
.crear-aviso-view {
  padding: 1rem;
  
  @media (min-width: 768px) {
    padding: 2rem;
  }
}

// Header
.view-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.back-btn {
  background: none;
  border: none;
  color: var(--color-primario);
  font-size: 1.5rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--color-azul-claro);
    transform: translateX(-2px);
  }
  
  &:active {
    transform: scale(0.95);
  }
}

.header-content {
  flex: 1;
}

.view-title {
  color: var(--color-primario);
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  
  @media (min-width: 768px) {
    font-size: 1.75rem;
  }
}

.view-subtitle {
  color: var(--color-oscuro);
  opacity: 0.7;
  margin: 0;
  font-size: 0.9rem;
}

// Form Container
.form-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: 992px) {
    grid-template-columns: 2fr 1fr;
  }
}

// Form Card
.form-card {
  background: var(--color-fondo);
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.form-header {
  padding: 1.5rem;
  background: linear-gradient(135deg, var(--color-azul-claro), rgba(214, 230, 255, 0.5));
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.form-title {
  color: var(--color-primario);
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
}

.form-body {
  padding: 2rem;
}

// Form Grid
.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  &.form-group--full {
    @media (min-width: 768px) {
      grid-column: 1 / -1;
    }
  }
}

.form-label {
  color: var(--color-oscuro);
  font-weight: 500;
  font-size: 0.9rem;
}

.form-control {
  padding: 0.75rem 1rem;
  border: 2px solid rgba(18, 77, 181, 0.2);
  border-radius: 0.5rem;
  font-size: 0.9rem;
  color: var(--color-oscuro);
  background-color: var(--color-fondo);
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: var(--color-primario);
    box-shadow: 0 0 0 4px rgba(18, 77, 181, 0.1);
  }
  
  &::placeholder {
    color: rgba(52, 58, 64, 0.5);
  }
  
  &.content-editor {
    font-family: 'Courier New', monospace;
    line-height: 1.5;
    resize: vertical;
  }
}

.form-text {
  color: var(--color-oscuro);
  opacity: 0.6;
  font-size: 0.8rem;
}

.select-wrapper {
  position: relative;
}

.form-select {
  padding: 0.75rem 1rem;
  padding-right: 2.5rem;
  border: 2px solid rgba(18, 77, 181, 0.2);
  border-radius: 0.5rem;
  font-size: 0.9rem;
  color: var(--color-oscuro);
  background-color: var(--color-fondo);
  cursor: pointer;
  transition: all 0.2s ease;
  appearance: none;
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: var(--color-primario);
    box-shadow: 0 0 0 4px rgba(18, 77, 181, 0.1);
  }
}

.select-arrow {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-primario);
  pointer-events: none;
}

// Priority Buttons
.priority-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.priority-btn {
  background: var(--color-fondo);
  border: 2px solid rgba(18, 77, 181, 0.2);
  color: var(--color-oscuro);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  
  &:hover {
    border-color: var(--color-primario);
    background-color: var(--color-azul-claro);
  }
  
  &.priority-btn--active {
    border-color: var(--color-primario);
    background-color: var(--color-primario);
    color: var(--color-fondo);
  }
}

// Editor Toolbar
.editor-toolbar {
  display: flex;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  background-color: var(--color-claro);
  border-radius: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.toolbar-btn {
  background: none;
  border: none;
  color: var(--color-oscuro);
  padding: 0.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--color-azul-claro);
    color: var(--color-primario);
  }
}

// Preview Section
.preview-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: var(--color-claro);
  border-radius: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.preview-title {
  color: var(--color-primario);
  font-weight: 600;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
}

.preview-content {
  color: var(--color-oscuro);
  line-height: 1.6;
  
  :deep(h6) {
    color: var(--color-primario);
    font-weight: 600;
    margin: 1rem 0 0.5rem 0;
  }
  
  :deep(ul) {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
  }
  
  :deep(li) {
    margin-bottom: 0.25rem;
  }
  
  :deep(strong) {
    color: var(--color-primario);
    font-weight: 600;
  }
  
  :deep(em) {
    font-style: italic;
  }
}

// Form Actions
.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
}

// Tips Card
.tips-card {
  background: var(--color-fondo);
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
  height: fit-content;
}

.tips-header {
  padding: 1.5rem;
  background: linear-gradient(135deg, var(--color-azul-claro), rgba(214, 230, 255, 0.5));
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.tips-title {
  color: var(--color-primario);
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
}

.tips-body {
  padding: 1.5rem;
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  i {
    font-size: 1.1rem;
    flex-shrink: 0;
  }
  
  span {
    color: var(--color-oscuro);
    font-size: 0.9rem;
    line-height: 1.4;
  }
}

// Button Styles
.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  min-width: 140px;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  &.btn-outline {
    background: none;
    border: 2px solid var(--color-primario);
    color: var(--color-primario);
    
    &:hover:not(:disabled) {
      background-color: var(--color-primario);
      color: var(--color-fondo);
    }
  }
  
  &.btn-primary {
    background: linear-gradient(135deg, var(--color-primario), var(--color-secundario));
    border: 2px solid transparent;
    color: var(--color-fondo);
    
    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(18, 77, 181, 0.3);
    }
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid var(--color-fondo);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
