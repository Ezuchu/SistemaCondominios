document.addEventListener('DOMContentLoaded', function() {
    // Variables para el sidebar
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const sidebarToggle = document.getElementById('sidebarToggle');
    let isCollapsed = false;
    
    // Verificar el tamaño de la pantalla al cargar
    checkScreenSize();
    
    // Event listener para el botón de toggle
    sidebarToggle.addEventListener('click', function() {
        toggleSidebar();
    });
    
    // Función para toggle del sidebar
    function toggleSidebar() {
        isCollapsed = !isCollapsed;
        
        if (isCollapsed) {
            sidebar.classList.add('sidebar-collapsed');
            mainContent.classList.add('main-content-expanded');
            sidebarToggle.style.left = '10px';
        } else {
            sidebar.classList.remove('sidebar-collapsed');
            mainContent.classList.remove('main-content-expanded');
            sidebarToggle.style.left = '260px';
        }
    }
    
    // Función para verificar el tamaño de la pantalla
    function checkScreenSize() {
        if (window.innerWidth <= 768) {
            // Pantalla pequeña - sidebar oculto por defecto
            sidebar.classList.add('sidebar-collapsed');
            mainContent.classList.add('main-content-expanded');
            sidebarToggle.style.left = '10px';
            isCollapsed = true;
        } else {
            // Pantalla grande - sidebar visible por defecto
            sidebar.classList.remove('sidebar-collapsed');
            mainContent.classList.remove('main-content-expanded');
            sidebarToggle.style.left = '260px';
            isCollapsed = false;
        }
    }
    
    // Event listener para cambios de tamaño de pantalla
    window.addEventListener('resize', checkScreenSize);
    
    // Configurar event listeners para las filas expandibles
    setupExpandableRows();
});

// Función para configurar los event listeners de las filas expandibles
function setupExpandableRows() {
    const expandableRows = document.querySelectorAll('.expandable-row');
    
    expandableRows.forEach(row => {
        row.addEventListener('click', function() {
            toggleRowDetails(this);
        });
    });
}

// Función para expandir/colapsar filas
function toggleRowDetails(row) {
    const detailsRow = row.nextElementSibling;
    const icon = row.querySelector('.expand-icon');
    
    // Alternar clase 'expanded' en la fila principal
    row.classList.toggle('expanded');
    
    // Alternar visibilidad de la fila de detalles
    detailsRow.classList.toggle('show');
}