//Llamadas a las funciones cuando el documento esté cargado
$(document).ready(botonesEncabezado());

//Si hay un usuario logueado en el localstorage oculto el botón de login, y si no hay, oculto el boton de logout
function botonesEncabezado(){
    if (JSON.parse(localStorage.getItem('usuarioLogueado'))) {
        $('#login-enlace').hide();
        $('#logout').show();
    }else{
        $('#logout').hide();
        $('#login-enlace').show();
    }   
}

let nombreUsuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado')) ? JSON.parse(localStorage.getItem('usuarioLogueado')).nombreUsuario : null;
if(nombreUsuarioLogueado){
    let parrafo = $('<p></p>');
    parrafo.text('Sesión iniciada de: '+nombreUsuarioLogueado);
    $('header').append(parrafo);
}