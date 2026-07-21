import { supabase } from "../services/supabase";

const FUNCTION_URL =
    "https://aolwnnymiepciaehkhgo.supabase.co/functions/v1/smooth-action";

export async function preguntarANeuri({

    mensaje,

    alumnoId = null

}) {

    console.log("NEURI: iniciando petición");

    const respuesta = await fetch(

        FUNCTION_URL,

        {

            method: "POST",

            headers: {

                "Content-Type":
                    "application/json",

                apikey:
                    supabase.supabaseKey

            },

            body: JSON.stringify({

                mensaje,

                alumnoId

            })

        }

    );

    console.log(
        "NEURI: status HTTP",
        respuesta.status
    );

    const texto =
        await respuesta.text();

    console.log(
        "NEURI: respuesta cruda",
        texto
    );

    let datos;

    try {

        datos =
            JSON.parse(texto);

    }

    catch {

        throw new Error(
            "La respuesta del servidor no es JSON."
        );

    }

    if (!respuesta.ok) {

        throw new Error(

            datos?.error ||

            datos?.message ||

            `Error HTTP ${respuesta.status}`

        );

    }

    if (!datos.respuesta) {

        throw new Error(
            "La función no devolvió respuesta."
        );

    }

    return datos.respuesta;

}