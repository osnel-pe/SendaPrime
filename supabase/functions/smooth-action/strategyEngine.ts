export function generarEstrategias(

    analisis:any

){

    const lista=[];

    if(

        analisis.riesgo.score>=80

    ){

        lista.push({

            prioridad:1,

            accion:

            "Activar protocolo institucional."

        });

    }

    if(

        analisis.emociones.ansiedad>=2

    ){

        lista.push({

            prioridad:2,

            accion:

            "Aplicar técnicas de regulación emocional."

        });

    }

    if(

        analisis.patrones.requiereMonitoreo

    ){

        lista.push({

            prioridad:3,

            accion:

            "Seguimiento semanal."

        });

    }

    lista.push({

        prioridad:4,

        accion:

        "Mantener comunicación con docentes."

    });

    return lista;

}