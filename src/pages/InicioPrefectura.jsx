import { useState } from "react";
import { CalendarDays } from "lucide-react";

import DashboardAsistencia from "../components/Prefectura/DashboardAsistencia";
import HorarioGrupoModal from "../components/Prefectura/HorarioGrupoModal";

import "../Styles/InicioPrefectura.css";

export default function InicioPrefectura({

    students = [],
    setAlumnoSeleccionado,
    cambiarPantalla,
    setModuloPerfil,
    setResumenAsistencia

}) {

    const [
        mostrarHorario,
        setMostrarHorario
    ] = useState(false);

    return (

        <div className="inicio-prefectura">

            <div className="inicio-header">

                <div className="inicio-header-texto">

                    <h2>
                        Asistencia
                    </h2>

                    <p>
                        Resumen del día
                    </p>

                </div>

                <button

                    type="button"

                    className="inicio-horario-btn"

                    onClick={() =>
                        setMostrarHorario(true)
                    }

                    aria-label="Ver horario de grupos"

                    title="Ver horario"

                >

                    <CalendarDays
                        size={21}
                    />

                </button>

            </div>

            <DashboardAsistencia

                students={students}

                cambiarPantalla={cambiarPantalla}

                setAlumnoSeleccionado={setAlumnoSeleccionado}

                setModuloPerfil={setModuloPerfil}

                setResumenAsistencia={setResumenAsistencia}

            />

            {
                mostrarHorario
                &&
                <HorarioGrupoModal

                    cerrar={() =>
                        setMostrarHorario(false)
                    }

                />
            }

        </div>

    );

}
