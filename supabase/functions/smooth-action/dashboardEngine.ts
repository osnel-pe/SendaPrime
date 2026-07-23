export function generarDashboard(

    contexto:any,

    analisis:any

){

    return{

        alumno:

        contexto.alumno.nombre,

        score:

        analisis.riesgo.score,

        riesgo:

        analisis.riesgo.nivel,

        sesiones:

        contexto.notas.length,

        citas:

        contexto.citas.length,

        emociones:

        analisis.emociones

    };

}