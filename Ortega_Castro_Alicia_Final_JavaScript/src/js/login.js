//----------Variables y Constantes
const URL_USUARIOS='https://fakestoreapi.com/users';



//----------Eventos
//este if-else entra en acción en cuanto entra en login.html
if(!localStorage.getItem('usuarioLogeado')){
document.getElementById('login-form').addEventListener('submit', async function(event) { //async es por el await
    event.preventDefault();

    let nombreIntroducido = document.getElementById('nombreUsuario').value;
    let passwordIntroducido = document.getElementById('password').value;

    try {
        //La API tiene su propia forma de login, pero como vamos a tener usuarios propios en el localStorage, voy a hacerlo de una forma menos eficiente pero homogénea con ambos tipos de usuarios. (La forma de la api me devuelve un token que no podría sacar con los usuarios locales)
        let respuesta=await fetch(URL_USUARIOS);
        if(!respuesta.ok){
            throw new Error('No se pudo obtener la lista de usuarios');
        }
        let usuariosApi=await respuesta.json(); //Esto es un array de objetos que puedo iterar
        let usuarioApi=usuariosApi.find(usuario=>usuario.username==nombreIntroducido && usuario.password==passwordIntroducido);//Find devuelve el primer elemento que cumple la condición, si no encuentra nada devuelve undefined. (Como entiendo que no se pueden repetir los usuarios, no debería haber más de uno que cumpla la condición, pero por si acaso primero pruebo con los de la api)
        //Si no encontró el usuario en la api, entonces busco en el localStorage
        if(!usuarioApi){
            let usuariosLocales=JSON.parse(localStorage.getItem('usuarios'));
            let usuarioLocal=usuariosLocales.find(usuario=>usuario.nombre==nombreIntroducido && usuario.password==passwordIntroducido);
            if(usuarioLocal){
                alert('Hola de nuevo, '+usuarioLocal.nombre+'!');
                //Guardo en localstorage el usuario que ha iniciado sesión 
                localStorage.setItem('usuarioLogeado', JSON.stringify(usuarioLocal));
            }else{
                alert('Usuario o contraseña incorrectos');
            }
        }else{
            alert('Hola de nuevo, '+usuarioApi.username+'!');
            //Guardo en localstorage el usuario que ha iniciado sesión
            localStorage.setItem('usuarioLogeado', JSON.stringify(usuarioApi));
            window.location.href='index.html';
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Ocurrió un error al iniciar sesión');
    }
});
}else{
    alert(`Ya has iniciado sesión, ${
        JSON.parse(localStorage.getItem('usuarioLogeado')).nombre
    }`);
    window.location.href='index.html';}

