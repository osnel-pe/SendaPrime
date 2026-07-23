import {
    corsHeaders,
    ok,
    fail
} from "./response.ts";

import {
    validarMensaje
} from "./validator.ts";

import {
    ejecutarNeuri
} from "./orchestrator.ts";

Deno.serve(async (req) => {

    if (req.method === "OPTIONS") {

        return new Response(

            "ok",

            {
                headers: corsHeaders
            }

        );

    }

    try {

        const body =
            await req.json();

        const datos =
            validarMensaje(body);

        const resultado =
            await ejecutarNeuri({

                mensaje:
                    datos.mensaje,

                alumnoId:
                    datos.alumnoId,

                chatId:
                    datos.chatId

            });

        return ok(resultado);

    }

    catch (error) {

        console.error(

            "ERROR EN NEURI:",

            error

        );

        const mensaje =

            error instanceof Error

                ? error.message

                : "Error interno";

        return fail(mensaje);

    }

});