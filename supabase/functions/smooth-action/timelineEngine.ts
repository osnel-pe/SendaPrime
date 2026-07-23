import type {

    ContextoAlumno

} from "./types.ts";


export function construirTimeline(

    contexto: ContextoAlumno

) {


    const eventos: any[] = [];


    contexto.notas.forEach(

        (n) => {


            eventos.push({

                tipo:

                    "nota",

                fecha:

                    n.created_at ?? null,

                titulo:

                    n.titulo ?? "Nota"

            });

        }

    );


    contexto.citas.forEach(

        (c) => {


            eventos.push({

                tipo:

                    "cita",

                fecha:

                    c.fecha ?? null,

                titulo:

                    c.tipo ?? "Cita"

            });

        }

    );


    eventos.sort(

        (a, b) => {


            const fechaA =

                a.fecha

                    ? new Date(

                        a.fecha

                    ).getTime()

                    : 0;


            const fechaB =

                b.fecha

                    ? new Date(

                        b.fecha

                    ).getTime()

                    : 0;


            return fechaA - fechaB;

        }

    );


    return eventos;

}