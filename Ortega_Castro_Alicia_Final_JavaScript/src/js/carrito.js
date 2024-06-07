//Variables y constantes
let sectionCarrito=document.getElementById('carrito');

//LLamadas a las funciones
cargarCarrito();

if(localStorage.getItem('carrito')!=null){
    cargarVaciarCarrito();
}
//-----------

//Funciones
function cargarCarrito(){
    let carrito= JSON.parse(localStorage.getItem('carrito'));
    if(!carrito){
        document.getElementById('carrito').innerHTML=`<p>Carrito vacío</p>`;
    }else{
        sectionCarrito.innerHTML="";
        let tabla=document.createElement('table');
        //Primero las cabeceras
        let cabeceras=['Producto','Precio','Cantidad','Subtotal', 'Eliminar'];
        let thead=document.createElement('thead');
        let tr=document.createElement('tr');
        cabeceras.forEach(element => {
            let th=document.createElement('th');
            th.innerHTML=element;
            tr.appendChild(th);
        });
        thead.appendChild(tr);
        tabla.appendChild(thead);

        //Luego los productos
        let tbody=document.createElement('tbody');
        let total=0;//Para calcular el precio total del carrito
        carrito.forEach(producto => {
            let tr=document.createElement('tr');
            let td=document.createElement('td');
            td.innerHTML=producto.title;
            tr.appendChild(td);
            td=document.createElement('td');
            td.innerHTML=producto.price;
            tr.appendChild(td);
            td=document.createElement('td');
            let input=document.createElement('input');
            input.type='number';
            input.value=producto.unidades;
            input.min=0;
            input.onchange=()=>{//onchange es un evento que se dispara cuando el valor del input cambia
                producto.unidades=input.value;
                localStorage.setItem('carrito',JSON.stringify(carrito));
                cargarCarrito();
            };
            td.appendChild(input);
            tr.appendChild(td);
            td=document.createElement('td');
            producto.subtotal=parseFloat(producto.unidades)*parseFloat(producto.price);
            producto.subtotal=parseFloat(producto.subtotal.toFixed(2));
            td.innerHTML=`${producto.subtotal}€`;
            tr.appendChild(td);
            td=document.createElement('td');
            let boton=document.createElement('button');
            boton.innerHTML='Eliminar';
            boton.onclick=()=>{
                eliminarProducto(producto.id);
            };
            td.appendChild(boton);
            tr.appendChild(td);
            tbody.appendChild(tr);
            //Paso a numero el subtotal para poder sumarlo. Sino sale NaN
            total+= producto.subtotal;
        });
        tabla.appendChild(tbody);
        sectionCarrito.appendChild(tabla);
        let p=document.createElement('p');
        p.innerHTML=`Total: ${total}€`;
        sectionCarrito.appendChild(p);
    }
}

function eliminarProducto(id){
    let carrito= JSON.parse(localStorage.getItem('carrito'));
    let nuevoCarrito=carrito.filter(producto=>producto.id!=id);
    localStorage.setItem('carrito',JSON.stringify(nuevoCarrito));
    cargarCarrito();
}

function cargarVaciarCarrito(){
    let boton=document.createElement('button');
    boton.innerHTML='Vaciar carrito';
    boton.onclick=()=>{
        localStorage.removeItem('carrito');
        cargarCarrito();
    };
    sectionCarrito.appendChild(boton);
}