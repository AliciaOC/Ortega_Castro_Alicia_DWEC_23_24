//Llamadas a las funciones cuando el documento esté cargado
$(document).ready(botonesEncabezado());

//Si hay un usuario logueado en el localstorage oculto el botón de login, y si no hay, oculto el boton de logout
function botonesEncabezado(){
    if (localStorage.getItem('usuarioLogueado') != null) {
        $('#login-enlace').hide();
        $('#logout').show();
    }else{
        $('#logout').hide();
        $('#login-enlace').show();
    }   
}