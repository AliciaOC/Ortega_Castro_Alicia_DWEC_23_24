//Eventos
$('#registroButton').click(function(event){
    event.preventDefault();
    registrarUsuario();

});
$('#loginButton').click(function(event){
    event.preventDefault();
    iniciarSesion();
});

//--------Funciones
function iniciarSesion(){
    if(!JSON.parse(localStorage.getItem('usuarioLogueado')) || JSON.parse(localStorage.getItem('usuarioLogueado') == null)){
        //Obtengo los datos del formulario
        let nombreUsuario = $('#nombreUsuario').val();
        let password = $('#password').val();
        //Obtengo el usuario del localstorage
        let usuarios = JSON.parse(localStorage.getItem('usuarios')) || null;
        //Busco el usuario en el array de usuarios
        if(!usuarios){
            alert('El usuario no existe.');
            return;
        } 
        let usuario = usuarios.find(usuario => usuario.nombreUsuario == nombreUsuario);
        //Si el usuario no existe, muestro un mensaje de error
        if(usuario == null){
            alert('El usuario no existe');
        }else{
            //Si la contraseña no coincide, muestro un mensaje de error
            if(usuario.password != password){
                alert('Contraseña incorrecta');
            }else{
                //Si todo está correcto, guardo el usuario en el localstorage
                localStorage.setItem('usuarioLogueado', JSON.stringify(usuario));
                botonesEncabezado();
                alert('Hola de nuevo, '+usuario.nombreUsuario+'!');
                window.location.href = '../index.html';
            }
        }
    }else{
        alert('Ya hay un usuario logueado');
        botonesEncabezado();
    }
}

function registrarUsuario(){
    //Obtengo los datos del formulario
    let nombreUsuario = $('#nombreUsuario').val();
    let password = $('#password').val();
    let password2 = $('#password2').val();
    //Obtengo el usuario del localstorage
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || null;
    //Comprobaciones
    if(!usuarios || usuarios == null){
        usuarios = [];
    }else{
        if(usuarios.find(usuario => usuario.nombreUsuario == nombreUsuario)){
            alert('El usuario ya existe');
            return;
        }else if(password != password2){
            alert('Las contraseñas no coinciden');
            return;
        }
    }
    //Creo el usuario
    let usuario = {
        nombreUsuario: nombreUsuario, 
        password: password,
        favoritos: [],
        likes: [],
        dislikes: []
    };
    usuarios.push(usuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    alert('Usuario registrado correctamente');
    window.location.href = './login.html';
}

function logout(){
    if(!JSON.parse(localStorage.getItem('usuarioLogueado')) || JSON.parse(localStorage.getItem('usuarioLogueado') == null)){
        alert('No hay un usuario logueado');
    }else{
        //Borro el usuario del localstorage
        localStorage.removeItem('usuarioLogueado');
        alert('Hasta pronto!');
        botonesEncabezado();
        //reviso la url para saber si estaba en index o en login o en registro
        let url = window.location.href;
        if(url.includes('/html/')){
            window.location.href = '../index.html';
        }
        //borro el párrado del header
        $('header p').remove();
        //vuelvo a mostrar los gatos, para que se desactiven estilos de usuario logueado
        mostrarRazas();
    }
}