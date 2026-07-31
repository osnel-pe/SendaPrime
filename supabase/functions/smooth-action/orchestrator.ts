import { construirContexto } from "./contextBuilder.ts";
import { analizarAlumno } from "./analysisEngine.ts";
import { construirPrompt } from "./promptBuilder.ts";
import { preguntarGroq } from "./groq.ts";

import { resolverAlumno } from "./resolverAlumno.ts";

import { responderDirectamente } from "./responseEngine.ts";

import {

    obtenerContexto,

    guardarContexto

} from "./memory.ts";

import {

    obtenerNombreCompleto

} from "./seleccionAlumno.ts";

import type {

    Alumno

} from "./types.ts";

import {

    ejecutarTools

} from "./toolExecutor.ts";

type EjecutarNeuriParams={

    mensaje:string;

    alumnoId?:string|null;

    chatId?:string|null;

};


export async function ejecutarNeuri({

    mensaje,

    alumnoId,

    chatId

}:EjecutarNeuriParams){

    const texto=

        mensaje.trim();

    if(!texto){

        throw new Error(

            "El mensaje no puede estar vacío."

        );

    }

    let memoriaAnterior:any=null;

    if(chatId){

        memoriaAnterior=

            await obtenerContexto(

                chatId

            );

    }

    const resultado=

        await resolverAlumno({

            texto,

            alumnoId,

            chatId,

            memoriaAnterior

        });

    let alumno:Alumno|null=null;

    switch(resultado.tipo){

        case "seleccionado":{

            alumno=

                resultado.alumno ?? null;

            if(!alumno){

                break;

            }

            return{

                respuesta:

                    `Perfecto.\n\nTrabajaré con ${obtenerNombreCompleto(alumno)}${alumno.grupo?` (${alumno.grupo})`:""}.\n\n¿Qué deseas consultar sobre este alumno?`,

                tipo:

                    "alumno_seleccionado",

                alumno

            };

        }

        case "varios":{

            const alumnos=

                resultado.alumnos ?? [];

            const lista=

                alumnos.map(

                    (a,i)=>

                        `${i+1}. ${obtenerNombreCompleto(a)}${a.grupo?` — Grupo ${a.grupo}`:""}`

                );

            if(chatId){

                await guardarContexto(

                    chatId,

                    {

                        ...(memoriaAnterior||{}),

                        alumnoActual:null,

                        alumnosPendientes:alumnos

                    }

                );

            }

            return{

                respuesta:

                    "Encontré varios alumnos que coinciden:\n\n"+

                    lista.join("\n")+

                    "\n\nIndícame cuál deseas consultar.",

                tipo:

                    "seleccion_alumno",

                alumnos

            };

        }

        case "unico":

        case "memoria":{

            alumno=

                resultado.alumno ?? null;

            break;

        }

        case "ninguno":{

            const respuesta=

                await preguntarGroq(`

Eres Neuri.

No pudiste identificar al alumno.

Pide únicamente el nombre completo.

Usuario:

${texto}

`);

            return{

                respuesta,

                tipo:

                    "conversacion_general"

            };

        }

    }

    if(!alumno){

        throw new Error(

            "No fue posible identificar al alumno."

        );

    }

    console.log("==============");

    console.log(

        obtenerNombreCompleto(

            alumno

        )

    );

    console.log(

        alumno.id

    );

    console.log("==============");
        /*
     * =====================================
     * CONSTRUIR CONTEXTO
     * =====================================
     */

    const contexto =

        await construirContexto(

            alumno,

            texto

        );


    /*
     * =====================================
     * RESPUESTA DIRECTA
     * =====================================
     */

    const respuestaDirecta =

    ejecutarTools(

        texto,

        contexto

    )

    ??

    responderDirectamente(

        texto,

        contexto

    );


    if (

        respuestaDirecta

    ) {

        if (

            chatId

        ) {

            await guardarContexto(

                chatId,

                {

                    ...(memoriaAnterior || {}),

                    ...contexto,

                    alumnoActual:

                        alumno,

                    alumnosPendientes: []

                }

            );

        }

        return {

            respuesta:

                respuestaDirecta,

            alumno,

            contexto,

            tipo:

                "respuesta_directa"

        };

    }


    /*
     * =====================================
     * ANÁLISIS DEL ALUMNO
     * =====================================
     */

    const analisis =

        analizarAlumno(

            contexto

        );
        /*
     * =====================================
     * GUARDAR MEMORIA
     * =====================================
     */

    if (

        chatId

    ) {

        await guardarContexto(

            chatId,

            {

                ...(memoriaAnterior || {}),

                ...contexto,

                alumnoActual:

                    alumno,

                alumnosPendientes:

                    []

            }

        );

    }


    /*
     * =====================================
     * CONSTRUIR PROMPT
     * =====================================
     */

    const prompt =

        construirPrompt({

            mensaje:

                texto,

            contexto,

            analisis

        });


    /*
     * =====================================
     * CONSULTAR IA
     * =====================================
     */

    const respuesta =

        await preguntarGroq(

            prompt

        );


    /*
     * =====================================
     * RESPUESTA FINAL
     * =====================================
     */

    return {

        respuesta,

        alumno,

        contexto,

        analisis,

        tipo:

            "analisis_alumno"

    };

}