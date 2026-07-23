import type {
    ContextoAlumno,
    Emociones
} from "./types.ts";


export function analizarEmociones(

    contexto: ContextoAlumno

): Emociones {


    const texto =

        JSON.stringify(

            contexto.notas ?? []

        ).toLowerCase();


    const emociones: Emociones = {

        ansiedad: 0,

        tristeza: 0,

        enojo: 0,

        miedo: 0,

        autoestima: 0,

        frustracion: 0,

        alegria: 0

    };


    (

        Object.keys(

            emociones

        ) as Array<keyof Emociones>

    ).forEach(

        (emocion) => {


            const regex =

                new RegExp(

                    String(emocion),

                    "gi"

                );


            emociones[emocion] =

                (

                    texto.match(regex) ?? []

                ).length;

        }

    );


    return emociones;

}