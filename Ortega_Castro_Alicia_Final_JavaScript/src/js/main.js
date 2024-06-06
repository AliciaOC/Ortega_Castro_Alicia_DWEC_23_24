//Variables y constantes


//Para los likes y dislikes
/*Cambiar el enfoque, no es por usuario, es por producto
let megustaNumero=0;
let nomegustaNumero=0;
let parrafoLikes=document.getElementById('totalLikes');
let parrafoDislikes=document.getElementById('totalDislikes');
*/
//fin variables y constantes



//Funciones
//Funciones de likes y dislikes
/* Tengo que cambiar el enfoque, no es por usuario, es por producto

function likePulsado(event){
    let producto = botonPulsado.parentElement.getAttribute('value');
    if(producto.gusta==false){
        producto.gusta=true;
        megustaNumero++;
        //Añado la clase like-pulsado para cambiar el color del botón
        let botonPulsado = event.target;
        botonPulsado.classList.add('like-pulsado');
        //Actualizo el número de likes
        actualizarLikes();
    }else if (producto.gusta==true){
        producto.gusta=false;
        megustaNumero--;
        //Quito la clase like-pulsado para cambiar el color del botón
        let botonPulsado = event.target;
        botonPulsado.classList.remove('like-pulsado');
        //Actualizo el número de likes
        actualizarLikes();
    }
}
function dislikePulsado(event){
    if(producto.nogusta==false){
        producto.nogusta=true;
        nomegustaNumero++;
        actualizarDislikes();
    }else{
        producto.nogusta=false;
        nomegustaNumero--;
        actualizarDislikes();
    }
}
function actualizarLikes(){
    textoLikes=parrafoLikes.innerHTML;
    textoLikes=textoLikes+` ${megustaNumero}`;
    parrafoLikes.innerHTML='';
    parrafoLikes.innerHTML=textoLikes;
}
function actualizarDislikes(){
    textoDislikes=parrafoDislikes.innerHTML;
    textoDislikes=textoDislikes+` ${nomegustaNumero}`;
    parrafoDislikes.innerHTML='';
    parrafoDislikes.innerHTML=textoDislikes;
}
*/


/*
function scrollInfinito() {
    // Obtener la posición actual del scroll
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;//scrollTop: posición actual del scroll, scrollHeight: altura total de la página, clientHeight: altura de la ventana del navegador. Las llaves indican que se están extrayendo las propiedades de document.documentElement
    
    if (scrollTop + clientHeight >= scrollHeight - 5) {//El menos 5 es para que no se active justo cuando llega al final
        cargarProductos();//Cargar más posts
    }
}
*/
//fin funciones