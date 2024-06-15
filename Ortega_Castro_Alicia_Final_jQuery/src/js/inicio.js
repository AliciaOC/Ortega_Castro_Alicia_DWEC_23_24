//------------------------Variables
const URL_RAZAS_DATOS='https://catfact.ninja/breeds';
const URL_FOTOS="https://api.thecatapi.com/v1/images/search?breed_ids={breed.id}";

let orden=$('#ordenar').val();
let vista=$('#vista').val();

//------------------------Eventos
//Evento para el cambio de orden
$('#ordenar').change(function(){
    orden=$(this).val();
    mostrarRazas();
});

//Evento para el cambio de vista
$('#vista').change(function(){
    vista=$(this).val();
    mostrarRazas();
});

// -----------------------Llamadas a las funciones
// Voy a guardar la información que necesito para el inicio (razas, id razas y foto) en localStorage en 'gatos'. LocalStorage es más rápido que hacer llamadas AJAX y así no tengo que estar pendiente de la asincronía
if (JSON.parse(localStorage.getItem('gatos')) == null){
    obtenerRazas();
    //en este punto el array aún no está completo, por la asíncronía de las llamadas AJAX, pero se guardará en localStorage cuando esté completo en la función obtenerImagenes, después pasa a mostrarRazas
}else{
    mostrarRazas();//me ahorro las dos primseras funciones
}

// --------------------Funciones
async function obtenerRazas() {
    let razasArray = [];
    let razas1 = [];
    let razas2 = [];

    // Primera solicitud AJAX
    let solicitud1 = $.ajax({
        url: URL_RAZAS_DATOS + '?limit=98',
        type: 'GET',
        success: function (respuesta) {
            for (let i = 0; i < respuesta.data.length; i++) {
                if (respuesta.data[i].breed != null && razas1.length < respuesta.data.length) {
                    if (razas1.indexOf(respuesta.data[i].breed) == -1) {
                        razas1.push(respuesta.data[i].breed); // es un string, no necesito parsear
                    }
                }
            }
        },
        error: function (error) {
            console.error(error);
        }
    });

    // Segunda solicitud AJAX
    let solicitud2 = $.ajax({
        url: 'https://api.thecatapi.com/v1/breeds?limit=67',
        type: 'GET',
        success: function (respuesta) {
            for (let i = 0; i < respuesta.length; i++) {
                if (respuesta[i].name != null && razas2.length < respuesta.length) {
                    if (razas2.indexOf(respuesta[i].name) == -1) {
                        let idRaza = respuesta[i].id;
                        let nombreRaza = respuesta[i].name;
                        razas2.push({ raza: nombreRaza, id: idRaza }); // es un objeto, quiero obtener la raza pero tambien el id. La raza para ver cuales se repiten y el id para las imágenes
                    }
                }
            }
        },
        error: function (error) {
            console.error(error);
        }
    });

    // Esperar a que ambas solicitudes finalicen
    $.when(solicitud1, solicitud2).done(function () {
        for (let i = 0; i < razas1.length; i++) {
            for (let j = 0; j < razas2.length; j++) {
                if (razas1[i] == razas2[j].raza) {
                    razasArray.push({
                        raza: razas2[j].raza,
                        id: razas2[j].id,
                        likes: 0,
                        dislikes: 0
                    });
                }
            }
        }
        obtenerImagenes(razasArray);
    });
}

// Función para obtener las imágenes
async function obtenerImagenes(razas) {
    let solicitudes = razas.map(raza => {
        let url = URL_FOTOS.replace('{breed.id}', raza.id);
        return $.ajax({
            url: url,
            type: 'GET',
            success: function (respuesta) {
                //voy a guardar las imagenes de la raza
                let imagenes = respuesta.map(imagen => imagen.url);
                raza.imagenes = imagenes;

            },
            error: function (error) {
                console.error(error);
            }
        });
    });

    Promise.all(solicitudes).then(() => {// Cuando todas las solicitudes se hayan completado
        // Guardar el array completo en localStorage
        localStorage.setItem('gatos', JSON.stringify(razas));
        mostrarRazas();
    });
}

function mostrarRazas() {
    // Reviso si los formularios de orden y vista están vacíos para volver a ponerles su contenido. Se vacían cuando se carga la ficha de detalles de un gato
    if ($('#form-orden').val() == "") {
        $('form-orden').html(
            `
            <label for="ordenar">Ordenar alfabéticamente:</label>
            <select name="ordenar" id="ordenar">
                <option value="ascendente" selected>Ascendente</option>
                <option value="descendente">Descendente</option>
            </select>
            `
        );
    }
    if ($('#form-vistas').val() == "") {
        $('form-vistas').html(
            `
            <label for="vista">Vista:</label>
            <select name="vista" id="vista">
                <option value="tabla">Tabla</option>
                <option value="lista">Lista</option>
            </select>
            `
        );
    }

    //Como aquí existen los formularios, según el valor de orden y vista se mostrarán los gatos
    //Aquí existe 'gatos' y contiene toda la información. Fuera de la función no es seguro que exista o que esté completo, así que inicializo aquí
    let gatos = JSON.parse(localStorage.getItem('gatos'));
    // Ordenar los gatos por raza
    if (orden == "ascendente") {
        gatos.sort()
    } else if (orden == "descendente") {
        gatos.sort().reverse();
    }
    // Mostrar los gatos en la vista seleccionada
    if (vista == "tabla") {
        distribucionTabla(gatos);
    } else if (vista == "lista") {
        distribucionLista(gatos);
    }
}


