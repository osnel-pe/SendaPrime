import type {

    ContextoAlumno,

    Cita,

    NEE

} from "./types.ts";


/*
 * NORMALIZAR TEXTO
 */

function normalizarTexto(

    texto: string

): string {

    return texto

        .normalize("NFD")

        .replace(

            /[\u0300-\u036f]/g,

            ""

        )

        .toLowerCase()

        .trim();

}


/*
 * OBTENER CITAS SEGURAS
 */

function obtenerCitas(

    contexto: ContextoAlumno

): Cita[] {

    const citas =

        contexto.alumno.citas;


    return Array.isArray(citas)

        ? citas

        : [];

}


/*
 * OBTENER REGISTROS NEE SEGUROS
 */

function obtenerNEE(

    contexto: ContextoAlumno

): NEE[] {

    const nee =

        contexto.alumno.nee;


    return Array.isArray(nee)

        ? nee

        : [];

}


/*
 * OBTENER NOTAS SEGURAS
 */

function obtenerNotas(

    contexto: ContextoAlumno

) {

    return Array.isArray(

        contexto.notas

    )

        ? contexto.notas

        : [];

}


/*
 * OBTENER FECHA SEGURA
 */

function obtenerTiempoFecha(

    fecha?: string | null

): number {

    if (!fecha) {

        return 0;

    }


    const tiempo =

        new Date(

            fecha

        ).getTime();


    return Number.isNaN(

        tiempo

    )

        ? 0

        : tiempo;

}


/*
 * OBTENER ÚLTIMA CITA
 */

function obtenerUltimaCita(

    citas: Cita[]

): Cita | null {

    if (

        citas.length === 0

    ) {

        return null;

    }


    return citas

        .slice()

        .sort(

            (

                a: Cita,

                b: Cita

            ) =>

                obtenerTiempoFecha(

                    b.fecha

                )

                -

                obtenerTiempoFecha(

                    a.fecha

                )

        )[0] ?? null;

}


/*
 * RESPUESTA DIRECTA
 */

