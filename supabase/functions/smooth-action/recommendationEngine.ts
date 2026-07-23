export function generarRecomendaciones(

    analisis:any

){

    const lista=[];

    if(

        analisis.riesgo.nivel==="ALTO"

    ){

        lista.push(

            "Activar protocolo institucional."

        );

    }

    if(

        analisis.emociones.ansiedad>2

    ){

        lista.push(

            "Trabajar técnicas de regulación emocional."

        );

    }

    if(

        analisis.patrones.requiereMonitoreo

    ){

        lista.push(

            "Programar seguimiento semanal."

        );

    }

    if(lista.length===0){

        lista.push(

            "Continuar observación periódica."

        );

    }

    return lista;

}