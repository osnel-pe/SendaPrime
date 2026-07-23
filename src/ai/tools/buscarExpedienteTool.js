import BaseTool from "./BaseTool";
import { supabase } from "../../services/supabase";

class BuscarExpedienteTool extends BaseTool{

    constructor(){

        super("buscarExpediente");

    }

    async ejecutar({ alumno }){

        if(!alumno){

            return null;

        }

        const { data,error } =

        await supabase

        .from("alumnos")

        .select(`
            expediente_pdf,
            nee,
            nee_observaciones
        `)

        .eq("id", alumno.id)

        .single();

        if(error){

            console.error(error);

            return null;

        }

        return data;

    }

}

export default new BuscarExpedienteTool();