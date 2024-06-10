window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 10) {
        // Cuando el usuario se acerca al final de la página, cargamos más productos
        if(vistaDetalles==false){//Si no estamos en la vista de detalles
            cargarMasProductos();
        }
    }
});

function cargarMasProductos() {
    if (comprobarFiltroCategoria()) {
        cargarProductos(comprobarFiltroCategoria());
    } else {
        cargarProductos();
    }
}
