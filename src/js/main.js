//Variables y constantes
const URL_CATEGORIAS="https://fakestoreapi.com/products/categories";
const URL_PRODUCTOS="https://fakestoreapi.com/products";

const BOTON_LOGOUT = document.getElementById("boton-logout");

let categoriasNav = document.getElementById("categorias-nav");
let productosSection = document.getElementById("productos");
let vista= document.getElementById("vista").value;
let orden= document.getElementById("ordenar").value;

//fin variables y constantes

//Funciones
function cargarCategoriasNav(){
fetch(URL_CATEGORIAS)
.then(response => response.json())
.then(categorias => {
    // Recorrer cada categoría y crear un boton para cada una
    categorias.forEach(categoria => {
        // Crear un nuevo elemento <button>
        let boton = document.createElement('button');
        // Asignar el nombre de la categoría
        boton.innerHTML = categoria;
        // Agregar el evento click al botón
        boton.addEventListener('click', () => {
            cargarProductosCategoria(categoria);
        });
        // Agregar el botón al div de categorías
        categoriasNav.appendChild(boton);
    });
})
}

function cargarProductos(categoria=0){//Por defecto no se le pasa ninguna categoría
    fetch(URL_PRODUCTOS) 
        .then(res=>res.json())
        .then(productos=>{
        productos.forEach(producto => {
            producto.gusta = 0;
            producto.nogusta = 0;
        });
        mostrarproductos(productos);
    });
}

function mostrarproductos(productos){
    if(vista == "tabla"){
        distribucionTabla(productos);
    }else if(vista == "lista"){
        distribucionLista(productos);
    }
}

function cargarProductosCategoria(categoria){}


function distribucionTabla(productos){
    //borro por si había ya algo
    productosSection.innerHTML="";

    let tabla = document.createElement('table');
    let numFilas= Math.ceil(productos.length/4);//hay 20 productos en total, lo divido así para que haga filas completas

    let contador=0;//Este contador es para llevar la posición del array de productos durante todo el bucle

    for(let i=0;i<numFilas;i++){
        let fila = document.createElement('tr');
        for(let j=0;j<4;j++){
            let celda = document.createElement('td');
            let producto = productos[contador];
            celda.classList.add('casilla-producto');//Para estilos
            celda.innerHTML = `
            <img src="${producto.image}" alt="${producto.title}">
            <p>${producto.title}</p>
            <p>${producto.price}€</p>
            <button class="anadir-carrito">Añadir al carrito</button>
            <button class="favoritos-boton">Añadir a favoritos</button>
            <button class="gusta-boton">Me gusta</button>
            <button class="no-gusta-boton">No me gusta</button>
            <button class="detalle-boton">Ver ficha del producto</button>
            `;
            fila.appendChild(celda);
            contador++;
        }
        tabla.appendChild(fila);
    }
    productosSection.appendChild(tabla);
    
}

function distribucionLista(productos){
    productosSection.innerHTML="";
    let lista = document.createElement('ul');
    productos.forEach(producto => {
        let item = document.createElement('li');
        item.classList.add('casilla-producto');//Para estilos, los mismos que si fuera tabla
        item.innerHTML = `
        <img src="${producto.image}" alt="${producto.title}">
        <p>${producto.title}</p>
        <p>${producto.price}€</p>
        <button class="anadir-carrito">Añadir al carrito</button>
        <button class="favoritos-boton">Añadir a favoritos</button>
        <button class="gusta-boton">Me gusta</button>
        <button class="no-gusta-boton">No me gusta</button>
        <button class="detalle-boton">Ver ficha del producto</button>
        `;
        lista.appendChild(item);
    });
    productosSection.appendChild(lista);
}

function scrollInfinito() {
    // Obtener la posición actual del scroll
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;//scrollTop: posición actual del scroll, scrollHeight: altura total de la página, clientHeight: altura de la ventana del navegador. Las llaves indican que se están extrayendo las propiedades de document.documentElement
    
    if (scrollTop + clientHeight >= scrollHeight - 5) {//El menos 5 es para que no se active justo cuando llega al final
        cargarProductos();//Cargar más posts
    }
}

//fin funciones