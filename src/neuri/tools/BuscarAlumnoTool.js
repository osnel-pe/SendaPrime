import BaseTool from "./BaseTool";
import { supabase } from "../../services/supabase";

class BuscarAlumnoTool extends BaseTool{

    constructor(){

        super("buscarAlumno");

    }

    async ejecutar({ mensaje }){

        const texto = mensaje.toLowerCase();

        const palabras =

            texto

            .replace(/[.,¿?¡!]/g,"")

            .split(" ")

            .filter(p=>p.length>2);

        const { data,error } =

        await supabase

        .from("alumnos")

        .select("*");

        if(error){

            throw error;

        }

        let mejorAlumno=null;

        let mejorPuntaje=0;

        for(const alumno of data){

            let puntaje=0;

            const nombre=

            `${

                alumno.nombre || ""

            }

            ${

                alumno.apellido_paterno || ""

            }

            ${

                alumno.apellido_materno || ""

            }`

            .toLowerCase();

            palabras.forEach(p=>{

                if(nombre.includes(p)){

                    puntaje++;

                }

            });

            if(puntaje>mejorPuntaje){

                mejorPuntaje=puntaje;

                mejorAlumno=alumno;

            }

        }

        return mejorAlumno;

    }

}

export default new BuscarAlumnoTool();