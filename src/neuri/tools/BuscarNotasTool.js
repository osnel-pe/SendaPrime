import BaseTool from "./BaseTool";
import { supabase } from "../../services/supabase";

class BuscarNotasTool extends BaseTool{

    constructor(){

        super("buscarNotas");

    }

    async ejecutar({ alumno }){

        if(!alumno){

            return [];

        }

        const { data,error }=

        await supabase

        .from("notas")

        .select("*")

        .eq(

            "alumno_id",

            alumno.id

        )

        .order(

            "created_at",

            {

                ascending:false

            }

        );

        if(error){

            return [];

        }

        return data;

    }

}

export default new BuscarNotasTool();