//------------------------Variables
const URL_RAZAS_DATOS='https://catfact.ninja/breeds';
const URL_FOTOS="https://api.thecatapi.com/v1/images/search?breed_ids={breed.id}";

let orden=$('form-orden').val();
let vista=$('form-vista').val();

//------------------------Eventos
//Evento para el cambio de orden
$('form-orden').change(function(){
    orden=$(this).val();
    mostrarRazas(razas);
});
$('form-vista').change(function(){
    vista=$(this).val();
    mostrarRazas(razas);
});

// -----------------------Llamadas a las funciones
// Voy a guardar la información que necesito para el inicio (razas, id razas y foto) en localStorage en 'gatos'. LocalStorage es más rápido que hacer llamadas AJAX y así no tengo que estar pendiente de la asincronía
if (localStorage.getItem('gatos') === null) {
    obtenerRazas();
    //en este punto el array aún no está completo, por la asíncronía de las llamadas AJAX, pero se guardará en localStorage cuando esté completo en la función obtenerImagenes, después pasa a mostrarRazas
}else{
    mostrarRazas();//me ahorro las dos primeras funciones
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
                        id: razas2[j].id
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
                raza.imagen = respuesta[0].url;
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
    console.log(JSON.parse(localStorage.getItem('gatos')));
}