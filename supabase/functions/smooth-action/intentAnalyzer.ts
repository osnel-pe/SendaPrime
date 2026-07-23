export function analizarIntencion(

    mensaje:string

){

    const t=mensaje.toLowerCase();

    return{

        resumen:

        /(resumen|perfil|historial)/i.test(t),

        riesgo:

        /(riesgo|urgente|suicidio|violencia|bullying|autoles)/i.test(t),

        estrategias:

        /(estrategias|plan|intervención|apoyo)/i.test(t),

        citas:

        /(cita|entrevista|sesión)/i.test(t),

        seguimiento:

        /(seguimiento|continuar)/i.test(t),

        expediente:

        /(expediente|archivo|pdf)/i.test(t),

        informe:

        /(informe|reporte)/i.test(t),

        dashboard:

        /(estadísticas|dashboard|panel)/i.test(t),

        progreso:

        /(progreso|evolución|avance)/i.test(t),

        emociones:

        /(emociones|estado emocional|sentimientos)/i.test(t),

        historial:

        /(historial|cronología|timeline)/i.test(t)

    };

}