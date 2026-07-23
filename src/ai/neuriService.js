import { supabase } from "../services/supabase";

export async function preguntarANeuri({

    mensaje,

    alumnoId = null,

    chatId = null

}) {

    const {

        data,

        error

    } = await supabase.functions.invoke(

        "smooth-action",

        {

            body: {

                mensaje,

                alumnoId,

                chatId

            }

        }

    );


    if (error) {

        throw new Error(

            error.message ||

            "Error conectando con Neuri."

        );

    }


    if (!data) {

        throw new Error(

            "Neuri no devolvió una respuesta."

        );

    }


    return (

        data.respuesta ||

        data.message ||

        "No pude generar una respuesta."

    );

}