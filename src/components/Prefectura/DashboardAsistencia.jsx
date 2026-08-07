import { useEffect, useState } from "react";

import {
    CheckCircle2,
    Clock3,
    CircleX,
    School,
    AlertTriangle,
    TriangleAlert
} from "lucide-react";

import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import { supabase } from "../../services/supabase";

import "../../Styles/DashboardAsistencia.css";

import { obtenerFechaLocal } from "../../utils/fechaLocal";

import ModalAsistencia from "./ModalAsistencia";


export default function DashboardAsistencia({

    students = [],

    setAlumnoSeleccionado,

    cambiarPantalla,

    setModuloPerfil,

    setResumenAsistencia

}) {

    /*==================================================
    DATOS PRINCIPALES
    ==================================================*/

    const [datos, setDatos] = useState({

        presentes: 0,

        tardanzas: 0,

        faltas: 0,

        completos: 0,

        pendientes: 0,

        total: 0,

        gruposPendientes: [],

        incidencias: [],

        reportes: 0

    });


    /*==================================================
    RESUMEN CRÍTICO
    ==================================================*/

    const [resumenCritico, setResumenCritico] = useState({

        asistencia: [],

        reportes: []

    });


    /*==================================================
    REGISTROS DE ASISTENCIA DEL DÍA

    Se utilizan exclusivamente para el modal.

    El modal filtrará:

    - falta
    - tardanza

    Los presentes nunca se muestran.
    ==================================================*/

    const [registrosHoy, setRegistrosHoy] = useState([]);


    /*==================================================
    MODAL
    ==================================================*/

    const [
        mostrarModalAsistencia,
        setMostrarModalAsistencia
    ] = useState(false);


    /*==================================================
    CARGAR DATOS
    ==================================================*/

    useEffect(() => {

        cargar();

    }, [students]);


    async function cargar() {

        const hoy = obtenerFechaLocal();


        /*==================================================
        GRUPOS
        ==================================================*/

        const grupos = [

            ...new Set(

                students.map(
                    alumno => alumno.grupo
                )

            )

        ].sort();


        /*==================================================
        ASISTENCIA DEL DÍA
        ==================================================*/

        const {
            data,
            error
        } = await supabase

            .from("asistencia_prefectura")

            .select("*")

            .eq("fecha", hoy);


        if (error) {

            console.log(
                "Error cargando asistencia:",
                error
            );

            return;

        }


        const registros = data || [];


        /*
        Guardamos los registros del día.

        El modal recibirá estos datos y posteriormente
        solamente utilizará falta y tardanza.
        */

        setRegistrosHoy(registros);


        /*==================================================
        REPORTES DEL DÍA
        ==================================================*/

        const {
            data: reportesHoy
        } = await supabase

            .from("reportes_prefectura")

            .select("id")

            .eq("fecha", hoy);


        /*==================================================
        GRUPOS PENDIENTES
        ==================================================*/

        const gruposPendientes = [];

        const incidencias = [];

        let completos = 0;


        grupos.forEach(grupo => {

            const registrosGrupo =
                registros.filter(
                    registro =>
                        registro.grupo === grupo
                );


            if (registrosGrupo.length === 0) {

                gruposPendientes.push(grupo);

            } else {

                completos++;

            }


            const faltas =
                registrosGrupo.filter(
                    registro =>
                        registro.estatus === "falta"
                ).length;


            const tardanzas =
                registrosGrupo.filter(
                    registro =>
                        registro.estatus === "tardanza"
                ).length;


            if (
                faltas > 0 ||
                tardanzas > 0
            ) {

                incidencias.push({

                    grupo,

                    faltas,

                    tardanzas

                });

            }

        });


        /*==================================================
        ASISTENCIA DEL MES
        ==================================================*/

        const fechaInicio =
            hoy.substring(0, 8) + "01";


        const {
            data: mesAsistencia
        } = await supabase

            .from("asistencia_prefectura")

            .select(
                "alumno_id,estatus"
            )

            .gte(
                "fecha",
                fechaInicio
            )

            .lte(
                "fecha",
                hoy
            );


        /*==================================================
        REPORTES DEL MES
        ==================================================*/

        const {
            data: mesReportes
        } = await supabase

            .from("reportes_prefectura")

            .select("alumno_id")

            .gte(
                "fecha",
                fechaInicio
            )

            .lte(
                "fecha",
                hoy
            );


        /*==================================================
        MAPA DE ASISTENCIA
        ==================================================*/

        const mapaAsistencia = {};


        (mesAsistencia || []).forEach(
            registro => {

                if (
                    !mapaAsistencia[
                        registro.alumno_id
                    ]
                ) {

                    mapaAsistencia[
                        registro.alumno_id
                    ] = {

                        faltas: 0,

                        tardanzas: 0

                    };

                }


                if (
                    registro.estatus === "falta"
                ) {

                    mapaAsistencia[
                        registro.alumno_id
                    ].faltas++;

                }


                if (
                    registro.estatus === "tardanza"
                ) {

                    mapaAsistencia[
                        registro.alumno_id
                    ].tardanzas++;

                }

            }
        );


        /*==================================================
        MAPA DE REPORTES
        ==================================================*/

        const mapaReportes = {};


        (mesReportes || []).forEach(
            reporte => {

                mapaReportes[
                    reporte.alumno_id
                ] =
                    (
                        mapaReportes[
                            reporte.alumno_id
                        ] || 0
                    ) + 1;

            }
        );


        /*==================================================
        ALUMNOS CRÍTICOS DE ASISTENCIA
        ==================================================*/

        const alumnosAsistencia =

            students

                .filter(alumno => {

                    const dato =
                        mapaAsistencia[
                            alumno.id
                        ];


                    if (!dato) {

                        return false;

                    }


                    return (

                        dato.faltas >= 3 ||

                        dato.tardanzas >= 3

                    );

                })

                .map(alumno => ({

                    ...alumno,

                    faltas:
                        mapaAsistencia[
                            alumno.id
                        ]?.faltas || 0,

                    tardanzas:
                        mapaAsistencia[
                            alumno.id
                        ]?.tardanzas || 0

                }));


        /*==================================================
        ALUMNOS CRÍTICOS DE REPORTES
        ==================================================*/

        const alumnosReportes =

            students

                .filter(alumno =>

                    (
                        mapaReportes[
                            alumno.id
                        ] || 0
                    ) >= 2

                )

                .map(alumno => ({

                    ...alumno,

                    reportes:
                        mapaReportes[
                            alumno.id
                        ]

                }));


        setResumenCritico({

            asistencia:
                alumnosAsistencia,

            reportes:
                alumnosReportes

        });


        /*==================================================
        RESUMEN DE ASISTENCIA

        Conservamos esta información porque puede seguir
        siendo utilizada por otras partes de Prefectura.

        IMPORTANTE:
        solamente se guardan faltas y tardanzas.
        ==================================================*/

        const resumen = {};


        registros.forEach(registro => {

            if (

                registro.estatus !== "falta" &&

                registro.estatus !== "tardanza"

            ) {

                return;

            }


            if (
                !resumen[registro.grupo]
            ) {

                resumen[
                    registro.grupo
                ] = [];

            }


            const alumno =
                students.find(
                    estudiante =>
                        estudiante.id ===
                        registro.alumno_id
                );


            if (!alumno) {

                return;

            }


            resumen[
                registro.grupo
            ].push({

                ...alumno,

                estatus:
                    registro.estatus

            });

        });


        if (setResumenAsistencia) {

            setResumenAsistencia(
                resumen
            );

        }


        /*==================================================
        DATOS PRINCIPALES
        ==================================================*/

        setDatos({

            presentes:

                registros.filter(
                    registro =>
                        registro.estatus ===
                        "presente"
                ).length,


            tardanzas:

                registros.filter(
                    registro =>
                        registro.estatus ===
                        "tardanza"
                ).length,


            faltas:

                registros.filter(
                    registro =>
                        registro.estatus ===
                        "falta"
                ).length,


            completos,

            pendientes:
                grupos.length -
                completos,


            total:
                students.length,


            gruposPendientes,

            incidencias,

            reportes:
                reportesHoy?.length || 0

        });

    }


    /*==================================================
    PORCENTAJE
    ==================================================*/

    const porcentaje =

        students.length === 0

            ? 0

            :

            Math.round(

                datos.presentes /

                students.length *

                100

            );


    /*==================================================
    ABRIR MODAL
    ==================================================*/

    function abrirModalAsistencia() {

        setMostrarModalAsistencia(true);

    }


    /*==================================================
    CERRAR MODAL
    ==================================================*/

    function cerrarModalAsistencia() {

        setMostrarModalAsistencia(false);

    }


    /*==================================================
    RETURN
    ==================================================*/

    return (

        <>

            {/*==================================================
            DASHBOARD DE ASISTENCIA
            ==================================================*/}

            <div

                className="dash-card"

                onClick={
                    abrirModalAsistencia
                }

                style={{
                    cursor: "pointer"
                }}

            >

                {/*=========================================
                GRÁFICO
                =========================================*/}

                <div className="dash-grafico">

                    <CircularProgressbar

                        value={
                            porcentaje
                        }

                        text={
                            `${porcentaje}%`
                        }

                        styles={{

                            path: {

                                stroke:
                                    "#4caf50"

                            },

                            trail: {

                                stroke:
                                    "rgba(255,255,255,.18)"

                            },

                            text: {

                                fill: "#fff",

                                fontSize:
                                    "20px",

                                fontWeight:
                                    "700"

                            }

                        }}

                    />

                </div>


                {/*=========================================
                RESUMEN
                =========================================*/}

                <div className="dash-resumen">

                    {/*=====================================
                    PRESENTES

                    Al tocarlo también se abre el modal,
                    pero el modal NO mostrará presentes.
                    =====================================*/}

                    <div
                        className="dash-item presente"

                        onClick={e => {

                            e.stopPropagation();

                            abrirModalAsistencia();

                        }}

                    >

                        <CheckCircle2
                            size={18}
                        />

                        <div>

                            <strong>

                                {
                                    datos.presentes
                                }

                            </strong>

                            <span>
                                Presentes
                            </span>

                        </div>

                    </div>


                    {/*=====================================
                    TARDANZAS
                    =====================================*/}

                    <div

                        className="dash-item tardanza"

                        onClick={e => {

                            e.stopPropagation();

                            abrirModalAsistencia();

                        }}

                    >

                        <Clock3
                            size={18}
                        />

                        <div>

                            <strong>

                                {
                                    datos.tardanzas
                                }

                            </strong>

                            <span>
                                Tardanzas
                            </span>

                        </div>

                    </div>


                    {/*=====================================
                    AUSENCIAS
                    =====================================*/}

                    <div

                        className="dash-item falta"

                        onClick={e => {

                            e.stopPropagation();

                            abrirModalAsistencia();

                        }}

                    >

                        <CircleX
                            size={18}
                        />

                        <div>

                            <strong>

                                {
                                    datos.faltas
                                }

                            </strong>

                            <span>
                                Ausentes
                            </span>

                        </div>

                    </div>

                </div>

            </div>


            {/*==================================================
            CAJAS INFERIORES
            ==================================================*/}

            <div className="dash-cajas">

                {/*=========================================
                GRUPOS
                =========================================*/}

                <div

                    className={

                        datos.pendientes === 0

                            ?

                            "mini-card grupos completo"

                            :

                            "mini-card grupos pendiente"

                    }

                >

                    <School
                        size={18}
                    />

                    <h3>

                        {
                            datos.completos
                        }

                        /

                        {
                            datos.completos +
                            datos.pendientes
                        }

                    </h3>

                    <span>
                        Grupos listos
                    </span>

                </div>


                {/*=========================================
                REPORTES
                =========================================*/}

                <div

                    className={

                        datos.reportes === 0

                            ?

                            "mini-card reportes limpio"

                            :

                            "mini-card reportes alerta"

                    }

                >

                    <AlertTriangle
                        size={18}
                    />

                    <h3>

                        {
                            datos.reportes
                        }

                    </h3>

                    <span>
                        Reportes
                    </span>

                </div>

            </div>


            {/*==================================================
            RESUMEN CRÍTICO
            ==================================================*/}

            <div className="dashboard-panel">

                <h3>
                    Resumen crítico
                </h3>


                {/*=========================================
                ASISTENCIA
                =========================================*/}

                <div className="dashboard-subtitulo">

                    <TriangleAlert
                        size={16}
                    />

                    <span>
                        Tardanzas e inasistencias
                    </span>

                </div>


                {

                    resumenCritico.asistencia.length === 0

                        ?

                        <p className="panel-vacio">

                            No hay alumnos críticos este mes.

                        </p>

                        :

                        resumenCritico.asistencia.map(
                            alumno => (

                                <div

                                    key={
                                        alumno.id
                                    }

                                    className="critico-card"

                                    onClick={() => {

                                        setAlumnoSeleccionado(
                                            alumno
                                        );

                                        setModuloPerfil(
                                            "asistencia"
                                        );

                                        cambiarPantalla(
                                            "perfilAlumnoPrefectura"
                                        );

                                    }}

                                >

                                    <div className="critico-info">

                                        <strong>

                                            {
                                                alumno.nombre
                                            }{" "}

                                            {
                                                alumno.apellido_paterno
                                            }

                                        </strong>

                                        <small>

                                            {
                                                alumno.grupo
                                            }

                                        </small>

                                    </div>


                                    <div className="critico-badges">

                                        {

                                            alumno.faltas > 0 && (

                                                <span className="badge-falta">

                                                    {
                                                        alumno.faltas
                                                    }

                                                    {" "}

                                                    faltas

                                                </span>

                                            )

                                        }


                                        {

                                            alumno.tardanzas > 0 && (

                                                <span className="badge-tardanza">

                                                    {
                                                        alumno.tardanzas
                                                    }

                                                    {" "}

                                                    tardanzas

                                                </span>

                                            )

                                        }

                                    </div>

                                </div>

                            )
                        )

                }


                {/*=========================================
                REPORTES
                =========================================*/}

                <div className="dashboard-subtitulo">

                    <AlertTriangle
                        size={16}
                    />

                    <span>
                        Reportes
                    </span>

                </div>


                {

                    resumenCritico.reportes.length === 0

                        ?

                        <p className="panel-vacio">

                            No hay alumnos críticos este mes.

                        </p>

                        :

                        resumenCritico.reportes.map(
                            alumno => (

                                <div

                                    key={
                                        alumno.id
                                    }

                                    className="critico-card"

                                    onClick={() => {

                                        setAlumnoSeleccionado(
                                            alumno
                                        );

                                        setModuloPerfil(
                                            "reportes"
                                        );

                                        cambiarPantalla(
                                            "perfilAlumnoPrefectura"
                                        );

                                    }}

                                >

                                    <div className="critico-info">

                                        <strong>

                                            {
                                                alumno.nombre
                                            }{" "}

                                            {
                                                alumno.apellido_paterno
                                            }

                                        </strong>

                                        <small>

                                            {
                                                alumno.grupo
                                            }

                                        </small>

                                    </div>


                                    <div className="critico-badges">

                                        <span className="badge-reporte">

                                            {
                                                alumno.reportes
                                            }

                                            {" "}

                                            reportes

                                        </span>

                                    </div>

                                </div>

                            )
                        )

                }

            </div>


            {/*==================================================
            MODAL DE ASISTENCIA
            ==================================================*/}

            {

                mostrarModalAsistencia && (

                    <ModalAsistencia

                        registros={
                            registrosHoy
                        }

                        students={
                            students
                        }

                        cerrar={
                            cerrarModalAsistencia
                        }

                    />

                )

            }

        </>

    );

}