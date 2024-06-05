//Variables y constantes
const URL_CATEGORIAS="https://fakestoreapi.com/products/categories";
const URL_PRODUCTOS="https://fakestoreapi.com/products";

const BOTON_LOGOUT = document.getElementById("boton-logout");

let categoriasNav = document.getElementById("categorias-nav");
let botonesCategorias = document.getElementsByClassName('categoria-boton');
let formOrden = document.getElementById("form-orden");
let formVistas = document.getElementById("form-vistas");
let productosSection = document.getElementById("productos");
let vista= document.getElementById("vista").value;
let orden= document.getElementById("ordenar").value;

//Para los likes y dislikes
let megustaNumero=0;
let nomegustaNumero=0;
let parrafoLikes=document.getElementById('totalLikes');
let parrafoDislikes=document.getElementById('totalDislikes');
//fin variables y constantes

//EventListeners Generales
document.getElementById('enlace-productos').addEventListener('click', ()=>{
    if(comprobarFiltroCategoria()){
        borrarFiltroCategoria();
    }
    cargarProductos();
});
//Fin EventListeners Generales

//Funciones
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

function cargarCategoriasNav(){
fetch(URL_CATEGORIAS)
.then(response => response.json())
.then(categorias => {
    // Recorrer cada categoría y crear un boton para cada una
    categorias.forEach(categoria => {
        // Crear un nuevo elemento <button>
        let boton = document.createElement('button');
        boton.classList.add('categoria-boton');
        // Asignar el nombre de la categoría
        boton.innerHTML = categoria;
        // Agregar un evento al botón con click, se ejecuta la funcion cargarProductos con el nombre de la categoría
        boton.addEventListener('click', () => {
            if(comprobarFiltroCategoria()){
                borrarFiltroCategoria();
            }
            boton.classList.add('categoria-seleccionada');
            cargarProductos(boton.innerHTML);
        });
        // Agregar el botón al nav de categorías
        categoriasNav.appendChild(boton);
    });
})
}

function cargarProductos(categoria){
   //Reviso si los form de orden y vista están vacíos para volver a ponerles su contenido. Se vacían cuando se carga la ficha de un producto
    if(formOrden.innerHTML==""){//Si está vacío, lo relleno
        formOrden.innerHTML=` 
        <label for="ordenar">Ordenar por precio:</label>
        <select name="ordenar" id="ordenar">
          <option value="ascendente" selected>Ascendente</option>
          <option value="descendente">Descendente</option>
        </select>`;
    } 
    if(formVistas.innerHTML==""){//Si está vacío, lo relleno
        formVistas.innerHTML=`
        <label for="vista">Vista:</label>
        <select name="vista" id="vista">
          <option value="tabla">Tabla</option>
          <option value="lista">Lista</option>
        </select>`;
    }

    if(categoria==null){//Si no se le pasa ninguna categoría, carga todos los productos
    fetch(URL_PRODUCTOS) 
        .then(res=>res.json())
        .then(productos=>{
        productos.forEach(producto => {
            producto.gusta = false;
            producto.nogusta = false;
        });
        mostrarproductos(productos);
    });
    }else{//Si se le pasa una categoría, carga los productos de esa categoría 
        fetch(`${URL_PRODUCTOS}/category/${categoria}`)
        .then(res=>res.json())
        .then(productos=>{
            productos.forEach(producto => {
                producto.gusta = false;
                producto.nogusta = false;
            });
            mostrarproductos(productos);
        });
    }  
}

function mostrarproductos(productos){
    //Ordenar los productos por precio
    if(orden=="ascendente"){
        productos.sort((a,b)=>a.price-b.price);
    }else if(orden=="descendente"){
        productos.sort((a,b)=>b.price-a.price);
    }
    //Mostrar los productos en la vista seleccionada
    if(vista == "tabla"){
        distribucionTabla(productos);
    }else if(vista == "lista"){
        distribucionLista(productos);
    }
}

function distribucionTabla(productos){
    //borro por si había ya algo
    productosSection.innerHTML="";

    let tabla = document.createElement('table');
    let numFilas= Math.ceil(productos.length/4);//hay 20 productos en total, lo divido así para que haga filas completas. Y en la categoria de menos productos hay 4

    let contador=0;//Este contador es para llevar la posición del array de productos durante todo el bucle

    for(let i=0;i<numFilas;i++){
        let fila = document.createElement('tr');
        for(let j=0;j<4;j++){
            //Si no hay más productos, salgo del bucle (en las categorias de electronica y ropa de mujer hace falta)
            if(contador>=productos.length){
                break;
            }

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
            <button onclick="mostrarDetallesProducto(${producto.id})" class="detalle-boton">Ver ficha del producto</button>
            `;
            fila.appendChild(celda);
            contador++;
        }
        tabla.appendChild(fila);
    }
    productosSection.appendChild(tabla);
    gustaListener(productos);
    noGustaListener(productos);
    
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
        <a href='html/producto.html/?producto=${producto.id}' class="detalle-boton">Ver ficha del producto</a>
        `;
        lista.appendChild(item);
    });
    productosSection.appendChild(lista);
    gustaListener(productos);
    noGustaListener(productos);
}

function mostrarDetallesProducto(id){
    //Vacío el contenido del main
    formOrden.innerHTML="";
    formVistas.innerHTML="";
    productosSection.innerHTML="";
    //Cargo el producto
    fetch(`${URL_PRODUCTOS}/${id}`)
    .then(res=>res.json())
    .then(producto=>{
        //Creo la estructura de la ficha del producto
        let ficha = document.createElement('article');
        ficha.setAttribute('class','detalles-producto');
        ficha.innerHTML = `
        <img src="${producto.image}" alt="${producto.title}">
        <h2>${producto.title}</h2>
        <p>Categoria: ${producto.category}</p>
        <p>${producto.description}</p>
        <p>${producto.price}€</p>
        <button class="anadir-carrito">Añadir al carrito</button>
        <button class="favoritos-boton">Añadir a favoritos</button>
        <button class="gusta-boton">Me gusta</button>
        <button class="no-gusta-boton">No me gusta</button>
        `;
        productosSection.appendChild(ficha);
    }
)
}
//------------
function gustaListener(productos){
    /*productos.forEach(producto => {
        let botonGusta = document.getElementsByClassName('gusta-boton');
        botonGusta.addEventListener('click',()=>{
            megusta(producto);
            if(producto.gusta){
                botonGusta.classList.add('gusta-seleccionado');
            }
        });
    });
    */
   
}

function noGustaListener(productos){
    /*
    productos.forEach(producto => {
        let botonNoGusta = document.getElementsByClassName('no-gusta-boton');
        botonNoGusta.addEventListener('click',()=>{
            nomegusta(producto);
            if(producto.nogusta){
                botonNoGusta.classList.add('no-gusta-seleccionado');
            }
        });
    });
    */
}

function megusta(producto){
    if(producto.gusta==false){
        producto.gusta=true;
        megustaNumero++;
        actualizarLikes();
    }else{
        producto.gusta=false;
        megustaNumero--;
        actualizarLikes();
    }
}
function nomegusta(producto){
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

function comprobarFiltroCategoria(){
    for (let boton of botonesCategorias) {
        if(boton.classList.contains('categoria-seleccionada')){//contains devuelve true si la clase está en el elemento
            let categoria= boton.innerHTML;
            return categoria;
        }
    }
    return false;
}

function borrarFiltroCategoria(){
    for (let boton of botonesCategorias) {
        if(boton.classList.contains('categoria-seleccionada')){
            boton.classList.remove('categoria-seleccionada');
        }
    }
}

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