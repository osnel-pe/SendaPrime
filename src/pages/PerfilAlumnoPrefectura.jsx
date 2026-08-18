import {
    useState,
    useEffect,
    useRef
} from "react";

import {
    ArrowLeft,
    UserRound,
    FolderOpen,
    FileText,
    Eye,
    Trash2,
    Pencil,
    FilePlus2,
    ClipboardCheck,
    FileWarning
} from "lucide-react";

import "../Styles/AppLayout.css";
import "../Styles/Psicologia.css";
import "../Styles/PerfilAlumnoPsico.css";
import "../Styles/Reportes.css";

import fondoPsicologia
from "../assets/fondo-psicologia.jpg";

import ModalNEE
from "../components/ModalNEE";

import ModalNota
from "../components/Psicologia/ModalNota";

import ModalCita
from "../components/Psicologia/ModalCita";

import VistaDetalleNota
from "../components/Psicologia/VistaDetalleNota";

import VistaDetalleCita
from "../components/Psicologia/VistaDetalleCita";

import VistaDetalleNEE
from "../components/Psicologia/VistaDetalleNEE";

import TarjetaAsistenciaAlumno
from "../components/Prefectura/TarjetaAsistenciaAlumno";

import ModalReporte
from "../components/Prefectura/ModalReporte";

import VistaDetalleReporte
from "../components/Prefectura/VistaDetalleReporte";

import { supabase }
from "../services/supabase";


