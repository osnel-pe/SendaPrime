import DashboardAsistencia from "../components/Prefectura/DashboardAsistencia";

import "../Styles/InicioPrefectura.css";

export default function InicioPrefectura({

    students=[],
    setAlumnoSeleccionado,
    cambiarPantalla,
    setModuloPerfil,
    setResumenAsistencia

}){

    return(

        <div className="inicio-prefectura">

            <div className="inicio-header">

                <h2>

                    Asistencia

                </h2>

                <p>

                    Resumen del día

                </p>

            </div>

            <DashboardAsistencia
                students={students}
                setAlumnoSeleccionado={setAlumnoSeleccionado}
                cambiarPantalla={cambiarPantalla}
                setModuloPerfil={setModuloPerfil}
                setResumenAsistencia={setResumenAsistencia}
                modo="direccion"
            />

        </div>

    );

}