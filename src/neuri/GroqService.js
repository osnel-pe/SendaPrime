import { supabase } from "../services/supabase";

class GroqService{

    async preguntar(prompt){

        const respuesta=

        await fetch(

        "https://aolwnnymiepciaehkhgo.supabase.co/functions/v1/smooth-action",

        {

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify({

                mensaje:prompt

            })

        });

        const datos=await respuesta.json();

        return datos.respuesta;

    }

}

export default new GroqService();