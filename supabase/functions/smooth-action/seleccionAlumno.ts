import type { Alumno } from "./types.ts";


/*
 * OBTENER NOMBRE COMPLETO
 */

export function obtenerNombreCompleto(

    alumno: Alumno

): string {

    return [

        alumno.nombre,

        alumno.apellido_paterno,

        alumno.apellido_materno

    ]

        .filter(Boolean)

        .join(" ");

}


/*
 * NORMALIZAR TEXTO
 */

function normalizar(

    texto: string

): string {

    return texto

        .toLowerCase()

        .normalize("NFD")

        .replace(

            /[\u0300-\u036f]/g,

            ""

        )

        .trim();

}


/*
 * SELECCIONAR ALUMNO
 *
 * Permite:
 *
 * 1
 * primero
 * el primero
 * primera
 * segundo
 * el segundo
 * nombre completo
 * grupo
 * referencias simples
 */

    export function seleccionarAlumnoPorTexto(

    alumnos: Alumno[],

    texto: string

): Alumno | null {


    const consulta =

        normalizar(

            texto

        );


    if (

        !consulta ||

        alumnos.length === 0

    ) {

        return null;

    }


    /*
     * NÚMERO DIRECTO
     *
     * Ejemplo:
     *
     * 2
     */

    const numeroDirecto =

        consulta.match(

            /^\d+$/

        );


    if (

        numeroDirecto

    ) {

        const indice =

            Number(

                numeroDirecto[0]

            ) - 1;


        if (

            indice >= 0 &&

            indice < alumnos.length

        ) {

            return alumnos[indice];

        }

    }


    /*
     * NÚMERO DENTRO DEL TEXTO
     *
     * Ejemplos:
     *
     * "número 2"
     * "opción 2"
     * "el número 2"
     * "quiero el 2"
     */

    const numeroEnTexto =

        consulta.match(

            /\b(?:numero|opcion|opción|el|la)?\s*(\d+)\b/i

        );


    if (

        numeroEnTexto

    ) {

        const indice =

            Number(

                numeroEnTexto[1]

            ) - 1;


        if (

            indice >= 0 &&

            indice < alumnos.length

        ) {

            return alumnos[indice];

        }

    }


    /*
     * ORDINALES
     */

    const ordinales: Record<string, number> = {


        primero: 0,

        primera: 0,


        segundo: 1,

        segunda: 1,


        tercero: 2,

        tercera: 2,


        cuarto: 3,

        cuarta: 3,


        quinto: 4,

        quinta: 4,


        sexto: 5,

        sexta: 5,


        septimo: 6,

        septima: 6,


        octavo: 7,

        octava: 7,


        noveno: 8,

        novena: 8,


        decimo: 9,

        decima: 9,


        ultimo: alumnos.length - 1,

        ultima: alumnos.length - 1

    };


    for (

        const palabra of

        Object.keys(

            ordinales

        )

    ) {


        const expresion =

            new RegExp(

                `\\b${palabra}\\b`,

                "i"

            );


        if (

            expresion.test(

                consulta

            )

        ) {


            const indice =

                ordinales[

                    palabra

                ];


            if (

                indice >= 0 &&

                indice < alumnos.length

            ) {

                return alumnos[indice];

            }

        }

    }


    /*
     * GRUPO
     */

    for (

        const alumno of

        alumnos

    ) {


        if (

            alumno.grupo &&

            consulta.includes(

                normalizar(

                    alumno.grupo

                )

            )

        ) {

            return alumno;

        }

    }


    /*
     * NOMBRE COMPLETO
     */

    const encontrados =

        alumnos.filter(

            alumno =>

                normalizar(

                    obtenerNombreCompleto(

                        alumno

                    )

                )

                .includes(

                    consulta

                )

        );


    if (

        encontrados.length === 1

    ) {

        return encontrados[0];

    }


    /*
     * REFERENCIAS GENERALES
     */

    if (

        /\b(el|la|ese|esa|este|esta|alumno|alumna)\b/i

            .test(

                consulta

            )

        &&

        alumnos.length === 1

    ) {

        return alumnos[0];

    }


    return null;

}


/*
 * DETECTAR SI EL USUARIO QUIERE
 * CAMBIAR DE ALUMNO
 */

export function mencionaAlumnoNuevo(

    mensaje: string,

    alumnoActual: Alumno | null

): boolean {


    /*
     * SI NO HAY ALUMNO ACTUAL,
     * CUALQUIER NOMBRE PUEDE SER NUEVO
     */

    if (

        !alumnoActual

    ) {

        return true;

    }


    /*
     * NORMALIZAR TEXTO
     */

    const texto =

        normalizar(

            mensaje

        );


    /*
     * NORMALIZAR NOMBRE ACTUAL
     */

    const nombreActual =

        normalizar(

            obtenerNombreCompleto(

                alumnoActual

            )

        );


    /*
     * PARTES DEL NOMBRE ACTUAL
     */

    const partesNombre =

        nombreActual

            .split(" ")

            .filter(

                parte =>

                    parte.length > 2

            );


    /*
     * ¿EL MENSAJE MENCIONA
     * AL ALUMNO ACTUAL?
     */

    const mencionaNombreActual =

        partesNombre.some(

            parte =>

                texto.includes(

                    parte

                )

        );


    /*
     * PALABRAS QUE INDICAN
     * CAMBIO DE ALUMNO
     */

    const palabrasCambio =

        /\b(cambiar|otro|otra|buscar|consultar|ver|mostrar|ahora|nuevo|nueva)\b/i

            .test(

                texto

            );


    /*
     * EJEMPLOS:
     *
     * "¿Qué citas tiene?"
     * → CONTINÚA CON EL ACTUAL
     *
     * "¿Qué factores influyen?"
     * → CONTINÚA CON EL ACTUAL
     *
     * "Ahora consulta a María"
     * → BUSCA NUEVO
     *
     * "Quiero ver a Pedro"
     * → BUSCA NUEVO
     */


    if (

        mencionaNombreActual &&

        !palabrasCambio

    ) {

        return false;

    }


    return palabrasCambio;

}