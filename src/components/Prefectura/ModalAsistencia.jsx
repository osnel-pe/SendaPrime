import {
    Clock3,
    CircleX,
    X
} from "lucide-react";

import "../../Styles/ModalAsistencia.css";


export default function ModalAsistencia({

    registros = [],

    students = [],

    cerrar

}) {


    /*==================================================
    SOLO INCIDENCIAS

    Eliminamos completamente:

    - presente

    Conservamos:

    - falta
    - tardanza
    ==================================================*/

    const incidencias = registros.filter(
        registro =>

            registro.estatus === "falta" ||

            registro.estatus === "tardanza"

    );


    /*==================================================
    AGREGAR DATOS DEL ALUMNO

    Los registros de asistencia normalmente tienen
    alumno_id, mientras que el nombre está en students.
    ==================================================*/

    const incidenciasConAlumno = incidencias

        .map(registro => {

            const alumno =
                students.find(
                    estudiante =>
                        estudiante.id ===
                        registro.alumno_id
                );


            if (!alumno) {

                return null;

            }


            return {

                ...alumno,

                estatus:
                    registro.estatus,

                fecha:
                    registro.fecha

            };

        })

        .filter(Boolean);


    /*==================================================
    AGRUPAR POR GRUPO
    ==================================================*/

    const grupos = {};


    incidenciasConAlumno.forEach(
        alumno => {

            const grupo =
                alumno.grupo ||
                "Sin grupo";


            if (!grupos[grupo]) {

                grupos[grupo] = [];

            }


            grupos[grupo].push(
                alumno
            );

        }
    );


    const gruposLista =
        Object.entries(grupos);


    /*==================================================
    CONTADORES

    Se calculan nuevamente desde las incidencias
    para que el modal sea completamente independiente.
    ==================================================*/

    const totalFaltas =
        incidenciasConAlumno.filter(
            alumno =>
                alumno.estatus === "falta"
        ).length;


    const totalTardanzas =
        incidenciasConAlumno.filter(
            alumno =>
                alumno.estatus === "tardanza"
        ).length;


    return (

        <div

            className="modal-asistencia-overlay"

            onClick={cerrar}

        >

            <div

                className="modal-asistencia"

                onClick={e =>
                    e.stopPropagation()
                }

            >

                {/*==================================================
                HEADER
                ==================================================*/}

                <div className="modal-asistencia-header">

                    <div>

                        <h2>
                            Incidencias de asistencia
                        </h2>

                        <p>
                            Alumnos que faltaron o llegaron tarde
                        </p>

                    </div>


                    <button

                        type="button"

                        className="modal-asistencia-cerrar"

                        onClick={cerrar}

                    >

                        <X size={20} />

                    </button>

                </div>


                {/*==================================================
                RESUMEN
                ==================================================*/}

                <div className="modal-asistencia-resumen">

                    {/*=========================================
                    TARDANZAS
                    =========================================*/}

                    <div className="modal-resumen-item tardanza">

                        <Clock3
                            size={20}
                        />

                        <div>

                            <strong>
                                {totalTardanzas}
                            </strong>

                            <span>
                                Tardanzas
                            </span>

                        </div>

                    </div>


                    {/*=========================================
                    FALTAS
                    =========================================*/}

                    <div className="modal-resumen-item falta">

                        <CircleX
                            size={20}
                        />

                        <div>

                            <strong>
                                {totalFaltas}
                            </strong>

                            <span>
                                Faltas
                            </span>

                        </div>

                    </div>

                </div>


                {/*==================================================
                LISTA
                ==================================================*/}

                <div className="modal-asistencia-lista">

                    {

                        gruposLista.length === 0

                            ?

                            <div className="modal-asistencia-vacio">

                                <CircleX
                                    size={32}
                                />

                                <p>

                                    No hay faltas ni
                                    tardanzas registradas hoy.

                                </p>

                            </div>

                            :

                            gruposLista.map(
                                ([grupo, alumnos]) => (

                                    <div

                                        key={grupo}

                                        className="modal-grupo"

                                    >

                                        {/*=================================
                                        CABECERA DEL GRUPO
                                        =================================*/}

                                        <div className="modal-grupo-header">

                                            <h3>
                                                Grupo {grupo}
                                            </h3>

                                            <span>

                                                {
                                                    alumnos.length
                                                }

                                                {" "}

                                                {

                                                    alumnos.length === 1

                                                        ?

                                                        "incidencia"

                                                        :

                                                        "incidencias"

                                                }

                                            </span>

                                        </div>


                                        {/*=================================
                                        ALUMNOS
                                        =================================*/}

                                        <div className="modal-alumnos">

                                            {

                                                alumnos.map(
                                                    (alumno, indice) => (

                                                        <div

                                                            key={

                                                                `${alumno.id}-${alumno.estatus}-${indice}`

                                                            }

                                                            className="modal-alumno"

                                                        >

                                                            <div className="modal-alumno-info">

                                                                <strong>

                                                                    {
                                                                        alumno.nombre
                                                                    }{" "}

                                                                    {
                                                                        alumno.apellido_paterno
                                                                    }{" "}

                                                                    {
                                                                        alumno.apellido_materno
                                                                    }

                                                                </strong>

                                                            </div>


                                                            {

                                                                alumno.estatus ===
                                                                "tardanza"

                                                                    ?

                                                                    <span className="modal-badge-tardanza">

                                                                        <Clock3
                                                                            size={14}
                                                                        />

                                                                        Tardanza

                                                                    </span>

                                                                    :

                                                                    <span className="modal-badge-falta">

                                                                        <CircleX
                                                                            size={14}
                                                                        />

                                                                        Falta

                                                                    </span>

                                                            }

                                                        </div>

                                                    )

                                                )

                                            }

                                        </div>

                                    </div>

                                )

                            )

                    }

                </div>


                {/*==================================================
                FOOTER
                ==================================================*/}

                <div className="modal-asistencia-footer">

                    <button

                        type="button"

                        className="modal-asistencia-btn"

                        onClick={cerrar}

                    >

                        Cerrar

                    </button>

                </div>

            </div>

        </div>

    );

}