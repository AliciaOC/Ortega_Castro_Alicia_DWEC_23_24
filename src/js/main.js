//Variables y constantes
const URL_CATEGORIAS="https://fakestoreapi.com/products/categories";
const URL_PRODUCTOS="https://fakestoreapi.com/products";

const BOTON_LOGOUT = document.getElementById("boton-logout");

let cajaCategorias = document.getElementById("caja-categorias");
let productosSection = document.getElementById("productos");
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
            cargarProductos(categoria);
        });
        // Agregar el botón al div de categorías
        cajaCategorias.appendChild(boton);
    });
})
}
function cargarProductos(categoria){
    //Segun la vista seleccionada se cargan los productos en lista o en tabla
    let vista = document.getElementById("vista").value;
    if(vista=="tabla"){
        let tabla=document.createElement("table");
        productosSection.appendChild(tabla);
    }else{
        let lista=document.createElement("ul");
        productosSection.appendChild(lista);
    }
    fetch('https://fakestoreapi.com/products/category/'+categoria)
            .then(res=>res.json())
            .then(productos=>{
                productos.forEach(producto=>{
                    if(vista=="tabla"){
                        cargarProductosTabla(producto);
                    }else{
                        cargarProductosLista(producto);
                    }
                });
            }
        );
}

function distribucionTabla(productos){}
function distribucionLista(productos){}
//fin funciones