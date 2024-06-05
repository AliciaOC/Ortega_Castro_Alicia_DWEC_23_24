//----------Variables y Constantes
const URL_USUARIOS='https://fakestoreapi.com/users';

//----------Funciones
function login(event){
    event.preventDefault();
    let emailIntroducido=document.getElementById('email').value;
    let passwordIntroducido=document.getElementById('password').value;

    if(comprobarUsuario(emailIntroducido,passwordIntroducido)){
        
    }else{
        alert('Usuario o contraseña incorrectos');
    }
}
function comprobarUsuario(email,password){
    fetch(URL_USUARIOS)
    .then(respuesta=>respuesta.json())
    .then(usuarios=>{
        let usuarioEncontrado=false;
        for(let i=0;i<usuarios.length;i++){
            if(usuarios[i].email==email && usuarios[i].password==password){
                usuarioEncontrado=true;
                break;
            }
        }
        if(usuarioEncontrado){
            return true;
        }else{
            return false;
        }
    })
}