function rellenarBotonesFicha(elemento, gato) {
    let numLikes = gato.likes;
    let numDislikes = gato.dislikes;
 
    // Botón detalles
    if ($('#form-orden').html() !== "") { // Verificar que no esté en los detalles
        let botonDetalles = $('<button>').text('Ver detalles').addClass('detalles-boton').attr('value', gato.raza);
        botonDetalles.click(function() {
            mostrarDetalles(gato.raza);
        });
        elemento.append(botonDetalles);
    }
     
    // Botón favoritos
    let botonFav = $('<button>').attr('value', gato.raza).addClass('favoritos-boton');
    if (esFavorito(gato.raza)) {
        botonFav.addClass('fav').text('En tu lista de favoritos');
    } else {
        botonFav.text('Añadir a favoritos');
    }

    botonFav.click(function() {
        favPulsado(botonFav, gato.raza);
    });

    elemento.append(botonFav);
    
    // Botones like y dislike
    //like
    let botonLike = $('<button>').attr('value', gato.raza).addClass('like-boton').text(`Me gusta (${numLikes})`);
    if (tieneDislike(gato.raza)) {
        //desactivo el botón like si ya le ha dado dislike
        botonLike.attr('disabled', true);
    }else if (tieneLike(gato.raza)) {
        botonLike.addClass('like-pulsado').text(`Ya te gusta (${numLikes})`);
    }
    botonLike.click(function() {
        likePulsado(botonLike, gato.raza);
    });
    elemento.append(botonLike);
    //dislike
    let botonDislike = $('<button>').attr('value', gato.raza).addClass('dislike-boton').text(`No me gusta (${numDislikes})`);
    if (tieneLike(gato.raza)) {
        //desactivo el botón dislike si ya le ha dado like
        botonDislike.attr('disabled', true);
    }else if (tieneDislike(gato.raza)) {
        botonDislike.addClass('dislike-pulsado').text(`Ya no te gusta (${numDislikes})`);
    }
    botonDislike.click(function() {
        dislikePulsado(botonDislike, gato.raza);
    });
    elemento.append(botonDislike);
}


function distribucionTabla(gatos) {
    $('#contenidoSection').empty();//Vacío el contenido para que no se acumule
    let tabla = $('#tablaGatos');
    if (tabla.length===0) {
        tabla = $('<table></table>').attr('id', 'tablaGatos');        
        $('#contenidoSection').append(tabla);
    }

    let numFilas = Math.ceil(gatos.length / 4);
    let contador = 0;//Para recorrer el array de gatos

    for (let i = 0; i < numFilas; i++) {
        let fila = $('<tr></tr>');
        for (let j = 0; j < 4; j++) {
            //Si no hay más gatos, salgo del bucle
            if (contador >= gatos.length) {
                break;
            }
            let celda = $('<td></td>');
            let gato = gatos[contador];
            celda.attr('class', 'casilla-gato')
            let contenidoCelda = `
                <h3>${gato.raza}</h3>
                <img src="${gato.imagenes[0]}" alt="${gato.raza}">
            `;
            celda.html(contenidoCelda);
            rellenarBotonesFicha(celda, gato);
            fila.append(celda);
            contador++;
        }
        tabla.append(fila);
    }
}

function distribucionLista(gatos) {
    $('#contenidoSection').empty();//Vacío el contenido para que no se acumule
    let lista = $('#listaGatos');
    if (lista.length===0) {
        lista = $('<ul></ul>').attr('id', 'listaGatos');
        $('#contenidoSection').append(lista);
    }

    gatos.forEach(gato => {
        let item = $('<li></li>').attr('class', 'casilla-gato');
        let contenidoItem = `
                <h3>${gato.raza}</h3>
                <img src="${gato.imagenes[0]}" alt="${gato.raza}">
            `;
        item.html(contenidoItem);
        rellenarBotonesFicha(item, gato);
        lista.append(item);
    });
}