export function responderDirectamente(

    mensaje: string,

    contexto: ContextoAlumno

): string | null {


    const texto =

        normalizarTexto(

            mensaje

        );


    const citas =

        obtenerCitas(

            contexto

        );


    const notas =

        obtenerNotas(

            contexto

        );


    const nee =

        obtenerNEE(

            contexto

        );


    /*
     * ========================================
     * CITAS
     * ========================================
     */


    /*
     * TOTAL DE CITAS
     */

    if (

        /\b(cuantas|cuantos|numero de|total de)\b/

            .test(texto)

        &&

        /\b(cita|citas|sesion|sesiones)\b/

            .test(texto)

    ) {


        return (

            `El alumno tiene ` +

            `${citas.length} ` +

            `cita(s) registradas.`

        );

    }


    /*
     * EXISTENCIA DE CITAS
     */

    if (

        /\b(tiene|hay|existen)\b/

            .test(texto)

        &&

        /\b(cita|citas|sesion|sesiones)\b/

            .test(texto)

    ) {


        if (

            citas.length === 0

        ) {

            return (

                "El alumno no tiene citas registradas."

            );

        }


        return (

            `Sí. El alumno tiene ` +

            `${citas.length} ` +

            `cita(s) registradas.`

        );

    }


    /*
     * MOSTRAR TODAS LAS CITAS
     */

    if (

        /\b(cuales|que|lista|mostrar|detalla|detallame)\b/

            .test(texto)

        &&

        /\b(cita|citas|sesion|sesiones|intervencion|intervenciones)\b/

            .test(texto)

    ) {


        if (

            citas.length === 0

        ) {

            return (

                "No hay citas registradas."

            );

        }


        const listado =

            citas.map(

                (

                    registro: Cita,

                    indice: number

                ) => {


                    const partes = [

                        `${indice + 1}.`,

                        registro.tipo

                            ? `Tipo: ${registro.tipo}`

                            : null,

                        registro.fecha

                            ? `Fecha: ${registro.fecha}`

                            : null,

                        registro.motivo

                            ? `Motivo: ${registro.motivo}`

                            : null

                    ];


                    return partes

                        .filter(Boolean)

                        .join(" ");

                }

            );


        return (

            "Citas registradas:\n\n" +

            listado.join("\n")

        );

    }


    /*
     * ÚLTIMA CITA
     */

    if (

        /\b(ultima|ultimo|reciente|recientemente)\b/

            .test(texto)

        &&

        /\b(cita|sesion|intervencion)\b/

            .test(texto)

    ) {


        const ultima =

            obtenerUltimaCita(

                citas

            );


        if (!ultima) {

            return (

                "No hay citas registradas."

            );

        }


        return (

            `La última cita registrada fue ` +

            `${ultima.fecha ?? "en una fecha no especificada"}. ` +

            `Tipo: ` +

            `${ultima.tipo ?? "no especificado"}.`

        );

    }


    /*
     * ========================================
     * NEE Y DIAGNÓSTICOS
     * ========================================
     */


    /*
     * TOTAL DE REGISTROS NEE
     */

    if (

        /\b(tiene|hay|cuantos|cuantas|numero de|total de)\b/

            .test(texto)

        &&

        /\b(nee|diagnostico|diagnosticos)\b/

            .test(texto)

    ) {


        if (

            nee.length === 0

        ) {

            return (

                "No hay registros NEE o diagnósticos registrados."

            );

        }


        return (

            `El alumno tiene ` +

            `${nee.length} ` +

            `registro(s) NEE.`

        );

    }


    /*
     * MOSTRAR DIAGNÓSTICOS
     */

    if (

        /\b(que|cuales|cual|mostrar|lista)\b/

            .test(texto)

        &&

        /\b(diagnostico|diagnosticos)\b/

            .test(texto)

    ) {


        if (

            nee.length === 0

        ) {

            return (

                "No hay diagnósticos registrados."

            );

        }


        const diagnosticos =

            nee

                .map(

                    (

                        registro: NEE

                    ) =>

                        registro.diagnostico

                )

                .filter(

                    (

                        diagnostico

                    ): diagnostico is string =>

                        Boolean(

                            diagnostico

                        )

                );


        if (

            diagnosticos.length === 0

        ) {

            return (

                "No hay diagnósticos especificados."

            );

        }


        return (

            "Diagnósticos registrados:\n\n" +

            diagnosticos

                .map(

                    (

                        diagnostico: string,

                        indice: number

                    ) =>

                        `${indice + 1}. ${diagnostico}`

                )

                .join("\n")

        );

    }


    /*
     * MOSTRAR NIVEL NEE
     */

    if (

        /\b(nivel|niveles|grado|severidad)\b/

            .test(texto)

        &&

        /\b(nee|diagnostico|diagnosticos)\b/

            .test(texto)

    ) {


        if (

            nee.length === 0

        ) {

            return (

                "No hay información registrada " +

                "sobre niveles NEE."

            );

        }


        return (

            nee

                .map(

                    (

                        registro: NEE

                    ) =>

                        (

                            `${registro.diagnostico ?? "Sin diagnóstico"}: ` +

                            `${registro.nivel ?? "Sin nivel registrado"}`

                        )

                )

                .join("\n")

        );

    }


    /*
     * ========================================
     * NOTAS
     * ========================================
     */


    /*
     * TOTAL DE NOTAS
     */

    if (

        /\b(cuantas|cuantos|numero de|total de)\b/

            .test(texto)

        &&

        /\b(nota|notas|registro|registros)\b/

            .test(texto)

    ) {


        return (

            `El alumno tiene ` +

            `${notas.length} ` +

            `nota(s) registradas.`

        );

    }


    /*
     * EXISTENCIA DE NOTAS
     */

    if (

        /\b(tiene|hay|existen)\b/

            .test(texto)

        &&

        /\b(nota|notas)\b/

            .test(texto)

    ) {


        if (

            notas.length === 0

        ) {

            return (

                "El alumno no tiene notas registradas."

            );

        }


        return (

            `El alumno tiene ` +

            `${notas.length} ` +

            `nota(s) registradas.`

        );

    }


    /*
     * ========================================
     * EXPEDIENTE
     * ========================================
     */

    if (

        /\b(tiene|existe|hay|cuenta con|posee)\b/

            .test(texto)

        &&

        /\b(expediente|archivo|pdf|documento)\b/

            .test(texto)

    ) {


        return contexto.alumno.expediente_pdf

            ? (

                "El alumno tiene un expediente registrado."

            )

            : (

                "El alumno no tiene un expediente registrado."

            );

    }


    /*
     * ========================================
     * NEE OBSERVACIONES
     * ========================================
     */

    if (

        /\b(observaciones|observacion|dificultades)\b/

            .test(texto)

        &&

        /\b(nee|diagnostico|diagnosticos)\b/

            .test(texto)

    ) {


        if (

            nee.length === 0

        ) {

            return (

                "No hay observaciones NEE registradas."

            );

        }


        const observaciones =

            nee

                .map(

                    (

                        registro: NEE

                    ) =>

                        registro.observaciones

                )

                .filter(

                    (

                        observacion

                    ): observacion is string =>

                        Boolean(

                            observacion

                        )

                );


        if (

            observaciones.length === 0

        ) {

            return (

                "No hay observaciones NEE especificadas."

            );

        }


        return (

            "Observaciones registradas:\n\n" +

            observaciones.join("\n")

        );

    }


    /*
     * ========================================
     * SIN RESPUESTA DIRECTA
     * ========================================
     */

    return null;

}