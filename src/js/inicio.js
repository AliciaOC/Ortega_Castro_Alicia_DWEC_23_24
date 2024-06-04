cargarCategoriasNav();
cargarProductos();
//Para cambiar a vista de lista
document.getElementById('vista').addEventListener('click',()=>{
//primer click para abrir las opciones
//al segundo click puede que haya cambiado la vista
    document.getElementById('vista').addEventListener('click',()=>{
        //reviso si ha cambiado la vista
        if(vista!=document.getElementById('vista').value){
        vista = document.getElementById('vista').value;
        cargarProductos();
        }
    });
});
window.addEventListener('scroll', scrollInfinito);

