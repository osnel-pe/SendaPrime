export type IntencionNeuri = {

    resumen: boolean;

    perfil: boolean;

    identidad: boolean;

    notas: boolean;

    rendimiento: boolean;

    progreso: boolean;

    riesgo: boolean;

    emociones: boolean;

    seguimiento: boolean;

    historial: boolean;

    estrategias: boolean;

    recomendaciones: boolean;

    intervenciones: boolean;

    citas: boolean;

    expediente: boolean;

    informe: boolean;

    dashboard: boolean;

    estadisticas: boolean;

};


export function analizarIntencion(

    mensaje: string

): IntencionNeuri {


    const texto =

        mensaje

            .normalize("NFD")

            .replace(

                /[\u0300-\u036f]/g,

                ""

            )

            .toLowerCase();


    return {


        resumen:

            /\b(resumen|panorama|analiza|analizar|informacion general)\b/

                .test(texto),


        perfil:

            /\b(perfil|datos del alumno|informacion del alumno|informacion personal)\b/

                .test(texto),


        identidad:

            /\b(nombre|apellido|sexo|genero|grupo|grado)\b/

                .test(texto),


        notas:

            /\b(nota|notas|observacion|observaciones|registro|registros)\b/

                .test(texto),


        rendimiento:

            /\b(rendimiento|calificacion|calificaciones|desempeno|academico)\b/

                .test(texto),


        progreso:

            /\b(progreso|avance|evolucion|mejoro|empeoro|cambio)\b/

                .test(texto),


        riesgo:

            /\b(riesgo|alerta|peligro|urgente|violencia|bullying|acoso|autolesion|suicidio)\b/

                .test(texto),


        emociones:

            /\b(emocion|emociones|emocional|estado emocional|sentimiento|ansiedad|tristeza|miedo|enojo|frustracion)\b/

                .test(texto),


        seguimiento:

            /\b(seguimiento|continuar|reciente|ultimo|ultima|actualmente)\b/

                .test(texto),


        historial:

            /\b(historial|historico|cronologia|timeline|trayectoria)\b/

                .test(texto),


        estrategias:

            /\b(estrategia|estrategias|plan|planes|apoyar|ayuda|ayudar|intervencion)\b/

                .test(texto),


        recomendaciones:

            /\b(recomendacion|recomendaciones|sugerencia|sugerencias|que hacer)\b/

                .test(texto),


        intervenciones:

            /\b(intervencion|intervenciones|apoyo individual|apoyo psicologico)\b/

                .test(texto),


        citas:

            /\b(cita|citas|sesion|sesiones|entrevista|entrevistas|acuerdos)\b/

                .test(texto),


        expediente:

            /\b(expediente|archivo|documento|pdf|ficha|ficha general)\b/

                .test(texto),


        informe:

            /\b(informe|informes|reporte|reportes)\b/

                .test(texto),


        dashboard:

            /\b(dashboard|panel|resumen general)\b/

                .test(texto),


        estadisticas:

            /\b(estadistica|estadisticas|porcentaje|porcentajes|total de alumnos|cantidad de alumnos)\b/

                .test(texto)

    };

}