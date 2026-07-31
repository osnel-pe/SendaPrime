import {

    analizarIntencion

} from "./intentAnalyzer.ts";


export function seleccionarHerramientas(

    mensaje: string

) {


    const i =

        analizarIntencion(

            mensaje

        );


    return {


        alumno: true,


        notas:

            i.notas ||

            i.resumen ||

            i.perfil ||

            i.rendimiento ||

            i.progreso ||

            i.estrategias ||

            i.recomendaciones,


        citas:

            i.citas ||

            i.seguimiento ||

            i.historial ||

            i.resumen,


        expediente:

            i.expediente ||

            i.informe,


        timeline:

            i.historial ||

            i.seguimiento ||

            i.progreso ||

            i.resumen,


        dashboard:

            i.dashboard ||

            i.estadisticas,


        analisis:

            i.riesgo ||

            i.emociones ||

            i.progreso ||

            i.estrategias ||

            i.recomendaciones ||

            i.intervenciones ||

            i.resumen

    };

}