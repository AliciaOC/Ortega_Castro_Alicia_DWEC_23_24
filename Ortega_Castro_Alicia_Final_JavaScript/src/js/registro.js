document.getElementById('boton-registro').addEventListener('click', function(event) {
    event.preventDefault();
    mensajeRegistro();
});

//----------Funciones
function registroUsuario(){
    //En el registro realmente le pido más cosas por el enunciado del ejercio (se me hace raro pedir dni para una tienda), pero solo necesito el nombre y contraseña, así que va a ser lo que guarde.
    let nombreIntroducido = document.getElementById('nombreUsuario').value;
    let passwordIntroducido = document.getElementById('password').value;
    let usuariosLocales=JSON.parse(localStorage.getItem('usuarios'));
    if(usuariosLocales){
        let usuario=usuariosLocales.find(usuario=>usuario.username==nombreIntroducido);
        if(usuario){
         return false;
        }
    }else{
        usuariosLocales=[];
    }
   //También voy a mirar a ver si el usuario existe en la api
   try{
        fetch('https://fakestoreapi.com/users')
        .then(respuesta=>respuesta.json())
        .then(usuariosApi=> { 
            let usuarioApiEncontrado=usuariosApi.find(usuario=>usuario.username==nombreIntroducido);
            if(usuarioApiEncontrado){
                return false;
            }
        })
    }catch(error){
        console.error('Error:', error);
        alert('Ocurrió un error al intentar registrarse');
    }
    //Si no existe en la api ni en el localStorage, lo guardo en el localStorage
    usuariosLocales.push({username:nombreIntroducido, password:passwordIntroducido});
    localStorage.setItem('usuarios', JSON.stringify(usuariosLocales));
    return true;
}
function mensajeRegistro(){
    if(registroUsuario()){
        alert('Usuario registrado correctamente');
        window.location.href='./login.html';
    }else{
        alert('El usuario ya existe');
    }
}