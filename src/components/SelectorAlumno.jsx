import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

export default function SelectorAlumno({

    alumnoSeleccionado,

    setAlumnoSeleccionado

}) {

    const [alumnos, setAlumnos] =
        useState([]);

    const [cargando, setCargando] =
        useState(true);

    const [error, setError] =
        useState(null);

    useEffect(() => {

        cargarAlumnos();

    }, []);

    async function cargarAlumnos() {

        try {

            setCargando(true);

            setError(null);

            const {

                data,

                error

            } = await supabase

                .from("alumnos")

                .select("*")

                .order(
                    "nombre",
                    {
                        ascending: true
                    }
                );

            if (error) {

                throw error;

            }

            setAlumnos(data || []);

        }

        catch (error) {

            console.error(
                "Error cargando alumnos:",
                error
            );

            setError(
                "No se pudieron cargar los alumnos."
            );

        }

        finally {

            setCargando(false);

        }

    }

    if (cargando) {

        return (

            <div className="selector-alumno">

                Cargando alumnos...

            </div>

        );

    }

    if (error) {

        return (

            <div className="selector-alumno">

                {error}

            </div>

        );

    }

    return (

        <div className="selector-alumno">

            <select

                value={

                    alumnoSeleccionado?.id || ""

                }

                onChange={(e) => {

                    const id =
                        Number(e.target.value);

                    const alumno =
                        alumnos.find(

                            alumno =>
                                alumno.id === id

                        );

                    setAlumnoSeleccionado(
                        alumno || null
                    );

                }}

            >

                <option value="">

                    Selecciona un alumno

                </option>

                {

                    alumnos.map((alumno) => (

                        <option

                            key={alumno.id}

                            value={alumno.id}

                        >

                            {alumno.nombre}

                        </option>

                    ))

                }

            </select>

        </div>

    );

}