import type { Alumno } from "./types.ts";

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


export function seleccionarAlumnoPorTexto(

    alumnos: Alumno[],

    texto: string

): Alumno | null {

    const consulta =
        texto
            .trim()
            .toLowerCase();

    if (!consulta) {

        return null;

    }


    /*
     * SELECCIÓN POR NÚMERO
     */

    const numero =
        Number(consulta);


    if (

        Number.isInteger(numero) &&

        numero >= 1 &&

        numero <= alumnos.length

    ) {

        return alumnos[numero - 1];

    }


    /*
     * SELECCIÓN POR NOMBRE
     */

    const encontrados =
        alumnos.filter(

            (alumno) => {

                const nombreCompleto =
                    obtenerNombreCompleto(
                        alumno
                    )
                        .toLowerCase();

                return (

                    nombreCompleto.includes(
                        consulta
                    )

                );

            }

        );


    if (encontrados.length === 1) {

        return encontrados[0];

    }


    return null;

}