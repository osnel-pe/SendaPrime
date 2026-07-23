import {
    supabase
} from "./supabaseService.ts";


export async function guardarContexto(

    chatId: string,

    contexto: any

) {


    if (!chatId) {

        return;

    }


    const {

        error

    } = await supabase

        .from("memoria_neuri")

        .upsert(

            {

                chat_id:

                    chatId,

                contexto:

                    contexto,

                actualizado_en:

                    new Date().toISOString()

            },

            {

                onConflict:

                    "chat_id"

            }

        );


    if (error) {


        console.error(

            "ERROR GUARDANDO MEMORIA:",

            error

        );


        throw error;

    }


    console.log(

        "MEMORIA GUARDADA CORRECTAMENTE:",

        chatId

    );

}


export async function obtenerContexto(

    chatId: string

) {


    if (!chatId) {

        return null;

    }


    const {

        data,

        error

    } = await supabase

        .from("memoria_neuri")

        .select("contexto")

        .eq(

            "chat_id",

            chatId

        )

        .maybeSingle();


    if (error) {


        console.error(

            "ERROR OBTENIENDO MEMORIA:",

            error

        );


        return null;

    }


    return data?.contexto ?? null;

}