export default function PerfilAlumnoPrefectura({

    alumno,

    students,

    setStudents,

    setAlumnoSeleccionado,

    cambiarPantalla,

    embebido = false,

    citaActiva,

    setCitaActiva,

    moduloInicial

}) {

    /*==================================================
    ALUMNO
    ==================================================*/

    const [datosAlumno, setDatosAlumno] =
        useState(alumno);


    /*==================================================
    MÓDULO
    ==================================================*/

    const [modulo, setModulo] =
        useState(
            moduloInicial || "archivos"
        );


    /*==================================================
    ARCHIVOS
    ==================================================*/

    const inputArchivo =
        useRef(null);

    const [archivos, setArchivos] =
        useState([]);


    /*==================================================
    NEE
    ==================================================*/

    const [nees, setNees] =
        useState([]);

    const [modalNEE, setModalNEE] =
        useState(false);

    const [neeEditar, setNeeEditar] =
        useState(null);

    const [neeVista, setNeeVista] =
        useState(null);


    /*==================================================
    NOTAS
    ==================================================*/

    const [notas, setNotas] =
        useState([]);

    const [modalNota, setModalNota] =
        useState(false);

    const [notaEditar, setNotaEditar] =
        useState(null);

    const [notaVista, setNotaVista] =
        useState(null);


    /*==================================================
    SEGUIMIENTO
    ==================================================*/

    const [
        seguimientos,
        setSeguimientos
    ] = useState([]);

    const [
        historial,
        setHistorial
    ] = useState([]);

    const [
        modalSeguimiento,
        setModalSeguimiento
    ] = useState(false);

    const [
        seguimientoEditar,
        setSeguimientoEditar
    ] = useState(null);

    const [
        seguimientoVista,
        setSeguimientoVista
    ] = useState(null);


    /*==================================================
    REPORTES
    ==================================================*/

    const [reportes, setReportes] =
        useState([]);

    const [
        modalReporte,
        setModalReporte
    ] = useState(false);

    const [
        reporteEditar,
        setReporteEditar
    ] = useState(null);

    const [
        reporteVista,
        setReporteVista
    ] = useState(null);


    /*==================================================
    EFECTOS
    ==================================================*/

    useEffect(() => {

        setDatosAlumno(
            alumno
        );

    }, [alumno]);


    useEffect(() => {

        if (!alumno?.id) return;

        cargarArchivos(
            alumno
        );

        cargarNotas(
            alumno.id
        );

        cargarSeguimientos(
            alumno.id
        );

        cargarHistorial(
            alumno.id
        );

        cargarReportes(
            alumno.id
        );

    }, [alumno]);


    useEffect(() => {

        setNees(
            datosAlumno?.nee || []
        );

    }, [datosAlumno]);


    useEffect(() => {

        if (!citaActiva) return;

        setSeguimientoEditar(
            citaActiva
        );

        setModalSeguimiento(
            true
        );

    }, [citaActiva]);


    useEffect(() => {

        setModulo(
            moduloInicial
            || "archivos"
        );

    }, [
        alumno,
        moduloInicial
    ]);


    /*==================================================
    REPORTES
    ==================================================*/

    async function cargarReportes(
        alumnoId = datosAlumno?.id
    ) {

        if (!alumnoId) return;

        const {
            data,
            error
        } = await supabase

            .from(
                "reportes_prefectura"
            )

            .select("*")

            .eq(
                "alumno_id",
                alumnoId
            )

            .order(
                "fecha",
                {
                    ascending: false
                }
            )

            .order(
                "created_at",
                {
                    ascending: false
                }
            );


        if (error) {

            console.log(
                "Error cargando reportes:",
                error
            );

            return;

        }


        setReportes(
            data || []
        );

    }


    async function guardarReporte() {

        setModalReporte(
            false
        );

        setReporteEditar(
            null
        );

        await cargarReportes();

    }


    function editarReporte(
        reporte
    ) {

        setReporteEditar(
            reporte
        );

        setModalReporte(
            true
        );

    }


    async function eliminarReporte(
        id
    ) {

        if (
            !window.confirm(
                "¿Eliminar reporte?"
            )
        ) {

            return;

        }


        const {
            error
        } = await supabase

            .from(
                "reportes_prefectura"
            )

            .delete()

            .eq(
                "id",
                id
            );


        if (error) {

            alert(
                error.message
            );

            return;

        }


        await cargarReportes();

    }


    /*==================================================
    ARCHIVOS
    ==================================================*/

    async function cargarArchivos(
        alumnoActual = datosAlumno
    ) {

        if (
            !alumnoActual?.id
            ||
            !alumnoActual?.grupo
        ) {

            return;

        }


        const carpeta =
            `${alumnoActual.grupo}/${alumnoActual.id}`;


        const {
            data,
            error
        } = await supabase.storage

            .from(
                "archivos-prefectura"
            )

            .list(
                carpeta
            );


        if (error) {

            console.log(
                "Error cargando archivos:",
                error
            );

            return;

        }


        setArchivos(
            data || []
        );

    }


    async function abrirArchivo(
        nombre
    ) {

        if (!datosAlumno) return;


        const ruta =
            `${datosAlumno.grupo}/${datosAlumno.id}/${nombre}`;


        const {
            data,
            error
        } = await supabase.storage

            .from(
                "archivos-prefectura"
            )

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


    async function subirArchivo(
        e
    ) {

        const archivo =
            e.target.files?.[0];


        if (
            !archivo
            ||
            !datosAlumno
        ) {

            return;

        }


        const ruta =
            `${datosAlumno.grupo}/${datosAlumno.id}/${archivo.name}`;


        const {
            error
        } = await supabase.storage

            .from(
                "archivos-prefectura"
            )

            .upload(
                ruta,
                archivo,
                {
                    upsert: true
                }
            );


        if (error) {

            alert(
                error.message
            );

            return;

        }


        e.target.value = "";

        await cargarArchivos();

    }


    async function eliminarArchivo(
        nombre
    ) {

        if (
            !window.confirm(
                "¿Eliminar documento?"
            )
        ) {

            return;

        }


        if (!datosAlumno) return;


        const ruta =
            `${datosAlumno.grupo}/${datosAlumno.id}/${nombre}`;


        const {
            error
        } = await supabase.storage

            .from(
                "archivos-prefectura"
            )

            .remove([
                ruta
            ]);


        if (error) {

            alert(
                error.message
            );

            return;

        }


        await cargarArchivos();

    }


    /*==================================================
    NOTAS
    ==================================================*/

    async function cargarNotas(
        alumnoId = datosAlumno?.id
    ) {

        if (!alumnoId) return;


        const {
            data,
            error
        } = await supabase

            .from(
                "notas_prefectura"
            )

            .select("*")

            .eq(
                "alumno_id",
                alumnoId
            )

            .order(
                "fijada",
                {
                    ascending: false
                }
            )

            .order(
                "created_at",
                {
                    ascending: false
                }
            );


        if (error) {

            console.log(
                "Error cargando notas:",
                error
            );

            return;

        }


        setNotas(
            data || []
        );

    }


    async function guardarNota(
        datos
    ) {

        if (!datosAlumno?.id) return;


        if (notaEditar) {

            const {
                error
            } = await supabase

                .from(
                    "notas_prefectura"
                )

                .update({

                    titulo:
                        datos.titulo,

                    nota:
                        datos.nota,

                    color:
                        datos.color,

                    fijada:
                        datos.fijada

                })

                .eq(
                    "id",
                    notaEditar.id
                );


            if (error) {

                alert(
                    error.message
                );

                return;

            }

        }

        else {

            const {
                error
            } = await supabase

                .from(
                    "notas_prefectura"
                )

                .insert({

                    alumno_id:
                        datosAlumno.id,

                    grupo:
                        datosAlumno.grupo,

                    titulo:
                        datos.titulo,

                    nota:
                        datos.nota,

                    color:
                        datos.color,

                    fijada:
                        false

                });


            if (error) {

                alert(
                    error.message
                );

                return;

            }

        }


        await cargarNotas();


        setModalNota(
            false
        );

        setNotaEditar(
            null
        );

    }


    async function eliminarNota(
        id
    ) {

        if (
            !window.confirm(
                "¿Eliminar esta nota?"
            )
        ) {

            return;

        }


        const {
            error
        } = await supabase

            .from(
                "notas_prefectura"
            )

            .delete()

            .eq(
                "id",
                id
            );


        if (error) {

            alert(
                error.message
            );

            return;

        }


        await cargarNotas();

    }


    function editarNota(
        nota
    ) {

        setNotaEditar(
            nota
        );

        setModalNota(
            true
        );

    }


    /*==================================================
    NEE
    ==================================================*/

    function editarNEE(
        indice
    ) {

        const nee =
            datosAlumno?.nee?.[
                indice
            ];


        if (!nee) return;


        setNeeEditar(
            nee
        );

        setModalNEE(
            true
        );

    }


    async function eliminarNEE(
        indice
    ) {

        if (
            !window.confirm(
                "¿Eliminar esta NEE?"
            )
        ) {

            return;

        }


        if (!datosAlumno?.id) return;


        const nuevasNEE = [

            ...(
                datosAlumno.nee
                || []
            )

        ];


        nuevasNEE.splice(
            indice,
            1
        );


        const {
            error
        } = await supabase

            .from("alumnos")

            .update({

                nee:
                    nuevasNEE

            })

            .eq(
                "id",
                datosAlumno.id
            );


        if (error) {

            alert(
                error.message
            );

            return;

        }


        const alumnoActualizado = {

            ...datosAlumno,

            nee:
                nuevasNEE

        };


        setDatosAlumno(
            alumnoActualizado
        );

        setNees(
            nuevasNEE
        );

        setAlumnoSeleccionado?.(
            alumnoActualizado
        );


        if (
            Array.isArray(students)
            &&
            setStudents
        ) {

            const nuevos =
                students.map(
                    estudiante =>

                        estudiante.id
                        === datosAlumno.id

                            ?

                            alumnoActualizado

                            :

                            estudiante
                );


            setStudents(
                nuevos
            );

        }

    }


    async function guardarNEE(
        datos
    ) {

        if (!datosAlumno?.id) return;


        const lista = [

            ...(
                datosAlumno.nee
                || []
            )

        ];


        if (neeEditar) {

            const indice =
                lista.findIndex(
                    nee =>

                        nee.diagnostico
                        ===
                        neeEditar.diagnostico

                        &&

                        nee.observaciones
                        ===
                        neeEditar.observaciones
                );


            if (
                indice !== -1
            ) {

                lista[
                    indice
                ] = datos;

            }

        }

        else {

            lista.unshift(
                datos
            );

        }


        const {
            error
        } = await supabase

            .from("alumnos")

            .update({

                nee:
                    lista

            })

            .eq(
                "id",
                datosAlumno.id
            );


        if (error) {

            alert(
                error.message
            );

            return;

        }


        const alumnoActualizado = {

            ...datosAlumno,

            nee:
                lista

        };


        setDatosAlumno(
            alumnoActualizado
        );

        setNees(
            lista
        );

        setAlumnoSeleccionado?.(
            alumnoActualizado
        );


        if (
            Array.isArray(students)
            &&
            setStudents
        ) {

            const nuevos =
                students.map(
                    estudiante =>

                        estudiante.id
                        === datosAlumno.id

                            ?

                            alumnoActualizado

                            :

                            estudiante
                );


            setStudents(
                nuevos
            );

        }


        setNeeEditar(
            null
        );

        setModalNEE(
            false
        );

    }


    /*==================================================
    SEGUIMIENTOS
    ==================================================*/

    async function cargarSeguimientos(
        alumnoId = datosAlumno?.id
    ) {

        if (!alumnoId) return;


        const {
            data,
            error
        } = await supabase

            .from(
                "citas_programadas"
            )

            .select("*")

            .eq(
                "alumno_id",
                alumnoId
            )

            .order(
                "fecha",
                {
                    ascending: true
                }
            )

            .order(
                "hora",
                {
                    ascending: true
                }
            );


        if (error) {

            console.log(
                "Error cargando seguimientos:",
                error
            );

            return;

        }


        setSeguimientos(
            data || []
        );

    }


    async function cargarHistorial(
        alumnoId = datosAlumno?.id
    ) {

        if (!alumnoId) return;


        const {
            data,
            error
        } = await supabase

            .from(
                "historial_psicologia"
            )

            .select("*")

            .eq(
                "alumno_id",
                alumnoId
            )

            .order(
                "fecha",
                {
                    ascending: false
                }
            )

            .order(
                "hora",
                {
                    ascending: false
                }
            );


        if (error) {

            console.log(
                "Error cargando historial:",
                error
            );

            return;

        }


        setHistorial(
            data || []
        );

    }


    async function guardarSeguimiento(
        datos
    ) {

        if (
            !seguimientoEditar?.id
        ) {

            console.log(
                "No existe seguimiento para editar."
            );

            return;

        }


        if (
            seguimientoEditar?.alumno_id
            &&
            !seguimientoEditar?.intervencion
        ) {

            const {
                error
            } = await supabase

                .from(
                    "citas_programadas"
                )

                .update({

                    fecha:
                        datos.fecha,

                    hora:
                        datos.hora,

                    tipo:
                        datos.tipo

                })

                .eq(
                    "id",
                    seguimientoEditar.id
                );


            if (error) {

                alert(
                    error.message
                );

                return;

            }

        }

        else {

            const {
                error
            } = await supabase

                .from(
                    "historial_psicologia"
                )

                .update({

                    fecha:
                        datos.fecha,

                    hora:
                        datos.hora,

                    tipo:
                        datos.tipo,

                    motivo:
                        datos.motivo,

                    intervencion:
                        datos.intervencion,

                    acuerdos:
                        datos.acuerdos

                })

                .eq(
                    "id",
                    seguimientoEditar.id
                );


            if (error) {

                alert(
                    error.message
                );

                return;

            }

        }


        setSeguimientoEditar(
            null
        );

        setModalSeguimiento(
            false
        );


        if (setCitaActiva) {

            setCitaActiva(
                null
            );

        }


        await cargarSeguimientos();

        await cargarHistorial();

    }


    /*==================================================
    COLOR REPORTE
    ==================================================*/

    function colorReporte(
        tipo
    ) {

        switch (tipo) {

            case "Aviso":

                return "reporte-aviso";


            case "Aviso de conducta":

                return "reporte-aviso-conducta";


            case "Nota de conducta":

                return "reporte-nota-conducta";


            case "Reporte de conducta":

                return "reporte-reporte-conducta";


            case "Suspensión":

                return "reporte-suspension";


            default:

                return "";

        }

    }


    /*==================================================
    SIN ALUMNO
    ==================================================*/

    if (!datosAlumno) {

        return null;

    }


    /*==================================================
    JSX
    ==================================================*/

    const contenido = (

        <div className="perfil-wrapper">


            {/*=========================================
            HEADER
            =========================================*/}

            <div className="perfil-header">

                <button

                    className="back-btn"

                    onClick={() =>
                        cambiarPantalla(
                            "grupoPrefectura"
                        )
                    }

                >

                    <ArrowLeft
                        size={20}
                    />

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


                {/*=====================================
                TARJETA ALUMNO
                =====================================*/}

                <div className="pa-card-alumno">

                    <div className="pa-avatar">

                        <UserRound
                            size={34}
                        />

                    </div>


                    <div className="pa-card-info">

                        <h2>

                            {
                                datosAlumno?.nombre
                            }{" "}

                            {
                                datosAlumno
                                    ?.apellido_paterno
                            }{" "}

                            {
                                datosAlumno
                                    ?.apellido_materno
                            }

                        </h2>


                        <div className="pa-card-extra">

                            <span>

                                {
                                    datosAlumno?.grupo
                                }

                            </span>


                            <div
                                className="pa-separador"
                            />


                            <span>

                                {
                                    datosAlumno?.sexo
                                    === "M"

                                        ?

                                        "Masculino"

                                        :

                                        datosAlumno?.sexo
                                        === "F"

                                            ?

                                            "Femenino"

                                            :

                                            ""
                                }

                            </span>

                        </div>

                    </div>

                </div>


                {/*=====================================
                TOOLBAR
                =====================================*/}

                <div className="pa-toolbar">


                    <button

                        className={
                            modulo === "archivos"
                                ?
                                "pa-tool activo"
                                :
                                "pa-tool"
                        }

                        onClick={() =>
                            setModulo(
                                "archivos"
                            )
                        }

                    >

                        <FolderOpen
                            size={22}
                        />

                    </button>


                    <button

                        className={
                            modulo === "asistencia"
                                ?
                                "pa-tool activo"
                                :
                                "pa-tool"
                        }

                        onClick={() =>
                            setModulo(
                                "asistencia"
                            )
                        }

                    >

                        <ClipboardCheck
                            size={22}
                        />

                    </button>


                    <button

                        className={
                            modulo === "reportes"
                                ?
                                "pa-tool activo"
                                :
                                "pa-tool"
                        }

                        onClick={() =>
                            setModulo(
                                "reportes"
                            )
                        }

                    >

                        <FileWarning
                            size={22}
                        />

                    </button>


                    <button

                        className={
                            modulo === "notas"
                                ?
                                "pa-tool activo"
                                :
                                "pa-tool"
                        }

                        onClick={() =>
                            setModulo(
                                "notas"
                            )
                        }

                    >

                        <FileText
                            size={22}
                        />

                    </button>


                </div>


                {/*=====================================
                CABECERA MÓDULO
                =====================================*/}

                <div className="pa-module">

                    <div>

                        <h3>

                            {
                                modulo === "archivos"
                                    ?
                                    "Archivos"

                                    :

                                    modulo === "asistencia"
                                        ?
                                        "Asistencia"

                                        :

                                        modulo === "reportes"
                                            ?
                                            "Reportes"

                                            :

                                            "Notas"
                            }

                        </h3>

                    </div>


                    {
                        modulo !== "asistencia"
                        &&

                        <button

                            className="pa-add-btn"

                            onClick={() => {

                                switch (modulo) {

                                    case "archivos":

                                        inputArchivo
                                            .current
                                            ?.click();

                                        break;


                                    case "reportes":

                                        setReporteEditar(
                                            null
                                        );

                                        setModalReporte(
                                            true
                                        );

                                        break;


                                    case "notas":

                                        setNotaEditar(
                                            null
                                        );

                                        setModalNota(
                                            true
                                        );

                                        break;


                                    default:

                                        break;

                                }

                            }}

                        >

                            <FilePlus2
                                size={18}
                            />

                        </button>
                    }

                </div>


                {/*=====================================
                CONTENIDO
                =====================================*/}

                <div className="pa-module-body">


                    {/* ARCHIVOS */}

                    {
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
                                        archivo => (

                                            <div

                                                key={
                                                    archivo.name
                                                }

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

                                                        onClick={() =>
                                                            abrirArchivo(
                                                                archivo.name
                                                            )
                                                        }

                                                    >

                                                        <Eye
                                                            size={16}
                                                        />

                                                    </button>


                                                    <button

                                                        className="pa-circle-btn pa-delete"

                                                        onClick={() =>
                                                            eliminarArchivo(
                                                                archivo.name
                                                            )
                                                        }

                                                    >

                                                        <Trash2
                                                            size={16}
                                                        />

                                                    </button>

                                                </div>

                                            </div>

                                        )
                                    )
                            }


                            <input

                                ref={
                                    inputArchivo
                                }

                                hidden

                                type="file"

                                onChange={
                                    subirArchivo
                                }

                            />

                        </>
                    }


                    {/* ASISTENCIA */}

                    {
                        modulo === "asistencia"
                        &&

                        <TarjetaAsistenciaAlumno

                            key={
                                datosAlumno.id
                            }

                            alumnoId={
                                datosAlumno.id
                            }

                        />
                    }


                    {/* REPORTES */}

                    {
                        modulo === "reportes"
                        &&

                        <>

                            {
                                reportes.length === 0

                                    ?

                                    <div className="pa-empty">

                                        No existen reportes registrados.

                                    </div>

                                    :

                                    reportes.map(
                                        reporte => (

                                            <div

                                                key={
                                                    reporte.id
                                                }

                                                className={
                                                    `pa-card reporte-card ${colorReporte(
                                                        reporte.tipo
                                                    )}`
                                                }

                                                onClick={
                                                    e => {

                                                        if (
                                                            e.target.closest(
                                                                ".pa-card-actions"
                                                            )
                                                        ) {

                                                            return;

                                                        }


                                                        setReporteVista(
                                                            reporte
                                                        );

                                                    }
                                                }

                                            >

                                                <div className="pa-card-left">

                                                    <div className="pa-card-icon reporte-icon">

                                                        <FileWarning
                                                            size={20}
                                                        />

                                                    </div>


                                                    <div className="pa-card-text">

                                                        <h4>

                                                            {
                                                                reporte.tipo
                                                            }

                                                        </h4>


                                                        <span>

                                                            {
                                                                reporte.motivo
                                                            }

                                                        </span>


                                                        <small>

                                                            {
                                                                reporte.fecha
                                                            }

                                                        </small>

                                                    </div>

                                                </div>


                                                <div className="pa-card-actions">

                                                    <button

                                                        className="pa-circle-btn"

                                                        onClick={() =>
                                                            editarReporte(
                                                                reporte
                                                            )
                                                        }

                                                    >

                                                        <Pencil
                                                            size={16}
                                                        />

                                                    </button>


                                                    <button

                                                        className="pa-circle-btn pa-delete"

                                                        onClick={() =>
                                                            eliminarReporte(
                                                                reporte.id
                                                            )
                                                        }

                                                    >

                                                        <Trash2
                                                            size={16}
                                                        />

                                                    </button>

                                                </div>

                                            </div>

                                        )
                                    )
                            }


                            <ModalReporte

                                abierto={
                                    modalReporte
                                }

                                cerrar={() => {

                                    setReporteEditar(
                                        null
                                    );

                                    setModalReporte(
                                        false
                                    );

                                }}

                                guardar={
                                    guardarReporte
                                }

                                reporteActual={
                                    reporteEditar
                                }

                                alumno={
                                    datosAlumno
                                }

                            />

                        </>
                    }


                    {/* NOTAS */}

                    {
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

                                    notas.map(
                                        nota => (

                                            <div

                                                key={
                                                    nota.id
                                                }

                                                className={
                                                    `pa-card pa-note ${nota.color || "verde"}`
                                                }

                                                onClick={
                                                    e => {

                                                        if (
                                                            e.target.closest(
                                                                ".pa-card-actions"
                                                            )
                                                        ) {

                                                            return;

                                                        }


                                                        setNotaVista(
                                                            nota
                                                        );

                                                    }
                                                }

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
                                                                nota.titulo
                                                            }

                                                        </h4>


                                                        <p>

                                                            {
                                                                nota.nota
                                                            }

                                                        </p>


                                                        {
                                                            nota.created_at
                                                            &&

                                                            <small>

                                                                {
                                                                    new Date(
                                                                        nota.created_at
                                                                    )
                                                                        .toLocaleDateString()
                                                                }

                                                            </small>
                                                        }

                                                    </div>

                                                </div>


                                                <div className="pa-card-actions">

                                                    <button

                                                        className="pa-circle-btn"

                                                        onClick={() =>
                                                            editarNota(
                                                                nota
                                                            )
                                                        }

                                                    >

                                                        <Pencil
                                                            size={16}
                                                        />

                                                    </button>


                                                    <button

                                                        className="pa-circle-btn pa-delete"

                                                        onClick={() =>
                                                            eliminarNota(
                                                                nota.id
                                                            )
                                                        }

                                                    >

                                                        <Trash2
                                                            size={16}
                                                        />

                                                    </button>

                                                </div>

                                            </div>

                                        )
                                    )
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
                !embebido
                &&

                <div

                    className="app-background"

                    style={{

                        backgroundImage:
                            `url(${fondoPsicologia})`

                    }}

                />
            }


            {
                embebido

                    ?

                    contenido

                    :

                    <div className="ps-app">

                        <div className="ps-container">

                            {contenido}

                        </div>

                    </div>
            }


            {/*=========================================
            MODAL CITA
            =========================================*/}

            <ModalCita

                abierto={
                    modalSeguimiento
                }

                cerrar={() => {

                    setSeguimientoEditar(
                        null
                    );

                    setModalSeguimiento(
                        false
                    );

                }}

                guardar={
                    guardarSeguimiento
                }

                citaActual={
                    seguimientoEditar
                }

            />


            {/*=========================================
            MODAL NEE
            =========================================*/}

            <ModalNEE

                abierto={
                    modalNEE
                }

                cerrar={() => {

                    setNeeEditar(
                        null
                    );

                    setModalNEE(
                        false
                    );

                }}

                guardar={
                    guardarNEE
                }

                nee={
                    neeEditar
                }

            />


            {/*=========================================
            MODAL NOTA
            =========================================*/}

            <ModalNota

                abierto={
                    modalNota
                }

                cerrar={() => {

                    setNotaEditar(
                        null
                    );

                    setModalNota(
                        false
                    );

                }}

                guardar={
                    guardarNota
                }

                notaActual={
                    notaEditar
                }

                students={
                    students
                }

                ocultarAlumno={
                    true
                }

                soloIndividual={
                    true
                }

                soloPerfil={
                    true
                }

            />


            {/*=========================================
            DETALLE NOTA
            =========================================*/}

            <VistaDetalleNota

                abierta={
                    notaVista !== null
                }

                nota={
                    notaVista
                }

                students={
                    students
                }

                cerrar={() =>
                    setNotaVista(
                        null
                    )
                }

                editar={
                    nota => {

                        setNotaVista(
                            null
                        );

                        editarNota(
                            nota
                        );

                    }
                }

            />


            {/*=========================================
            DETALLE NEE
            =========================================*/}

            <VistaDetalleNEE

                abierta={
                    neeVista !== null
                }

                nee={
                    neeVista
                }

                cerrar={() =>
                    setNeeVista(
                        null
                    )
                }

                editar={
                    nee => {

                        setNeeVista(
                            null
                        );

                        setNeeEditar(
                            nee
                        );

                        setModalNEE(
                            true
                        );

                    }
                }

            />


            {/*=========================================
            DETALLE CITA
            =========================================*/}

            <VistaDetalleCita

                abierta={
                    seguimientoVista !== null
                }

                cita={
                    seguimientoVista
                }

                students={
                    students
                }

                cerrar={() =>
                    setSeguimientoVista(
                        null
                    )
                }

                editar={
                    cita => {

                        setSeguimientoVista(
                            null
                        );

                        setSeguimientoEditar(
                            cita
                        );

                        setModalSeguimiento(
                            true
                        );

                    }
                }

            />


            {/*=========================================
            DETALLE REPORTE
            =========================================*/}

            <VistaDetalleReporte

                abierta={
                    reporteVista !== null
                }

                reporte={
                    reporteVista
                }

                cerrar={() =>
                    setReporteVista(
                        null
                    )
                }

                editar={
                    reporte => {

                        setReporteVista(
                            null
                        );

                        setReporteEditar(
                            reporte
                        );

                        setModalReporte(
                            true
                        );

                    }
                }

            />


        </>

    );

}