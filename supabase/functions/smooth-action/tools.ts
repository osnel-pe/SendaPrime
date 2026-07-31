import type {

    ContextoAlumno,
    Cita,
    Nota

} from "./types.ts";

export type Tool = {

    nombre: string;

    puedeEjecutar: (

        mensaje: string

    ) => boolean;

    ejecutar: (

        mensaje: string,

        contexto: ContextoAlumno

    ) => string | null;

};

function normalizar(

    texto: string

) {

    return texto

        .normalize("NFD")

        .replace(

            /[\u0300-\u036f]/g,

            ""

        )

        .toLowerCase();

}

/* =======================================================
   CITAS
======================================================= */

const toolCitas: Tool = {

    nombre: "citas",

    puedeEjecutar(

        mensaje

    ) {

        const t = normalizar(

            mensaje

        );

        return /\b(cita|citas|sesion|sesiones|entrevista|intervencion)\b/.test(t);

    },

    ejecutar(

        mensaje,

        contexto

    ) {

        const texto = normalizar(

            mensaje

        );

        const citas =

            contexto.citas ?? [];

        if (

            citas.length === 0

        ) {

            return "El alumno no tiene citas registradas.";

        }

        if (

            /\b(cuantas|cuantos|total)\b/.test(texto)

        ) {

            return `El alumno tiene ${citas.length} cita(s).`;

        }

        if (

            /\b(ultima|ultimo|reciente)\b/.test(texto)

        ) {

            const ultima =

                citas[citas.length - 1];

            return `Última cita:\n\n${ultima.fecha ?? "Sin fecha"}\n${ultima.tipo ?? "Sin tipo"}`;

        }

        return citas

            .map(

                (

                    c: Cita,

                    i: number

                ) => {

                    return `${i + 1}. ${c.fecha ?? "Sin fecha"} - ${c.tipo ?? "Sin tipo"}${c.motivo ? ` (${c.motivo})` : ""}`;

                }

            )

            .join("\n");

    }

};

/* =======================================================
   NEE
======================================================= */

const toolNee: Tool = {

    nombre: "nee",

    puedeEjecutar(

        mensaje

    ) {

        return /\b(nee|diagnostico|diagnosticos|diagnóstico|diagnósticos)\b/

            .test(

                normalizar(

                    mensaje

                )

            );

    },

    ejecutar(

        mensaje,

        contexto

    ) {

        const texto =

            normalizar(

                mensaje

            );

        const nee =

            Array.isArray(

                contexto.alumno.nee

            )

                ? contexto.alumno.nee as Record<string, unknown>[]

                : [];

        if (

            nee.length === 0

        ) {

            return "El alumno no tiene registros NEE.";

        }

        if (

            /\b(cuantas|cuantos|total|tiene)\b/.test(texto)

        ) {

            return `El alumno tiene ${nee.length} registro(s) NEE.`;

        }

        if (

            /\b(cuales|cuales son|que|que tiene)\b/.test(texto)

        ) {

            return nee

                .map(

                    (

                        r,

                        i

                    ) => {

                        const diagnostico =

                            String(

                                r.diagnostico ??

                                "Sin diagnóstico"

                            );

                        const nivel =

                            String(

                                r.nivel ??

                                ""

                            );

                        return `${i + 1}. ${diagnostico}${nivel ? ` (${nivel})` : ""}`;

                    }

                )

                .join("\n");

        }

        return null;

    }

};

/* =======================================================
   NOTAS
======================================================= */

const toolNotas: Tool = {

    nombre: "notas",

    puedeEjecutar(

        mensaje

    ) {

        return /\b(nota|notas)\b/

            .test(

                normalizar(

                    mensaje

                )

            );

    },

    ejecutar(

        mensaje,

        contexto

    ) {

        const notas =

            contexto.notas ?? [];

        if (

            notas.length === 0

        ) {

            return "No existen notas registradas.";

        }

        return notas

            .map(

                (

                    n: Nota,

                    i: number

                ) => {

                    return `${i + 1}. ${n.titulo ?? "Sin título"}`;

                }

            )

            .join("\n");

    }

};

/* =======================================================
   EXPEDIENTE
======================================================= */

const toolExpediente: Tool = {

    nombre: "expediente",

    puedeEjecutar(

        mensaje

    ) {

        return /\b(expediente|archivo|pdf)\b/

            .test(

                normalizar(

                    mensaje

                )

            );

    },

    ejecutar(

        mensaje,

        contexto

    ) {

        return contexto.alumno.expediente_pdf

            ? "El alumno tiene expediente registrado."

            : "El alumno no tiene expediente registrado.";

    }

};

export const tools = [

    toolCitas,

    toolNee,

    toolNotas,

    toolExpediente

];