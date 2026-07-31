import {

    tools

} from "./tools.ts";

import type {

    ContextoAlumno

} from "./types.ts";


export function ejecutarTools(

    mensaje:string,

    contexto:ContextoAlumno

):string|null{

    for(

        const tool of tools

    ){

        if(

            tool.puedeEjecutar(

                mensaje

            )

        ){

            const respuesta=

                tool.ejecutar(

                    mensaje,

                    contexto

                );

            if(

                respuesta

            ){

                console.log(

                    "TOOL:",

                    tool.nombre

                );

                return respuesta;

            }

        }

    }

    return null;

}