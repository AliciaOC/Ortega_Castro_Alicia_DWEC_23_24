//----------Variables y Constantes
const URL_USUARIOS='https://fakestoreapi.com/users';



//----------Eventos
document.getElementById('login-form').addEventListener('submit', async function(event) { //async es por el await
    event.preventDefault();

    let nombreIntroducido = document.getElementById('nombreUsuario').value;
    let passwordIntroducido = document.getElementById('password').value;

    try {
        //La API tiene su propia forma de login, pero como vamos a tener usuarios propios en el localStorage, voy a hacerlo de una forma menos eficiente pero homogénea con ambos tipos de usuarios. La forma de la api me devuelve un token que no podría sacar con los usuarios locales
        let respuesta=await fetch(URL_USUARIOS);
        if(!respuesta.ok){
            throw new Error('No se pudo obtener la lista de usuarios');
        }
        let usuariosApi=await respuesta.json(); //Esto es un array de objetos que puedo iterar
        let usuarioApi=usuariosApi.find(usuario=>usuario.username==nombreIntroducido && usuario.password==passwordIntroducido);//Find devuelve el primer elemento que cumple la condición, si no encuentra nada devuelve undefined
        //Si no encontró el usuario en la api, entonces busco en el localStorage
        if(!usuarioApi){
            let usuariosLocales=JSON.parse(localStorage.getItem('usuarios'));
            let usuarioLocal=usuariosLocales.find(usuario=>usuario.nombre==nombreIntroducido && usuario.password==passwordIntroducido);
            if(usuarioLocal){
                //TERMINAR ESTO!!!!!!!!!
            }else{
                //TERMINAR ESTO!!!!!!!!!
                alert('Usuario no encontrado');
            }
        }else{
            //TERMINAR ESTO!!!!!!!!!
            alert('Usuario encontrado en la API');
        
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Ocurrió un error al iniciar sesión');
    }
});

//----------Funciones
