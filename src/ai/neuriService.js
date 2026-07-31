import { supabase } from "../services/supabase";

export async function preguntarANeuri({
    mensaje,
    alumnoId = null,
    chatId = null
}) {


    const respuesta = await supabase.functions.invoke(
        "smooth-action",
        {
            body: {
                mensaje,
                alumnoId,
                chatId
            }
        }
    );


    return respuesta.data?.respuesta || "SIN RESPUESTA";
}