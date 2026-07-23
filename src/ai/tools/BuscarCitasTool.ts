import { supabase } from "../supabaseClient.ts";

export async function buscarCitas(nombreAlumno: string) {

    // ===============================
    // Buscar alumno
    // ===============================

    const { data: alumno, error: errorAlumno } = await supabase
        .from("alumnos")
        .select("id,nombre")
        .ilike("nombre", `%${nombreAlumno}%`)
        .limit(1)
        .single();

    if (errorAlumno || !alumno) {

        return {
            encontrado: false,
            mensaje: "No encontré ese alumno."
        };

    }

    // ===============================
    // Buscar citas
    // ===============================

    const { data: citas, error } = await supabase
        .from("citas_programadas")
        .select(`
            fecha,
            hora,
            tipo,
            motivo,
            observaciones,
            estado,
            cumplida
        `)
        .eq("alumno_id", alumno.id)
        .order("fecha", { ascending: false });

    if (error) {

        return {
            encontrado: false,
            mensaje: "Error consultando citas."
        };

    }

    return {

        encontrado: true,

        alumno: alumno.nombre,

        total: citas.length,

        citas

    };

}