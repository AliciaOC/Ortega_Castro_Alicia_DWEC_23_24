//--------variables y constantes
const URL_CATEGORIAS="https://fakestoreapi.com/products/categories";
const URL_PRODUCTOS="https://fakestoreapi.com/products";

let categoriasNav = document.getElementById("categorias-nav");
let botonesCategorias = document.getElementsByClassName('categoria-boton');
let formOrden = document.getElementById("form-orden");
let formVistas = document.getElementById("form-vistas");
let productosSection = document.getElementById("productos");
let vista= document.getElementById("vista").value;
let orden= document.getElementById("ordenar").value;
//----------------------------------------------

//llamadas a funciones
borrarFiltroCategoria();
cargarCategoriasNav();
cargarProductos();
//actualizarLikes();
//actualizarDislikes();
//----------------------------------------------

//---------------------------------eventos
document.getElementById('enlace-productos').addEventListener('click', (event)=>{
    event.preventDefault();
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
//----------------------------------------------

//funciones
//de la categoría del nav bar de index.html
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

//funciones de productos
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
 
     //Ya sí, cargo los productos dependiendo de si hay categoría seleccionada o no
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
                 <article value=${producto}>
                    <label for='anadir-carrito'>Unidades</label>
                    <input type='number' id='unidades${producto.id}' name='unidades' min='1' max='10' value='1'>
                    <button onclick='anadirCarrito(${producto.id})' class="anadir-carrito">Añadir al carrito</button>                    <button class="favoritos-boton">Añadir a favoritos</button>
                    <button onclick='likePulsado()' class="gusta-boton">Me gusta</button>
                    <button onclick='dislikePulsado()'class="no-gusta-boton">No me gusta</button>
                    <button onclick="mostrarDetallesProducto(${producto.id})" class="detalle-boton">Ver ficha del producto</button>
                 </article>
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
             <article value=${producto}>
                <label for='anadir-carrito'>Unidades</label>
                <input type='number' id='unidades${producto.id}' name='unidades' min='1' max='10' value='1'>
                <button onclick='anadirCarrito(${producto.id})' class="anadir-carrito">Añadir al carrito</button>                <button class="favoritos-boton">Añadir a favoritos</button>
                <button onclick='likePulsado()' class="gusta-boton">Me gusta</button>
                <button onclick='dislikePulsado()'class="no-gusta-boton">No me gusta</button>
                <button onclick="mostrarDetallesProducto(${producto.id})" class="detalle-boton">Ver ficha del producto</button>
             </article>
         `;
         lista.appendChild(item);
     });
     productosSection.appendChild(lista);
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
         <article value=${producto}>
            <label for='anadir-carrito'>Unidades</label>
            <input type='number' id='unidades${producto.id}' name='unidades' min='1' max='10' value='1'>
            <button onclick='anadirCarrito(${producto.id})' class="anadir-carrito">Añadir al carrito</button>
            <button class="favoritos-boton">Añadir a favoritos</button>
            <button onclick='likePulsado()' class="gusta-boton">Me gusta</button>
            <button onclick='dislikePulsado()'class="no-gusta-boton">No me gusta</button>
            <button onclick="mostrarDetallesProducto(${producto.id})" class="detalle-boton">Ver ficha del producto</button>
         </article>
         `;
         productosSection.appendChild(ficha);
     }
 )
 }

 //Para añadir productos al carrito
function anadirCarrito(productoID){
    if(localStorage.getItem('usuarioLogeado')!=null){
        let carrito = JSON.parse(localStorage.getItem('carrito'));
        if(carrito==null){
            carrito=[];
        }
        //Primero obtengo las unidades del producto del input que es hermano
        let unidades = document.getElementById(`unidades${productoID}`).value;
        //Busco el producto en el array de productos
        fetch(`${URL_PRODUCTOS}/${productoID}`)
        .then(res=>res.json())
        .then(producto=>{
            //Compruebo si ya habia unidades de ese producto en el carrito
            let productoEncontrado = carrito.find(p=>p.id==producto.id);
            if(productoEncontrado!=undefined){
                //Si ya estaba, sumo las unidades
                productoEncontrado.unidades+=parseInt(unidades);
                localStorage.setItem('carrito',JSON.stringify(carrito));
                alert('Nuevas unidades del producto añadidas al carrito');
            }else{
                //Si no estaba, añado las unidades al producto
                producto.unidades=unidades;
                //Lo añado al carrito
                carrito.push(producto);
                //Lo guardo en localStorage
                localStorage.setItem('carrito',JSON.stringify(carrito));
                alert('Producto añadido al carrito');
            }
        });        
    }else{
        alert('Primero inicia sesión');
    }
}
//----------------------------------------------




