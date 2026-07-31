import type { Alumno } from "./types.ts";

function normalizar(texto: string): string {

    return texto

        .normalize("NFD")

        .replace(/[\u0300-\u036f]/g, "")

        .toLowerCase()

        .trim();

}

function nombreCompleto(alumno: Alumno): string {

    return [

        alumno.nombre,

        alumno.apellido_paterno,

        alumno.apellido_materno

    ]

        .filter(Boolean)

        .join(" ");

}

export function quiereCambiarAlumno(

    mensaje: string,

    alumnoActual: Alumno | null

): boolean {

    if (!alumnoActual) {

        return true;

    }

    const texto =

        normalizar(mensaje);

    /*
     * Palabras que indican
     * claramente un cambio.
     */

    const palabrasCambio = [

        "otro",

        "otra",

        "cambiar",

        "cambia",

        "buscar",

        "busca",

        "consultar a",

        "ver a",

        "mostrar a",

        "ahora con",

        "seleccionar",

        "elige",

        "escoge"

    ];

    if (

        palabrasCambio.some(

            palabra =>

                texto.includes(

                    palabra

                )

        )

    ) {

        return true;

    }

    /*
     * Si menciona el nombre
     * del alumno actual,
     * seguimos con él.
     */

    const partes =

        nombreCompleto(

            alumnoActual

        )

            .split(" ")

            .filter(

                p =>

                    p.length > 2

            )

            .map(normalizar);

    if (

        partes.some(

            parte =>

                texto.includes(

                    parte

                )

        )

    ) {

        return false;

    }

    /*
     * Pronombres que hacen
     * referencia al mismo alumno.
     */

    const referencias = [

        "el",

        "ella",

        "este",

        "esta",

        "ese",

        "esa",

        "el alumno",

        "la alumna",

        "su",

        "sus"

    ];

    if (

        referencias.some(

            palabra =>

                texto === palabra ||

                texto.startsWith(

                    palabra + " "

                )

        )

    ) {

        return false;

    }

    /*
     * Preguntas normales
     * sobre el mismo alumno.
     */

    const preguntas = [

        "que",

        "como",

        "cuales",

        "cual",

        "porque",

        "por que",

        "tiene",

        "hay",

        "analiza",

        "analizar",

        "expediente",

        "citas",

        "notas",

        "riesgo",

        "emociones",

        "progreso",

        "seguimiento",

        "diagnostico",

        "diagnosticos",

        "nee",

        "estrategias",

        "recomendaciones",

        "informe",

        "reporte"

    ];

    if (

        preguntas.some(

            palabra =>

                texto.includes(

                    palabra

                )

        )

    ) {

        return false;

    }

    return true;

}