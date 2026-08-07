import { useState, useEffect } from "react";

import {
    ArrowLeft,
    UserRound,
    FolderOpen,
    FileText,
    ClipboardCheck,
    ClipboardList,
    FileWarning,
    Brain,
    Eye,
    Clock3,
    CircleX
} from "lucide-react";

import "../Styles/AppLayout.css";
import "../Styles/Psicologia.css";
import "../Styles/PerfilAlumnoPsico.css";
import "../Styles/Reportes.css";

import fondoPsicologia from "../assets/fondo-psicologia.jpg";

import TarjetaAsistenciaAlumno from "../components/Prefectura/TarjetaAsistenciaAlumno";
import VistaDetalleReporte from "../components/Prefectura/VistaDetalleReporte";

import VistaDetalleNota from "../components/Psicologia/VistaDetalleNota";

import { supabase } from "../services/supabase";


export default function PerfilAlumnoDireccion({

    alumno,

    students,

    setStudents,

    setAlumnoSeleccionado,

    cambiarPantalla,

    volver,

    embebido = false,

    citaActiva,

    setCitaActiva,

    moduloInicial = "archivos"

}) {

    /*==================================================
    ALUMNO
    ==================================================*/

    const [datosAlumno, setDatosAlumno] = useState(alumno);


    /*==================================================
    ÁREA ACTIVA

    Dirección puede consultar:

    - Psicología
    - Prefectura
    ==================================================*/

    const [area, setArea] = useState("psicologia");


    /*==================================================
    MÓDULO ACTIVO

    Los módulos dependen del área seleccionada.
    ==================================================*/

    const [modulo, setModulo] = useState(
        moduloInicial || "archivos"
    );

    /*==================================================
    ARCHIVOS
    ==================================================*/

    const [archivos, setArchivos] = useState([]);
    const [nees, setNees] = useState([]);
    const [notas, setNotas] = useState([]);

    const [seguimientos, setSeguimientos] = useState([]);
    const [historial, setHistorial] = useState([]);

    const [neeVista, setNeeVista] = useState(null);
    const [notaVista, setNotaVista] = useState(null);
    const [seguimientoVista, setSeguimientoVista] = useState(null);

    const [archivosPrefectura, setArchivosPrefectura] = useState([]);

    const [asistencias, setAsistencias] = useState([]);
    const [mesAsistencia, setMesAsistencia] = useState(
        new Date().getMonth() + 1
    );

    const [reportes, setReportes] = useState([]);
    const [notasPrefectura, setNotasPrefectura] = useState([]);

    const [archivoPrefecturaVista, setArchivoPrefecturaVista] =
        useState(null);

    const [asistenciaVista, setAsistenciaVista] =
        useState(false);

    const [reporteVista, setReporteVista] =
        useState(null);

    const [notaPrefecturaVista, setNotaPrefecturaVista] =
        useState(null);

  /*==================================================
    EFECTOS
    ==================================================*/

    useEffect(() => {

        if (!alumno) return;

        setDatosAlumno(alumno);

    }, [alumno]);


    /*
    Cuando cambia el alumno o el módulo inicial
    volvemos a Psicología y al módulo solicitado.
    */

    useEffect(() => {

        if (!alumno) return;

        setArea("psicologia");

        setModulo(
            moduloInicial || "archivos"
        );

    }, [alumno, moduloInicial]);

    /*==================================================
    CARGAR ARCHIVOS
    ==================================================*/

    useEffect(() => {

        if (!datosAlumno) return;

        cargarArchivos();
        cargarNEE();
        cargarNotas();
        cargarSeguimientos();
        cargarHistorial();

        cargarArchivosPrefectura();
        cargarAsistenciaPrefectura();
        cargarReportesPrefectura();
        cargarNotasPrefectura();

    }, [datosAlumno]);

    useEffect(() => {

        if (!datosAlumno) return;

        cargarAsistenciaPrefectura();

    }, [datosAlumno, mesAsistencia]);

    function cargarNEE() {

        setNees(
            datosAlumno?.nee || []
        );

    }

    async function cargarArchivosPrefectura() {

        if (!datosAlumno) return;

        const carpeta =
            `${datosAlumno.grupo}/${datosAlumno.id}`;

        const {
            data,
            error
        } = await supabase.storage
            .from("archivos-prefectura")
            .list(carpeta);

        if (error) {

            console.log(
                "Error cargando archivos de Prefectura:",
                error
            );

            return;
        }

        setArchivosPrefectura(data || []);

    }

async function abrirArchivoPrefectura(nombre) {

    const ruta =
        `${datosAlumno.grupo}/${datosAlumno.id}/${nombre}`;

    const {
        data,
        error
    } = await supabase.storage
        .from("archivos-prefectura")
        .createSignedUrl(
            ruta,
            300
        );

    if (error) {

        alert(error.message);

        return;
    }

    window.open(
        data.signedUrl,
        "_blank"
    );

}

async function cargarAsistenciaPrefectura() {

    if (!datosAlumno) return;

    const añoActual =
        new Date().getFullYear();

    const inicio =
        new Date(
            añoActual,
            mesAsistencia - 1,
            1
        )
        .toISOString()
        .slice(0, 10);

    const fin =
        new Date(
            añoActual,
            mesAsistencia,
            0
        )
        .toISOString()
        .slice(0, 10);

    const {
        data,
        error
    } = await supabase
        .from("asistencia_prefectura")
        .select("fecha, estatus")
        .eq(
            "alumno_id",
            datosAlumno.id
        )
        .gte("fecha", inicio)
        .lte("fecha", fin);

    if (error) {

        console.log(
            "Error cargando asistencia:",
            error
        );

        return;
    }

    setAsistencias(data || []);

}

const incidenciasAsistencia =
    asistencias.filter(
        asistencia =>
            asistencia.estatus === "tardanza" ||
            asistencia.estatus === "falta"
    );

const tardanzas =
    asistencias.filter(
        asistencia =>
            asistencia.estatus === "tardanza"
    ).length;

const faltas =
    asistencias.filter(
        asistencia =>
            asistencia.estatus === "falta"
    ).length;

async function cargarNotasPrefectura() {

    if (!datosAlumno) return;

    const {
        data,
        error
    } = await supabase
        .from("notas_prefectura")
        .select("*")
        .eq(
            "alumno_id",
            datosAlumno.id
        )
        .order("fijada", {
            ascending: false
        })
        .order("created_at", {
            ascending: false
        });

    if (error) {

        console.log(
            "Error cargando notas de Prefectura:",
            error
        );

        return;
    }

    setNotasPrefectura(data || []);

}

async function cargarNotas() {

    if (!datosAlumno) return;

    const { data, error } = await supabase
        .from("notas_psicologia")
        .select("*")
        .eq("alumno_id", datosAlumno.id)
        .order("fijada", {
            ascending: false
        })
        .order("created_at", {
            ascending: false
        });

    if (error) {

        console.log(
            "Error cargando notas de Psicología:",
            error
        );

        return;

    }

    setNotas(data || []);

}

async function cargarHistorial() {

    if (!datosAlumno) return;

    const { data, error } = await supabase
        .from("historial_psicologia")
        .select("*")
        .eq("alumno_id", datosAlumno.id)
        .order("fecha", {
            ascending: false
        })
        .order("hora", {
            ascending: false
        });

    if (error) {

        console.log(
            "Error cargando historial de Psicología:",
            error
        );

        return;

    }

    console.log(
        "HISTORIAL PSICOLOGÍA:",
        data
    );

    setHistorial(data || []);

}

async function cargarSeguimientos() {

    if (!datosAlumno?.id) return;

    console.log(
        "Cargando seguimientos del alumno:",
        datosAlumno.id
    );

    const { data, error } = await supabase
        .from("historial_psicologia")
        .select("*")
        .eq("alumno_id", datosAlumno.id)
        .order("fecha", {
            ascending: true
        })
        .order("hora", {
            ascending: true
        });

    if (error) {

        console.log(
            "ERROR cargando seguimientos:",
            error
        );

        return;

    }

    console.log(
        "SEGUIMIENTOS ENCONTRADOS:",
        data
    );

    setSeguimientos(data || []);

}

    async function cargarArchivos() {

        if (!datosAlumno) return;

        const carpeta =
            `${datosAlumno.grupo}/${datosAlumno.id}`;


        const {
            data,
            error
        } = await supabase.storage

            .from("expedientes")

            .list(carpeta);


        if (error) {

            console.log(
                "Error cargando archivos de Psicología:",
                error
            );

            return;

        }


        /*
        FichaGeneral.pdf también pertenece
        al expediente de Psicología.

        Por eso NO lo eliminamos de la lista.
        */

        setArchivos(data || []);

    }

    /*==================================================
    ARCHIVOS
    ==================================================*/


    async function abrirArchivo(nombre) {

        const ruta =
            `${datosAlumno.grupo}/${datosAlumno.id}/${nombre}`;


        const {
            data,
            error
        } = await supabase.storage

            .from("expedientes")

            .createSignedUrl(
                ruta,
                300
            );


        if (error) {

            alert(
                error.message
            );

            return;

        }


        window.open(
            data.signedUrl,
            "_blank"
        );

    }

    /*==================================================
    CAMBIO DE ÁREA
    ==================================================*/

    function cambiarArea(nuevaArea) {

        setArea(nuevaArea);

        /*
        Cada área empieza en Archivos.
        Posteriormente podremos recordar el último
        módulo utilizado si queremos.
        */

        setModulo("archivos");

    }

    async function cargarAsistencias() {

    if (!datosAlumno?.id) return;

    const { data, error } = await supabase
        .from("asistencias")
        .select("*")
        .eq("alumno_id", datosAlumno.id)
        .order("fecha", {
            ascending: false
        });

    if (error) {

        console.log(
            "Error cargando asistencias de Prefectura:",
            error
        );

        return;

    }

    setAsistencias(data || []);

}

async function cargarReportes() {

    if (!datosAlumno?.id) return;

    const { data, error } = await supabase
        .from("reportes_prefectura")
        .select("*")
        .eq("alumno_id", datosAlumno.id)
        .order("created_at", {
            ascending: false
        });

    if (error) {

        console.log(
            "Error cargando reportes de Prefectura:",
            error
        );

        return;

    }

    setReportes(data || []);

}

async function cargarReportesPrefectura() {

    if (!datosAlumno) return;

    const {
        data,
        error
    } = await supabase
        .from("reportes_prefectura")
        .select("*")
        .eq(
            "alumno_id",
            datosAlumno.id
        )
        .order("fecha", {
            ascending: false
        })
        .order("created_at", {
            ascending: false
        });

    if (error) {

        console.log(
            "Error cargando reportes de Prefectura:",
            error
        );

        return;
    }

    setReportes(data || []);

}

    /*==================================================
    CONFIGURACIÓN DE MÓDULOS
    ==================================================*/

    const modulosPsicologia = [

        {
            id: "archivos",
            titulo: "Archivos",
            icono: FolderOpen
        },

        {
            id: "nee",
            titulo: "NEE",
            icono: Brain
        },

        {
            id: "notas",
            titulo: "Notas",
            icono: FileText
        },

        {
            id: "seguimiento",
            titulo: "Seguimiento",
            icono: ClipboardList
        }

    ];


    const modulosPrefectura = [

        {
            id: "archivos",
            titulo: "Archivos",
            icono: FolderOpen
        },

        {
            id: "asistencia",
            titulo: "Asistencia",
            icono: ClipboardCheck
        },

        {
            id: "reportes",
            titulo: "Reportes",
            icono: FileWarning
        },

        {
            id: "notas",
            titulo: "Notas",
            icono: FileText
        }

    ];


    /*
    Determinamos qué módulos mostrar dependiendo
    del área seleccionada.
    */

    const modulosActuales =
        area === "psicologia"
            ? modulosPsicologia
            : modulosPrefectura;


    /*
    Buscamos la información del módulo actual.
    */

    const moduloActual =
        modulosActuales.find(
            item => item.id === modulo
        );


    /*==================================================
    CAMBIO DE MÓDULO
    ==================================================*/

    function cambiarModulo(id) {

        setModulo(id);

    }

    function colorReporte(tipo) {

    const t = (tipo || "")
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

    switch (t) {

        case "aviso":
            return "reporte-aviso";

        case "aviso de conducta":
            return "reporte-aviso-conducta";

        case "nota de conducta":
            return "reporte-nota-conducta";

        case "reporte de conducta":
            return "reporte-reporte-conducta";

        case "suspension":
            return "reporte-suspension";

        default:
            return "reporte-aviso";
    }

}


    /*==================================================
    CONTENIDO PRINCIPAL
    ==================================================*/

    const contenido = (

        <div className="perfil-wrapper">


            {/*=========================================
            HEADER
            =========================================*/}

            <div className="perfil-header">

                <button
                    className="back-btn"
                    onClick={() => {

                        if (volver) {
                            volver();
                        } else {
                            cambiarPantalla("grupoDireccion");
                        }

                    }}
                >
                    <ArrowLeft size={20} />
                </button>


                <div className="perfil-header-title">

                    <h2>
                        Perfil
                    </h2>

                </div>

            </div>


            {/*=========================================
            SCROLL
            =========================================*/}

            <div className="perfil-scroll">


                {/*=========================================
                TARJETA DEL ALUMNO
                =========================================*/}

                <div className="pa-card-alumno">


                    <div className="pa-avatar">

                        <UserRound size={34} />

                    </div>


                    <div className="pa-card-info">

                        <h2>

                            {datosAlumno?.nombre}{" "}

                            {datosAlumno?.apellido_paterno}{" "}

                            {datosAlumno?.apellido_materno}

                        </h2>


                        <div className="pa-card-extra">

                            <span>

                                {datosAlumno?.grupo}

                            </span>


                            <div className="pa-separador" />


                            <span>

                                {
                                    datosAlumno?.sexo === "M"
                                        ? "Masculino"
                                        : "Femenino"
                                }

                            </span>

                        </div>

                    </div>

                </div>


                {/*=========================================
                SELECTOR DE ÁREA

                Psicología / Prefectura
                =========================================*/}

                <div className="direccion-selector">


                    <button
                        type="button"

                        className={

                            area === "psicologia"

                                ? "direccion-tab activa"

                                : "direccion-tab"

                        }

                        onClick={() =>
                            cambiarArea("psicologia")
                        }
                    >

                        Psicología

                    </button>


                    <button
                        type="button"

                        className={

                            area === "prefectura"

                                ? "direccion-tab activa"

                                : "direccion-tab"

                        }

                        onClick={() =>
                            cambiarArea("prefectura")
                        }
                    >

                        Prefectura

                    </button>


                </div>


                {/*=========================================
                TOOLBAR DE MÓDULOS
                =========================================*/}

                <div className="pa-toolbar">


                    {

                        modulosActuales.map((item) => {

                            const Icono = item.icono;


                            return (

                                <button

                                    key={item.id}

                                    type="button"

                                    className={

                                        modulo === item.id

                                            ? "pa-tool activo"

                                            : "pa-tool"

                                    }

                                    onClick={() =>
                                        cambiarModulo(item.id)
                                    }

                                    title={item.titulo}

                                >

                                    <Icono size={22} />

                                </button>

                            );

                        })

                    }


                </div>


                {/*=========================================
                CABECERA DEL MÓDULO
                =========================================*/}

                <div className="pa-module">


                    <div>

                        <h3>

                            {
                                moduloActual?.titulo
                                    || "Archivos"
                            }

                        </h3>

                    </div>

                </div>


                {/*=========================================
                CUERPO DEL MÓDULO

                PARTE 1:
                solamente dejamos el contenedor.

                En las siguientes partes agregaremos:

                Psicología:
                - Archivos
                - NEE
                - Notas
                - Seguimiento

                Prefectura:
                - Archivos
                - Asistencia
                - Reportes
                - Notas
                =========================================*/}

                <div className="pa-module-body">


                    {/*==================================================
                    PSICOLOGÍA
                    ==================================================*/}

                    {
                        area === "psicologia"
                        &&
                        modulo === "archivos"
                        &&

                        <>

                            {

                                archivos.length === 0

                                    ?

                                    <div className="pa-empty">

                                        No existen documentos.

                                    </div>

                                    :

                                    archivos.map(
                                        (archivo) => (

                                            <div

                                                key={archivo.name}

                                                className="pa-card"

                                            >

                                                <div className="pa-card-left">


                                                    <div className="pa-card-icon">

                                                        <FileText
                                                            size={20}
                                                        />

                                                    </div>


                                                    <div className="pa-card-text">

                                                        <h4>

                                                            {
                                                                archivo.name
                                                            }

                                                        </h4>

                                                    </div>


                                                </div>


                                                <div className="pa-card-actions">

                                                    <button
                                                        className="pa-circle-btn"
                                                        onClick={() => abrirArchivo(archivo.name)}
                                                        title="Visualizar archivo"
                                                    >
                                                        <Eye size={16} />
                                                    </button>

                                                </div>


                                            </div>

                                        )
                                    )

                            }

                        </>

                    }


                    {/*==================================================
                    RESTO DE MÓDULOS

                    Se irán incorporando en las siguientes partes.
                    ==================================================*/}

                    {/*==================================================
                        NEE
                        ==================================================*/}

                        {
                            area === "psicologia"
                            &&
                            modulo === "nee"
                            &&

                            <>

                                {
                                    nees.length === 0

                                        ?

                                        <div className="pa-empty">

                                            No existen registros de NEE.

                                        </div>

                                        :

                                        nees.map((nee, indice) => (

                                            <div
                                                key={indice}
                                                className="pa-card"
                                                onClick={() => setNeeVista(nee)}
                                                style={{ cursor: "pointer" }}
                                            >

                                                <div className="pa-card-left">

                                                    <div className="pa-card-icon">

                                                        <Brain size={20}/>

                                                    </div>

                                                    <div className="pa-card-text">

                                                        <h4>
                                                            {nee.diagnostico || "Sin diagnóstico"}
                                                        </h4>

                                                        {
                                                            nee.fecha && (

                                                                <small>
                                                                    Fecha: {nee.fecha}
                                                                </small>

                                                            )
                                                        }

                                                        {
                                                            nee.observaciones && (

                                                                <p>
                                                                    {nee.observaciones}
                                                                </p>

                                                            )
                                                        }

                                                    </div>

                                                </div>

                                            </div>

                                        ))

                                }

                            </>

                        }

                        {/*==================================================
                        NOTAS
                        ==================================================*/}

                        {
                            area === "psicologia"
                            &&
                            modulo === "notas"
                            &&

                            <>

                                {
                                    notas.length === 0

                                        ?

                                        <div className="pa-empty">

                                            No existen notas registradas.

                                        </div>

                                        :

                                        notas.map((nota) => (

                                            <div
                                                key={nota.id}
                                                className={`pa-card pa-note ${nota.color || "verde"}`}
                                                onClick={() => setNotaVista(nota)}
                                                style={{ cursor: "pointer" }}
                                            >

                                                <div className="pa-card-left">

                                                    <div className="pa-card-icon">

                                                        <FileText size={20}/>

                                                    </div>

                                                    <div className="pa-card-text">

                                                        <h4>
                                                            {nota.titulo}
                                                        </h4>

                                                        <p>
                                                            {nota.nota}
                                                        </p>

                                                        {
                                                            nota.created_at && (

                                                                <small>

                                                                    {
                                                                        new Date(
                                                                            nota.created_at
                                                                        ).toLocaleDateString()
                                                                    }

                                                                </small>

                                                            )
                                                        }

                                                    </div>

                                                </div>

                                            </div>

                                        ))

                                }

                            </>

                        }

                        {/*==================================================
                            SEGUIMIENTO
                        ==================================================*/}

                        {
                            area === "psicologia"
                            &&
                            modulo === "seguimiento"
                            &&

                            <>

                                {
                                    seguimientos.length === 0

                                        ?

                                        <div className="pa-empty">

                                            No existen seguimientos registrados.

                                        </div>

                                        :

                                        seguimientos.map((seguimiento) => (

                                            <div
                                                key={seguimiento.id}
                                                className="pa-card"
                                                onClick={() =>
                                                    setSeguimientoVista(seguimiento)
                                                }
                                                style={{
                                                    cursor: "pointer"
                                                }}
                                            >

                                                <div className="pa-card-left">

                                                    <div className="pa-card-icon">

                                                        <ClipboardList
                                                            size={20}
                                                        />

                                                    </div>

                                                    <div className="pa-card-text">

                                                        <h4>

                                                            {
                                                                seguimiento.titulo
                                                                ||
                                                                seguimiento.motivo
                                                                ||
                                                                "Seguimiento"
                                                            }

                                                        </h4>

                                                        {
                                                            seguimiento.fecha && (

                                                                <small>

                                                                    {seguimiento.fecha}

                                                                    {
                                                                        seguimiento.hora &&
                                                                        ` · ${seguimiento.hora}`
                                                                    }

                                                                </small>

                                                            )
                                                        }

                                                    </div>

                                                </div>

                                            </div>

                                        ))

                                }

                            </>

                        }


                    {/*==================================================
                    PREFECTURA
                    ==================================================*/}

                    {
    area === "prefectura"
    &&
    modulo === "archivos"
    &&

    <>
        {
            archivosPrefectura.length === 0

                ?

                <div className="pa-empty">
                    No existen documentos.
                </div>

                :

                archivosPrefectura.map((archivo) => (

                    <div
                        key={archivo.name}
                        className="pa-card"
                    >

                        <div className="pa-card-left">

                            <div className="pa-card-icon">
                                <FileText size={20} />
                            </div>

                            <div className="pa-card-text">

                                <h4>
                                    {archivo.name}
                                </h4>

                            </div>

                        </div>

                        <div className="pa-card-actions">

                            <button
                                className="pa-circle-btn"
                                onClick={() =>
                                    abrirArchivoPrefectura(
                                        archivo.name
                                    )
                                }
                                title="Visualizar archivo"
                            >
                                <Eye size={16} />
                            </button>

                        </div>

                    </div>

                ))
        }
    </>
}

{
    area === "prefectura"
    &&
    modulo === "asistencia"
    &&

    <div className="card-asistencia">

        <div className="cabecera-asistencia">

            <h3>
                Resumen
            </h3>

            <select
                value={mesAsistencia}
                onChange={(e) =>
                    setMesAsistencia(
                        Number(e.target.value)
                    )
                }
            >

                {
                    [
                        "Enero",
                        "Febrero",
                        "Marzo",
                        "Abril",
                        "Mayo",
                        "Junio",
                        "Julio",
                        "Agosto",
                        "Septiembre",
                        "Octubre",
                        "Noviembre",
                        "Diciembre"
                    ].map((nombre, index) => (

                        <option
                            key={index}
                            value={index + 1}
                        >
                            {nombre}
                        </option>

                    ))
                }

            </select>

        </div>

        <div className="fila-asistencia">

            <Clock3 />

            <span>
                Tardanzas
            </span>

            <strong>
                {
                    asistencias.filter(
                        a =>
                            a.estatus === "tardanza"
                    ).length
                }
            </strong>

        </div>

        <div className="fila-asistencia">

            <CircleX />

            <span>
                Inasistencias
            </span>

            <strong>
                {
                    asistencias.filter(
                        a =>
                            a.estatus === "falta"
                    ).length
                }
            </strong>

        </div>

        <button
            className="ta-detalle-btn"
            onClick={() =>
                setAsistenciaVista(true)
            }
        >
            Detalles
        </button>

    </div>
}

{
    area === "prefectura"
    &&
    modulo === "reportes"
    &&

    <>

        {
            reportes.length === 0

                ?

                <div className="pa-empty">
                    No existen reportes.
                </div>

                :

                reportes.map((reporte) => (

                    <div
                        key={reporte.id}
                        className={`pa-card reporte-card ${colorReporte(
                            reporte.tipo
                        )}`}
                        onClick={() =>
                            setReporteVista(reporte)
                        }
                        style={{
                            cursor: "pointer"
                        }}
                    >

                        <div className="pa-card-left">

                            <div className="pa-card-icon reporte-icon">

                                <FileWarning size={20} />

                            </div>

                            <div className="pa-card-text">

                                <h4>
                                    {reporte.tipo}
                                </h4>

                                <p>
                                    {reporte.motivo}
                                </p>

                                <small>
                                    {reporte.fecha}
                                </small>

                            </div>

                        </div>

                    </div>

                ))
        }

    </>
}

{
    area === "prefectura"
    &&
    modulo === "notas"
    &&

    <>

        {
            notasPrefectura.length === 0

                ?

                <div className="pa-empty">
                    No existen notas registradas.
                </div>

                :

                notasPrefectura.map((nota) => (

                    <div
                        key={nota.id}
                        className={`pa-card pa-note ${
                            nota.color || "verde"
                        }`}
                        onClick={() =>
                            setNotaPrefecturaVista(nota)
                        }
                        style={{
                            cursor: "pointer"
                        }}
                    >

                        <div className="pa-card-left">

                            <div className="pa-card-icon">

                                <FileText size={20} />

                            </div>

                            <div className="pa-card-text">

                                <h4>
                                    {nota.titulo || "Nota"}
                                </h4>

                                <p>
                                    {nota.nota}
                                </p>

                                {
                                    nota.created_at && (

                                        <small>

                                            {
                                                new Date(
                                                    nota.created_at
                                                ).toLocaleDateString()
                                            }

                                        </small>

                                    )
                                }

                            </div>

                        </div>

                    </div>

                ))
        }

    </>
}

                </div>


            </div>

        </div>

    );

    /*==================================================
    RETURN
    ==================================================*/

    return (

        <>

            {

                !embebido && (

                    <div

                        className="app-background"

                        style={{

                            backgroundImage:
                                `url(${fondoPsicologia})`

                        }}

                    />

                )

            }


            {

                embebido

                    ?

                    contenido

                    :

                    (

                        <div className="ps-app">

                            <div className="ps-container">

                                {contenido}

                            </div>

                        </div>

                    )

            }

            {/*==================================================
                DETALLE NEE
            ==================================================*/}

            {
                neeVista && (

                    <div
                        className="direccion-modal-overlay"
                        onClick={() => setNeeVista(null)}
                    >

                        <div
                            className="direccion-modal"
                            onClick={(e) => e.stopPropagation()}
                        >

                            <div className="direccion-modal-header">

                                <div className="direccion-modal-title">

                                    <div className="direccion-modal-icon">
                                        <Brain size={22} />
                                    </div>

                                    <div>

                                        <h2>Detalle de NEE</h2>

                                        <span>
                                            Información de Psicología
                                        </span>

                                    </div>

                                </div>

                                <button
                                    className="direccion-modal-close"
                                    onClick={() => setNeeVista(null)}
                                >
                                    ×
                                </button>

                            </div>


                            <div className="direccion-modal-content">

                                <div className="direccion-info-grid">

                                    <div className="direccion-info-item">

                                        <span>Diagnóstico</span>

                                        <strong>
                                            {
                                                neeVista.diagnostico
                                                ||
                                                "Sin información"
                                            }
                                        </strong>

                                    </div>


                                    {
                                        neeVista.fecha && (

                                            <div className="direccion-info-item">

                                                <span>Fecha</span>

                                                <strong>
                                                    {neeVista.fecha}
                                                </strong>

                                            </div>

                                        )
                                    }

                                </div>


                                {
                                    neeVista.observaciones && (

                                        <div className="direccion-info-block">

                                            <span>Observaciones</span>

                                            <p>
                                                {neeVista.observaciones}
                                            </p>

                                        </div>

                                    )
                                }

                            </div>

                        </div>

                    </div>

                )
            }


            {/*==================================================
                DETALLE NOTA
            ==================================================*/}

            {
                notaVista && (

                    <div
                        className="direccion-modal-overlay"
                        onClick={() => setNotaVista(null)}
                    >

                        <div
                            className="direccion-modal"
                            onClick={(e) => e.stopPropagation()}
                        >

                            <div className="direccion-modal-header">

                                <div className="direccion-modal-title">

                                    <div className="direccion-modal-icon">
                                        <FileText size={22} />
                                    </div>

                                    <div>

                                        <h2>
                                            {notaVista.titulo || "Nota"}
                                        </h2>

                                        <span>
                                            Información de Psicología
                                        </span>

                                    </div>

                                </div>


                                <button
                                    className="direccion-modal-close"
                                    onClick={() => setNotaVista(null)}
                                >
                                    ×
                                </button>

                            </div>


                            <div className="direccion-modal-content">

                                <div className="direccion-info-block">

                                    <span>Contenido de la nota</span>

                                    <p className="direccion-nota-texto">

                                        {
                                            notaVista.nota
                                            ||
                                            "Sin información"
                                        }

                                    </p>

                                </div>


                                {
                                    notaVista.created_at && (

                                        <div className="direccion-info-item">

                                            <span>Fecha de registro</span>

                                            <strong>

                                                {
                                                    new Date(
                                                        notaVista.created_at
                                                    ).toLocaleString()
                                                }

                                            </strong>

                                        </div>

                                    )
                                }


                                {
                                    notaVista.fijada !== undefined && (

                                        <div className="direccion-info-item">

                                            <span>Estado</span>

                                            <strong>

                                                {
                                                    notaVista.fijada
                                                        ? "Nota fijada"
                                                        : "Nota normal"
                                                }

                                            </strong>

                                        </div>

                                    )
                                }

                            </div>

                        </div>

                    </div>

                )
            }

                        {/*==================================================
                            DETALLE SEGUIMIENTO
                        ==================================================*/}
            {
                seguimientoVista && (

                    <div
                        className="direccion-modal-overlay"
                        onClick={() => setSeguimientoVista(null)}
                    >

                        <div
                            className="direccion-modal"
                            onClick={(e) => e.stopPropagation()}
                        >

                            <div className="direccion-modal-header">

                                <div className="direccion-modal-title">

                                    <div className="direccion-modal-icon">
                                        <ClipboardList size={22} />
                                    </div>

                                    <div>

                                        <h2>
                                            Seguimiento
                                        </h2>

                                        <span>
                                            Información de Psicología
                                        </span>

                                    </div>

                                </div>


                                <button
                                    className="direccion-modal-close"
                                    onClick={() =>
                                        setSeguimientoVista(null)
                                    }
                                >
                                    ×
                                </button>

                            </div>


                            <div className="direccion-modal-content">

                                <div className="direccion-info-grid">

                                    {
                                        seguimientoVista.fecha && (

                                            <div className="direccion-info-item">

                                                <span>Fecha</span>

                                                <strong>
                                                    {seguimientoVista.fecha}
                                                </strong>

                                            </div>

                                        )
                                    }


                                    {
                                        seguimientoVista.hora && (

                                            <div className="direccion-info-item">

                                                <span>Hora</span>

                                                <strong>
                                                    {seguimientoVista.hora}
                                                </strong>

                                            </div>

                                        )
                                    }

                                </div>


                                {
                                    seguimientoVista.titulo && (

                                        <div className="direccion-info-block">

                                            <span>Título</span>

                                            <p>
                                                {seguimientoVista.titulo}
                                            </p>

                                        </div>

                                    )
                                }


                                {
                                    seguimientoVista.motivo && (

                                        <div className="direccion-info-block">

                                            <span>Motivo</span>

                                            <p>
                                                {seguimientoVista.motivo}
                                            </p>

                                        </div>

                                    )
                                }


                                {
                                    seguimientoVista.observaciones && (

                                        <div className="direccion-info-block">

                                            <span>Observaciones</span>

                                            <p>
                                                {seguimientoVista.observaciones}
                                            </p>

                                        </div>

                                    )
                                }


                                {
                                    seguimientoVista.descripcion && (

                                        <div className="direccion-info-block">

                                            <span>Descripción</span>

                                            <p>
                                                {seguimientoVista.descripcion}
                                            </p>

                                        </div>

                                    )
                                }

                            </div>

                        </div>

                    </div>

                )
            }

            {
                notaPrefecturaVista && (

                    <div
                        className="direccion-modal-overlay"
                        onClick={() =>
                            setNotaPrefecturaVista(null)
                        }
                    >

                        <div
                            className="direccion-modal"
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        >

                            <div className="direccion-modal-header">

                                <div className="direccion-modal-title">

                                    <div className="direccion-modal-icon">

                                        <FileText size={22} />

                                    </div>

                                    <div>

                                        <h2>

                                            {
                                                notaPrefecturaVista.titulo
                                                ||
                                                "Nota"
                                            }

                                        </h2>

                                        <span>
                                            Información de Prefectura
                                        </span>

                                    </div>

                                </div>

                                <button
                                    className="direccion-modal-close"
                                    onClick={() =>
                                        setNotaPrefecturaVista(null)
                                    }
                                >
                                    ×
                                </button>

                            </div>


                            <div className="direccion-modal-content">

                                <div className="direccion-info-block">

                                    <span>
                                        Contenido de la nota
                                    </span>

                                    <p className="direccion-nota-texto">

                                        {
                                            notaPrefecturaVista.nota
                                            ||
                                            "Sin información"
                                        }

                                    </p>

                                </div>


                                {
                                    notaPrefecturaVista.created_at && (

                                        <div className="direccion-info-item">

                                            <span>
                                                Fecha de registro
                                            </span>

                                            <strong>

                                                {
                                                    new Date(
                                                        notaPrefecturaVista.created_at
                                                    ).toLocaleString()
                                                }

                                            </strong>

                                        </div>

                                    )
                                }


                                {
                                    notaPrefecturaVista.fijada !== undefined && (

                                        <div className="direccion-info-item">

                                            <span>
                                                Estado
                                            </span>

                                            <strong>

                                                {
                                                    notaPrefecturaVista.fijada
                                                        ? "Nota fijada"
                                                        : "Nota normal"
                                                }

                                            </strong>

                                        </div>

                                    )
                                }

                            </div>

                        </div>

                    </div>

                )
            }

            {
    asistenciaVista && (

        <div
            className="direccion-modal-overlay"
            onClick={() =>
                setAsistenciaVista(false)
            }
        >

            <div
                className="direccion-modal"
                onClick={(e) =>
                    e.stopPropagation()
                }
            >

                <div className="direccion-modal-header">

                    <div className="direccion-modal-title">

                        <div className="direccion-modal-icon">

                            <ClipboardCheck size={22} />

                        </div>

                        <div>

                            <h2>
                                Detalle de asistencia
                            </h2>

                            <span>
                                Información de Prefectura
                            </span>

                        </div>

                    </div>

                    <button
                        className="direccion-modal-close"
                        onClick={() =>
                            setAsistenciaVista(false)
                        }
                    >
                        ×
                    </button>

                </div>

                <div className="direccion-modal-content">

                    {
                        asistencias.filter(
                            a =>
                                a.estatus === "tardanza" ||
                                a.estatus === "falta"
                        ).length === 0

                            ?

                            <div className="pa-empty">

                                No existen incidencias
                                de asistencia este mes.

                            </div>

                            :

                            asistencias
                                .filter(
                                    a =>
                                        a.estatus === "tardanza" ||
                                        a.estatus === "falta"
                                )
                                .map((registro, index) => (

                                    <div
                                        key={index}
                                        className="direccion-info-item"
                                    >

                                        <span>
                                            {registro.fecha}
                                        </span>

                                        <strong>

                                            {
                                                registro.estatus ===
                                                "tardanza"

                                                    ?

                                                    "Tardanza"

                                                    :

                                                    "Inasistencia"
                                            }

                                        </strong>

                                    </div>

                                ))

                    }

                </div>

            </div>

        </div>

    )
}

{
    reporteVista && (

        <div
            className="direccion-modal-overlay"
            onClick={() =>
                setReporteVista(null)
            }
        >

            <div
                className="direccion-modal"
                onClick={(e) =>
                    e.stopPropagation()
                }
            >

                <div className="direccion-modal-header">

                    <div className="direccion-modal-title">

                        <div className="direccion-modal-icon">

                            <FileWarning size={22} />

                        </div>

                        <div>

                            <h2>
                                {reporteVista.tipo || "Reporte"}
                            </h2>

                            <span>
                                Información de Prefectura
                            </span>

                        </div>

                    </div>

                    <button
                        className="direccion-modal-close"
                        onClick={() =>
                            setReporteVista(null)
                        }
                    >
                        ×
                    </button>

                </div>


                <div className="direccion-modal-content">

                    <div className="direccion-info-grid">

                        {
                            reporteVista.fecha && (

                                <div className="direccion-info-item">

                                    <span>
                                        Fecha
                                    </span>

                                    <strong>
                                        {reporteVista.fecha}
                                    </strong>

                                </div>

                            )
                        }

                        {
                            reporteVista.tipo && (

                                <div className="direccion-info-item">

                                    <span>
                                        Tipo
                                    </span>

                                    <strong>
                                        {reporteVista.tipo}
                                    </strong>

                                </div>

                            )
                        }

                    </div>


                    {
                        reporteVista.motivo && (

                            <div className="direccion-info-block">

                                <span>
                                    Motivo
                                </span>

                                <p>
                                    {reporteVista.motivo}
                                </p>

                            </div>

                        )
                    }


                    {
                        reporteVista.descripcion && (

                            <div className="direccion-info-block">

                                <span>
                                    Descripción
                                </span>

                                <p>
                                    {reporteVista.descripcion}
                                </p>

                            </div>

                        )
                    }


                    {
                        reporteVista.observaciones && (

                            <div className="direccion-info-block">

                                <span>
                                    Observaciones
                                </span>

                                <p>
                                    {reporteVista.observaciones}
                                </p>

                            </div>

                        )
                    }

                </div>

            </div>

        </div>

    )
}

{
    notaPrefecturaVista && (

        <div
            className="direccion-modal-overlay"
            onClick={() =>
                setNotaPrefecturaVista(null)
            }
        >

            <div
                className="direccion-modal"
                onClick={(e) =>
                    e.stopPropagation()
                }
            >

                <div className="direccion-modal-header">

                    <div className="direccion-modal-title">

                        <div className="direccion-modal-icon">

                            <FileText size={22} />

                        </div>

                        <div>

                            <h2>
                                {
                                    notaPrefecturaVista.titulo
                                    ||
                                    "Nota"
                                }
                            </h2>

                            <span>
                                Información de Prefectura
                            </span>

                        </div>

                    </div>

                    <button
                        className="direccion-modal-close"
                        onClick={() =>
                            setNotaPrefecturaVista(null)
                        }
                    >
                        ×
                    </button>

                </div>


                <div className="direccion-modal-content">

                    <div className="direccion-info-block">

                        <span>
                            Contenido de la nota
                        </span>

                        <p className="direccion-nota-texto">

                            {
                                notaPrefecturaVista.nota
                                ||
                                "Sin información"
                            }

                        </p>

                    </div>


                    {
                        notaPrefecturaVista.created_at && (

                            <div className="direccion-info-item">

                                <span>
                                    Fecha de registro
                                </span>

                                <strong>

                                    {
                                        new Date(
                                            notaPrefecturaVista.created_at
                                        ).toLocaleString()
                                    }

                                </strong>

                            </div>

                        )
                    }

                </div>

            </div>

        </div>

    )
}

        </>

    );

}