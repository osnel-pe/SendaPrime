export function generarReporte({

    contexto,

    analisis

}:any){

    return{

        alumno:{

            id:contexto.alumno.id,

            nombre:

            `${

                contexto.alumno.nombre

            } ${

                contexto.alumno.apellido_paterno ?? ""

            }`

        },

        fecha:

        new Date().toISOString(),

        riesgo:

        analisis.riesgo,

        progreso:

        analisis.progreso,

        emociones:

        analisis.emociones,

        patrones:

        analisis.patrones,

        decision:

        analisis.decision,

        recomendaciones:

        analisis.recomendaciones,

        totalNotas:

        contexto.notas.length,

        totalCitas:

        contexto.citas.length

    };

}