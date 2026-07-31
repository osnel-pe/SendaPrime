import type { Alumno } from "./types.ts";

import {

    guardarContexto

} from "./memory.ts";

import {

    resolverSeleccionPendiente

} from "./selectorPendiente.ts";

import {

    buscarAlumnoUnificado

} from "./buscadorAlumno.ts";

import {

    quiereCambiarAlumno

} from "./detectorCambio.ts";


type Params={

    texto:string;

    alumnoId?:string|null;

    chatId?:string|null;

    memoriaAnterior:any;

};


type Resultado={

    tipo:

        |"unico"

        |"varios"

        |"ninguno"

        |"seleccionado"

        |"memoria";

    alumno?:Alumno;

    alumnos?:Alumno[];

};


export async function resolverAlumno({

    texto,

    alumnoId,

    chatId,

    memoriaAnterior

}:Params):Promise<Resultado>{

    /*
     * 1
     * Resolver selección pendiente
     */

    const pendiente=

        resolverSeleccionPendiente(

            texto,

            memoriaAnterior?.alumnosPendientes ?? []

        );

    if(pendiente){

        if(chatId){

            await guardarContexto(

                chatId,

                {

                    ...memoriaAnterior,

                    alumnoActual:pendiente,

                    alumnosPendientes:[]

                }

            );

        }

        return{

            tipo:"seleccionado",

            alumno:pendiente

        };

    }

    /*
     * 2
     * Continuar con el alumno actual
     */

    if(

        memoriaAnterior?.alumnoActual

    ){

        const cambiar=

            quiereCambiarAlumno(

                texto,

                memoriaAnterior.alumnoActual

            );

        if(!cambiar){

            return{

                tipo:"memoria",

                alumno:

                    memoriaAnterior.alumnoActual

            };

        }

    }

    /*
     * 3
     * Buscar un alumno nuevo
     */

    const resultado=

        await buscarAlumnoUnificado(

            texto,

            alumnoId

        );

    if(

        resultado.tipo==="unico"

    ){

        return resultado;

    }

    if(

        resultado.tipo==="varios"

    ){

        return resultado;

    }

    /*
     * 4
     * Si no encontró ninguno,
     * conservar el alumno actual.
     */

    if(

        memoriaAnterior?.alumnoActual

    ){

        return{

            tipo:"memoria",

            alumno:

                memoriaAnterior.alumnoActual

        };

    }

    return{

        tipo:"ninguno"

    };

}