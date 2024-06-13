const URL_RAZAS_DATOS='https://catfact.ninja/breeds';
const URL_FOTOS="https://api.thecatapi.com/v1/images/search?breed_ids={breed.id}";

//Llamadas a las funciones
obtenerRazas();
//-----------------Funciones
function obtenerRazas() {
    let razasArray=[];
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
                        razas1.push(respuesta.data[i].breed); // es un string
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
                        razas2.push({raza: nombreRaza, id: idRaza}); // es un objeto
                    }
                }
            }
        },
        error: function (error) {
            console.error(error);
        }
    });

    // Esperar a que ambas solicitudes finalicen
    $.when(solicitud1, solicitud2).done(function() {
        // Ahora meto en razasArray las razas que se repiten en razas1 y razas2
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

function obtenerImagenes(razas){
    //Voy a recorrer razas para sacar los id y así obtener las imagenes. Las imagenes las voy a meter en el array de objetos razas con la key imagen
    let solicitud=function(){
        for (let i = 0; i < razas.length; i++) {
            let idRaza = razas[i].id;
            let url = URL_FOTOS.replace('{breed.id}', idRaza);
            $.ajax({
                url: url,
                type: 'GET',
                success: function (respuesta) {
                    razas[i].imagen = respuesta[0].url;
                },
                error: function (error) {
                    console.error(error);
                }
            });
        }
    }
    $.when(solicitud).done(function(){
        mostrarRazas(razas);
    });
}