function favPulsado(boton, gatoRaza) {
    let usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'));
    if (usuarioLogueado) {
        let favoritos = usuarioLogueado.favoritos || [];
        let gato = favoritos.find(g => g.raza === gatoRaza);
        if (gato) {
            favoritos = favoritos.filter(g => g.raza !== gatoRaza);
            boton.removeClass('fav');
        } else {
            favoritos.push({ raza: gatoRaza });
            boton.addClass('fav');
        }
        usuarioLogueado.favoritos = favoritos;
        localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioLogueado));
        //tambien lo guardo en el localstorage de usuarios
        let usuarios = JSON.parse(localStorage.getItem('usuarios'));
        let usuario = usuarios.find(u => u.nombreUsuario === usuarioLogueado.nombreUsuario);
        usuario.favoritos = favoritos;
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        mostrarRazas();
    } else {
        alert('Debes iniciar sesión para añadir a favoritos');
    }
}


function esFavorito(gatoRaza) {
    let usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'));
    if (usuarioLogueado) {
        let favoritos = usuarioLogueado.favoritos || [];
        if (favoritos.find(g => g.raza === gatoRaza)) {
            return true;
        }
    }
    return false;
}

function tieneLike(gatoRaza) {
    let usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'));
    if (usuarioLogueado) {
        let likes = usuarioLogueado.likes || [];
        if (likes.find(g => g.raza === gatoRaza)) {
            return true;
        }
    }
    return false;
}

function tieneDislike(gatoRaza) {
    let usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'));
    if (usuarioLogueado) {
        let dislikes = usuarioLogueado.dislikes || [];
        if (dislikes.find(g => g.raza === gatoRaza)) {
            return true;
        }
    }
    return false;
}

function likePulsado(boton, gatoRaza){
    //compruebo que haya un usuario logueado
    let usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'));
    if (usuarioLogueado) {
        //Compruebo si ya le había dado like
        let usuarioLikes = usuarioLogueado.likes || [];
        let gatoEncontrado = usuarioLikes.find(g => g.raza === gatoRaza);//en el array de likes del usuario logueado
        
        let gatos = JSON.parse(localStorage.getItem('gatos'));
        let gato = gatos.find(g => g.raza === gatoRaza);//en el array de gatos

        if (gatoEncontrado) {
            //Si ya le había dado like, lo quito de la lista 
            usuarioLikes = usuarioLikes.filter(g => g.raza !== gatoRaza);
            gato.likes--;
            boton.removeClass('like-pulsado');
        }else{
            //Si no le había dado like, lo añado a la lista
            usuarioLikes.push({raza: gatoRaza});
            gato.likes++;
            boton.addClass('like-pulsado');
        }
        //Guardo los cambios en usuarioLogueado, en la lista de usuarios y en la lista de gatos
        //logueado
        usuarioLogueado.likes = usuarioLikes;
        localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioLogueado));
        //usuarios
        let usuarios = JSON.parse(localStorage.getItem('usuarios'));
        let usuario = usuarios.find(u => u.nombreUsuario === usuarioLogueado.nombreUsuario);
        usuario.likes = usuarioLikes;
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        //gatos
        localStorage.setItem('gatos', JSON.stringify(gatos));
        //Recargo por si ha habido cambios en los estilos. Los estilos se aplican en la funcion rellenarBotonesFicha
        mostrarRazas();
    } else {
        alert('Debes iniciar sesión para dar like');
    }
}

function dislikePulsado(boton, gatoRaza){
    //compruebo que haya un usuario logueado
    let usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'));
    if (usuarioLogueado) {
        //Compruebo si ya le había dado dislike
        let usuarioDislikes = usuarioLogueado.dislikes || [];
        let gatoEncontrado = usuarioDislikes.find(g => g.raza === gatoRaza);//en el array de dislikes del usuario logueado
        
        let gatos = JSON.parse(localStorage.getItem('gatos'));
        let gato = gatos.find(g => g.raza === gatoRaza);//en el array de gatos

        if (gatoEncontrado) {
            //Si ya le había dado dislike, lo quito de la lista 
            usuarioDislikes = usuarioDislikes.filter(g => g.raza !== gatoRaza);
            gato.dislikes--;
            boton.removeClass('dislike-pulsado');
        }else{
            //Si no le había dado dislike, lo añado a la lista
            usuarioDislikes.push({raza: gatoRaza});
            gato.dislikes++;
            boton.addClass('dislike-pulsado');
        }
        //Guardo los cambios en usuarioLogueado, en la lista de usuarios y en la lista de gatos
        //logueado
        usuarioLogueado.dislikes = usuarioDislikes;
        localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioLogueado));
        //usuarios
        let usuarios = JSON.parse(localStorage.getItem('usuarios'));
        let usuario = usuarios.find(u => u.nombreUsuario === usuarioLogueado.nombreUsuario);
        usuario.dislikes = usuarioDislikes;
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        //gatos
        localStorage.setItem('gatos', JSON.stringify(gatos));
        //Recargo por si ha habido cambios en los estilos. Los estilos se aplican en la funcion rellenarBotonesFicha
        mostrarRazas();
    } else {
        alert('Debes iniciar sesión para dar dislike');
    }
}


