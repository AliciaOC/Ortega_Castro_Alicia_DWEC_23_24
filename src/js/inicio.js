borrarFiltroCategoria();
cargarCategoriasNav();
cargarProductos();
actualizarLikes();
actualizarDislikes();

document.getElementById('enlace-productos').addEventListener('click', ()=>{
    if(comprobarFiltroCategoria()){
        borrarFiltroCategoria();
    }
    cargarProductos();
});

//Para cambiar el orden
//va a ser un problema porque con el scroll infinito se repiten los productos ya que solo hay 20
document.getElementById('ordenar').addEventListener('click',()=>{
    //Primer click para abrir las opciones, no lo tengo en cuenta pero necesito escucharlo para el segundo click
    //Segundo click para cambiar el orden
    document.getElementById('ordenar').addEventListener('click',()=>{
        //Reviso si ha cambiado el orden
        if(orden!=document.getElementById('ordenar').value){
            orden = document.getElementById('ordenar').value;
            //miro si ha filtrado por categoria o no
            if(comprobarFiltroCategoria()){
                cargarProductos(comprobarFiltroCategoria());
            }else{
                cargarProductos();
            }
        }
    });
});

//Para cambiar la vista
document.getElementById('vista').addEventListener('click',()=>{
//primer click para abrir las opciones
//al segundo click puede que haya cambiado la vista
    document.getElementById('vista').addEventListener('click',()=>{
        //reviso si ha cambiado la vista
        if(vista!=document.getElementById('vista').value){
        vista = document.getElementById('vista').value;
        //miro si ha filtrado por categoria o no
        if(comprobarFiltroCategoria()){
            cargarProductos(comprobarFiltroCategoria());
        }else{
            cargarProductos();
        }
        }
    });
});

//window.addEventListener('scroll', scrollInfinito);

