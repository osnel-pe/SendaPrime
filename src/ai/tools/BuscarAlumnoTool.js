import { supabase } from "../../services/supabase";

export async function buscarAlumno({
    alumnoId = null,
    nombre = null
} = {}) {

    try {

        let consulta = supabase
            .from("alumnos")
            .select("*")
            .limit(10);

        if (alumnoId) {

            consulta = consulta.eq(
                "id",
                alumnoId
            );

        }

        if (nombre) {

            consulta = consulta.ilike(
                "nombre",
                `%${nombre}%`
            );

        }

        const {

            data,
            error

        } = await consulta;

        if (error) {

            console.error(
                "Error buscando alumno:",
                error
            );

            throw new Error(
                "No se pudo consultar la información del alumno."
            );

        }

        return data || [];

    }

    catch (error) {

        console.error(
            "buscarAlumno:",
            error
        );

        return [];

    }

}