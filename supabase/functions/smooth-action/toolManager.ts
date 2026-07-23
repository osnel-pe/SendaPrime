import { analizarIntencion } from "./intentAnalyzer.ts";

export function seleccionarHerramientas(

    mensaje: string

){

    const i = analizarIntencion(mensaje);

    return {

        alumno: true,

        notas:

            i.resumen ||

            i.riesgo ||

            i.estrategias ||

            i.progreso ||

            i.emociones,

        citas:

            i.citas ||

            i.seguimiento,

        expediente:

            i.expediente ||

            i.informe,

        timeline:

            i.historial ||

            i.resumen,

        dashboard:

            i.dashboard

    };

}