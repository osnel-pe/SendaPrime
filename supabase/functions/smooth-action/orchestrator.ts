import { buscarAlumno } from "./buscarAlumno.ts";
import { construirContexto } from "./contextBuilder.ts";
import { analizarAlumno } from "./analysisEngine.ts";
import { construirPrompt } from "./promptBuilder.ts";
import { preguntarGroq } from "./groq.ts";

import {
    obtenerContexto,
    guardarContexto
} from "./memory.ts";

import {
    seleccionarAlumnoPorTexto,
    obtenerNombreCompleto
} from "./seleccionAlumno.ts";

import type { Alumno } from "./types.ts";

type EjecutarNeuriParams = {
    mensaje: string;
    alumnoId?: string | null;
    chatId?: string | null;
};


export async function ejecutarNeuri({
    mensaje,
    alumnoId,
    chatId
}: EjecutarNeuriParams) {

    const texto = mensaje.trim();

    if (!texto) {
        throw new Error(
            "El mensaje no puede estar vacío."
        );
    }


    let alumno: Alumno | null = null;

    let memoriaAnterior: any = null;


    /*
     * 1. RECUPERAR MEMORIA
     */

    if (chatId) {

        memoriaAnterior =
            await obtenerContexto(chatId);

    }


    /*
     * 2. SELECCIONAR ALUMNO PENDIENTE
     */

    if (

        memoriaAnterior &&

        Array.isArray(
            memoriaAnterior.alumnosPendientes
        ) &&

        memoriaAnterior.alumnosPendientes.length > 0

    ) {

        const alumnoSeleccionado =
            seleccionarAlumnoPorTexto(
                memoriaAnterior.alumnosPendientes,
                texto
            );

        if (alumnoSeleccionado) {

            alumno =
                alumnoSeleccionado as Alumno;

            console.log(
                "ALUMNO SELECCIONADO:",
                obtenerNombreCompleto(alumno)
            );

        }

    }


    /*
     * 3. BUSCAR POR ID
     */

    if (!alumno && alumnoId) {

        const resultadoPorId =
            await buscarAlumno({
                alumnoId: alumnoId
            });

        if (

            resultadoPorId &&

            resultadoPorId.estado === "unico" &&

            resultadoPorId.alumno

        ) {

            alumno =
                resultadoPorId.alumno as Alumno;

        }

    }


    /*
     * 4. RECUPERAR ALUMNO ACTUAL DE LA MEMORIA
     *
     * Esto permite:
     *
     * Usuario:
     * ¿Cómo está Francisco?
     *
     * Después:
     * ¿Cuáles son sus citas?
     *
     */

    if (

        !alumno &&

        memoriaAnterior &&

        memoriaAnterior.alumnoActual

    ) {

        alumno =
            memoriaAnterior.alumnoActual as Alumno;

        console.log(
            "ALUMNO RECUPERADO DE MEMORIA:",
            obtenerNombreCompleto(alumno)
        );

    }


    /*
     * 5. DETECTAR POSIBLE REFERENCIA A ALUMNO
     */

    const pareceMencionarAlumno =
        /\b(alumno|alumna|estudiante|niño|niña|joven|chico|chica|calificaciones|notas|expediente|riesgo|seguimiento|cita|citas|historial|progreso|conducta)\b/i.test(texto);


    /*
     * 6. BUSCAR ALUMNO NUEVO
     */

    if (

        !alumno &&

        pareceMencionarAlumno

    ) {

        const resultadoBusqueda =
            await buscarAlumno({
                mensaje: texto
            });


        /*
         * VARIOS ALUMNOS
         */

        if (

            resultadoBusqueda &&

            resultadoBusqueda.estado === "varios"

        ) {

            const alumnos: Alumno[] =
                resultadoBusqueda.alumnos || [];


            const nombres =
                alumnos.map(
                    (
                        estudiante,
                        indice
                    ) => {

                        const nombre =
                            obtenerNombreCompleto(
                                estudiante
                            );

                        const grupo =
                            estudiante.grupo
                                ? ` — Grupo ${estudiante.grupo}`
                                : "";

                        return (
                            `${indice + 1}. ` +
                            `${nombre}` +
                            `${grupo}`
                        );

                    }
                );


            /*
             * GUARDAR LISTA EN MEMORIA
             */

            if (chatId) {

                await guardarContexto(
                    chatId,
                    {
                        ...(memoriaAnterior || {}),

                        alumnoActual:
                            null,

                        alumnosPendientes:
                            alumnos
                    }
                );

            }


            return {

                respuesta:
                    "Encontré varios alumnos que coinciden con tu solicitud:\n\n" +
                    nombres.join("\n") +
                    "\n\nIndícame el número, el nombre completo o los apellidos del alumno que deseas consultar.",

                tipo:
                    "seleccion_alumno",

                alumnos

            };

        }


        /*
         * UN SOLO ALUMNO
         */

        if (

            resultadoBusqueda &&

            resultadoBusqueda.estado === "unico" &&

            resultadoBusqueda.alumno

        ) {

            alumno =
                resultadoBusqueda.alumno as Alumno;

        }

    }


    /*
     * 7. CONVERSACIÓN GENERAL
     */

    if (!alumno) {

        const promptGeneral = `

Eres Neuri, asistente especializado en Psicología Escolar.

Responde siempre en español.

Responde de forma clara, breve y profesional.

Puedes responder preguntas generales sobre:

- educación;
- psicología escolar;
- aprendizaje;
- conducta;
- convivencia;
- desarrollo socioemocional;
- orientación educativa;
- estrategias psicopedagógicas.

No inventes información sobre alumnos.

No inventes expedientes, calificaciones, citas, notas, riesgos ni antecedentes.

No emitas diagnósticos clínicos.

Responde únicamente a la pregunta realizada.

Si el usuario solicita información sobre un alumno específico
y no existe un alumno identificado, solicita su nombre completo
o sus apellidos.

Pregunta del usuario:

${texto}

`;


        const respuesta =
            await preguntarGroq(
                promptGeneral
            );


        return {

            respuesta,

            tipo:
                "conversacion_general"

        };

    }


    /*
     * 8. IDENTIDAD DEL ALUMNO
     */

    console.log(
        "===== NEURI ====="
    );

    console.log(
        "ALUMNO IDENTIFICADO:",
        obtenerNombreCompleto(alumno)
    );

    console.log(
        "ID:",
        alumno.id
    );

    console.log(
        "GRUPO:",
        alumno.grupo
    );

    console.log(
        "================="
    );


    /*
     * 9. CONSTRUIR CONTEXTO
     */

    const contexto =
        await construirContexto(
            alumno,
            texto
        );


    /*
     * 10. ANALIZAR ALUMNO
     */

    const analisis =
        analizarAlumno(
            contexto
        );


    /*
     * 11. GUARDAR MEMORIA
     */

    if (chatId) {

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
     * 12. CONSTRUIR PROMPT
     */

    const prompt =
        construirPrompt({

            mensaje:
                texto,

            contexto,

            analisis

        });


    /*
     * 13. CONSULTAR GROQ
     */

    const respuesta =
        await preguntarGroq(
            prompt
        );


    /*
     * 14. RESPUESTA FINAL
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