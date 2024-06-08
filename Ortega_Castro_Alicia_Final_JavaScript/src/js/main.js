//---------Funciones
//Logout
function logout(){
    if(localStorage.getItem('usuarioLogeado')!=null){
        if(localStorage.getItem('carrito')!=null){
            let confirmacion=confirm('¿Estás seguro de que quieres cerrar la sesión? Se perderá el carrito actual');
            if(confirmacion){
                localStorage.removeItem('usuarioLogeado');
                localStorage.removeItem('carrito');
                alert('Sesión cerrada');
                window.location.href='index.html';
            }
        }else{
        localStorage.removeItem('usuarioLogeado');
        alert('Sesión cerrada');
        window.location.href='index.html';
        }
    }else{
        alert('Primero inicia sesión ;)');
    }
}