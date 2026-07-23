export type MensajeValidado = {

    mensaje: string;

    alumnoId?: string | null;

    chatId?: string | null;

};


export function validarMensaje(

    body: unknown

): MensajeValidado {

    if (

        !body ||

        typeof body !== "object"

    ) {

        throw new Error(

            "El cuerpo de la solicitud no es válido."

        );

    }

    const datos =
        body as Record<string, unknown>;


    const mensaje =

        typeof datos.mensaje === "string"

            ? datos.mensaje.trim()

            : "";


    if (!mensaje) {

        throw new Error(

            "El mensaje es obligatorio."

        );

    }


    return {

        mensaje,

        alumnoId:

            typeof datos.alumnoId === "string"

                ? datos.alumnoId

                : null,

        chatId:

            typeof datos.chatId === "string"

                ? datos.chatId

                : null

    };

}