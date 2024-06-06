//---------Funciones
//Logout
function logout(){
    if(localStorage.getItem('usuarioLogeado')!=null){
        localStorage.removeItem('usuarioLogeado');
        alert('Sesión cerrada');
        window.location.href='index.html';
    }else{
        alert('Primero inicia sesión ;)');
    }
}