import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    ArrowLeft,
    UserRound,
    ClipboardCheck,
    FileWarning,
    FileText,
    Clock3,
    CircleX,
    Coffee,
    LogOut,
    FilePlus2,
    Pencil,
    Trash2,
    X,
    Save,
    UserCheck
} from "lucide-react";

import "../Styles/AppLayout.css";
import "../Styles/Psicologia.css";
import "../Styles/PerfilAlumnoPsico.css";
import "../Styles/Reportes.css";
import "../Styles/PerfilMaestroPrefectura.css";

import fondoPsicologia
from "../assets/fondo-psicologia.jpg";

import { supabase }
from "../services/supabase";


export default function PerfilMaestroPrefectura({

    maestro,

    cambiarPantalla,

    embebido = false,

    soloLectura = false,

    pantallaVolver =
        "maestrosPerfiles"

}) {

    /*==================================================
    MAESTRO
    ==================================================*/

    const [datosMaestro, setDatosMaestro] =
        useState(maestro);


    /*==================================================
    MÓDULO
    ==================================================*/

    const [modulo, setModulo] =
        useState("asistencia");


    /*==================================================
    MES
    ==================================================*/

    const [mes, setMes] =
        useState(
            new Date().getMonth() + 1
        );

    const añoActual =
        new Date().getFullYear();


    /*==================================================
    DATOS
    ==================================================*/

    const [asistencias, setAsistencias] =
        useState([]);

    const [guardias, setGuardias] =
        useState([]);

    const [reportes, setReportes] =
        useState([]);

    const [notas, setNotas] =
        useState([]);


    /*==================================================
    REPORTES
    ==================================================*/

    const [modalReporte, setModalReporte] =
        useState(false);

    const [reporteEditar, setReporteEditar] =
        useState(null);

    const [reporteVista, setReporteVista] =
        useState(null);

    const [formReporte, setFormReporte] =
        useState({

            fecha: "",

            tipo: "Incidencia",

            motivo: "",

            observaciones: ""

        });


    /*==================================================
    NOTAS
    ==================================================*/

    const [modalNota, setModalNota] =
        useState(false);

    const [notaEditar, setNotaEditar] =
        useState(null);

    const [notaVista, setNotaVista] =
        useState(null);

    const [formNota, setFormNota] =
        useState({

            titulo: "",

            nota: ""

        });


    /*==================================================
    MESES
    ==================================================*/

    const meses = [

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

    ];


    /*==================================================
    FECHA LOCAL
    ==================================================*/

    function obtenerFechaLocal() {

        const hoy = new Date();

        const año =
            hoy.getFullYear();

        const mes =
            String(
                hoy.getMonth() + 1
            ).padStart(2, "0");

        const dia =
            String(
                hoy.getDate()
            ).padStart(2, "0");

        return `${año}-${mes}-${dia}`;

    }


    /*==================================================
    EFECTOS
    ==================================================*/

    useEffect(() => {

        setDatosMaestro(
            maestro
        );

        setModulo(
            "asistencia"
        );

        setMes(
            new Date().getMonth() + 1
        );

    }, [maestro]);


    useEffect(() => {

        if (!maestro?.id) return;

        cargarTodo();

    }, [maestro]);


    /*==================================================
    CARGAR TODO
    ==================================================*/

    async function cargarTodo() {

        await Promise.all([

            cargarAsistencia(),

            cargarGuardias(),

            cargarReportes(),

            cargarNotas()

        ]);

    }


    /*==================================================
    ASISTENCIA
    ==================================================*/

    async function cargarAsistencia() {

        if (!maestro?.id) return;

        const {
            data,
            error
        } = await supabase

            .from(
                "asistencia_maestros"
            )

            .select("*")

            .eq(
                "maestro_id",
                maestro.id
            )

            .order(
                "fecha",
                {
                    ascending: false
                }
            );


        if (error) {

            console.log(
                "Error cargando asistencia:",
                error
            );

            return;

        }


        setAsistencias(
            data || []
        );

    }


    /*==================================================
    GUARDIAS
    ==================================================*/

    async function cargarGuardias() {

        if (!maestro?.id) return;

        const {
            data,
            error
        } = await supabase

            .from(
                "guardias_maestros"
            )

            .select("*")

            .eq(
                "maestro_id",
                maestro.id
            )

            .order(
                "fecha",
                {
                    ascending: false
                }
            );


        if (error) {

            console.log(
                "Error cargando guardias:",
                error
            );

            return;

        }


        setGuardias(
            data || []
        );

    }


    /*==================================================
    REPORTES
    ==================================================*/

    async function cargarReportes() {

        if (!maestro?.id) return;

        const {
            data,
            error
        } = await supabase

            .from(
                "reportes_maestros"
            )

            .select("*")

            .eq(
                "maestro_id",
                maestro.id
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


    function nuevoReporte() {

        setReporteEditar(
            null
        );

        setFormReporte({

            fecha:
                obtenerFechaLocal(),

            tipo:
                "Incidencia",

            motivo:
                "",

            observaciones:
                ""

        });

        setModalReporte(
            true
        );

    }


    function editarReporte(
        reporte
    ) {

        setReporteEditar(
            reporte
        );

        setFormReporte({

            fecha:
                reporte.fecha || "",

            tipo:
                reporte.tipo
                || "Incidencia",

            motivo:
                reporte.motivo
                || "",

            observaciones:
                reporte.observaciones
                || ""

        });

        setModalReporte(
            true
        );

    }


    async function guardarReporte() {

        if (!datosMaestro?.id) {

            alert(
                "No existe maestro seleccionado."
            );

            return;

        }


        if (!formReporte.fecha) {

            alert(
                "Selecciona una fecha."
            );

            return;

        }


        if (
            !formReporte.tipo.trim()
        ) {

            alert(
                "Selecciona un tipo."
            );

            return;

        }


        if (
            !formReporte.motivo.trim()
        ) {

            alert(
                "Escribe el motivo."
            );

            return;

        }


        const registro = {

            fecha:
                formReporte.fecha,

            tipo:
                formReporte.tipo,

            motivo:
                formReporte.motivo.trim(),

            observaciones:
                formReporte.observaciones.trim()

        };


        if (reporteEditar) {

            const {
                error
            } = await supabase

                .from(
                    "reportes_maestros"
                )

                .update(
                    registro
                )

                .eq(
                    "id",
                    reporteEditar.id
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
                    "reportes_maestros"
                )

                .insert({

                    maestro_id:
                        datosMaestro.id,

                    ...registro

                });


            if (error) {

                alert(
                    error.message
                );

                return;

            }

        }


        setModalReporte(
            false
        );

        setReporteEditar(
            null
        );

        await cargarReportes();

    }


    async function eliminarReporte(
        id
    ) {

        if (
            !window.confirm(
                "¿Eliminar este reporte?"
            )
        ) return;


        const {
            error
        } = await supabase

            .from(
                "reportes_maestros"
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


        setReporteVista(
            null
        );

        await cargarReportes();

    }


    /*==================================================
    NOTAS
    ==================================================*/

    async function cargarNotas() {

        if (!maestro?.id) return;

        const {
            data,
            error
        } = await supabase

            .from(
                "notas_maestros"
            )

            .select("*")

            .eq(
                "maestro_id",
                maestro.id
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


    function nuevaNota() {

        setNotaEditar(
            null
        );

        setFormNota({

            titulo: "",

            nota: ""

        });

        setModalNota(
            true
        );

    }


    function editarNota(
        nota
    ) {

        setNotaEditar(
            nota
        );

        setFormNota({

            titulo:
                nota.titulo || "",

            nota:
                nota.nota || ""

        });

        setModalNota(
            true
        );

    }


    async function guardarNota() {

        if (!datosMaestro?.id) {

            alert(
                "No existe maestro seleccionado."
            );

            return;

        }


        if (
            !formNota.titulo.trim()
        ) {

            alert(
                "Escribe un título."
            );

            return;

        }


        if (
            !formNota.nota.trim()
        ) {

            alert(
                "Escribe la nota."
            );

            return;

        }


        const registro = {

            titulo:
                formNota.titulo.trim(),

            nota:
                formNota.nota.trim()

        };


        if (notaEditar) {

            const {
                error
            } = await supabase

                .from(
                    "notas_maestros"
                )

                .update(
                    registro
                )

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
                    "notas_maestros"
                )

                .insert({

                    maestro_id:
                        datosMaestro.id,

                    ...registro

                });


            if (error) {

                alert(
                    error.message
                );

                return;

            }

        }


        setModalNota(
            false
        );

        setNotaEditar(
            null
        );

        await cargarNotas();

    }


    async function eliminarNota(
        id
    ) {

        if (
            !window.confirm(
                "¿Eliminar esta nota?"
            )
        ) return;


        const {
            error
        } = await supabase

            .from(
                "notas_maestros"
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


        setNotaVista(
            null
        );

        await cargarNotas();

    }


    /*==================================================
    ASISTENCIA DEL MES
    ==================================================*/

    const asistenciaMes =
        useMemo(() => {

            return asistencias.filter(
                registro => {

                    if (
                        !registro.fecha
                    ) {

                        return false;

                    }


                    const [
                        añoRegistro,
                        mesRegistro
                    ] =
                        registro.fecha
                            .split("-")
                            .map(Number);


                    return (
                        añoRegistro === añoActual
                        &&
                        mesRegistro === mes
                    );

                }
            );

        }, [
            asistencias,
            mes,
            añoActual
        ]);


    /*==================================================
    SOLO TARDANZAS Y FALTAS
    ==================================================*/

    const tardanzas =
        asistenciaMes.filter(

            registro =>
                registro.estatus
                === "tardanza"

        ).length;


    const faltas =
        asistenciaMes.filter(

            registro =>
                registro.estatus
                === "falta"

        ).length;


    /*==================================================
    GUARDIAS DEL MES
    ==================================================*/

    const guardiasMes =
        useMemo(() => {

            return guardias.filter(
                registro => {

                    if (
                        !registro.fecha
                    ) {

                        return false;

                    }


                    const [
                        añoRegistro,
                        mesRegistro
                    ] =
                        registro.fecha
                            .split("-")
                            .map(Number);


                    return (
                        añoRegistro === añoActual
                        &&
                        mesRegistro === mes
                    );

                }
            );

        }, [
            guardias,
            mes,
            añoActual
        ]);


    /*==================================================
    SOLO GUARDIAS NO CUMPLIDAS
    ==================================================*/

    const recreosNoCumplidos =
        guardiasMes.filter(

            registro =>
                registro.guardia_recreo
                === false

        ).length;


    const salidasNoCumplidas =
        guardiasMes.filter(

            registro =>
                registro.guardia_salida
                === false

        ).length;


    /*==================================================
    HISTORIAL DE INCIDENCIAS

    Solo aparece una fecha cuando:

    - hubo tardanza
    - hubo falta
    - no cumplió recreo
    - no cumplió salida
    ==================================================*/

    const historialIncidencias =
        useMemo(() => {

            const fechas =
                new Set();


            asistenciaMes.forEach(
                registro => {

                    if (
                        registro.estatus
                            === "tardanza"
                        ||
                        registro.estatus
                            === "falta"
                    ) {

                        fechas.add(
                            registro.fecha
                        );

                    }

                }
            );


            guardiasMes.forEach(
                registro => {

                    if (
                        registro.guardia_recreo
                            === false
                        ||
                        registro.guardia_salida
                            === false
                    ) {

                        fechas.add(
                            registro.fecha
                        );

                    }

                }
            );


            return Array
                .from(fechas)

                .sort(
                    (a, b) =>
                        b.localeCompare(a)
                )

                .map(fecha => ({

                    fecha,

                    asistencia:
                        asistenciaMes.find(
                            registro =>
                                registro.fecha
                                === fecha
                        )
                        || null,

                    guardia:
                        guardiasMes.find(
                            registro =>
                                registro.fecha
                                === fecha
                        )
                        || null

                }));

        }, [
            asistenciaMes,
            guardiasMes
        ]);


    /*==================================================
    CONTENIDO
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
                            pantallaVolver
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
                TARJETA MAESTRO
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
                                datosMaestro?.nombre
                            }{" "}

                            {
                                datosMaestro
                                    ?.apellido_paterno
                            }{" "}

                            {
                                datosMaestro
                                    ?.apellido_materno
                            }

                        </h2>


                        <div className="pa-card-extra">

                            <span>
                                Maestro
                            </span>

                            <div
                                className="pa-separador"
                            />

                            <span>

                                {
                                    datosMaestro?.grupo
                                    ||
                                    "Sin grupo"
                                }

                            </span>

                        </div>

                    </div>

                </div>


                {/*=====================================
                TOOLBAR
                =====================================*/}

                <div className="pa-toolbar pm-toolbar">


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

                        title="Asistencia"

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

                        title="Reportes"

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

                        title="Notas"

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
                        !soloLectura
                        &&
                        modulo !== "asistencia"
                        &&

                        <button

                            className="pa-add-btn"

                            onClick={() => {

                                if (
                                    modulo === "reportes"
                                ) {

                                    nuevoReporte();

                                }

                                else {

                                    nuevaNota();

                                }

                            }}

                        >

                            <FilePlus2 size={18}/>

                        </button>
                    }

                </div>


                {/*=====================================
                CUERPO
                =====================================*/}

                <div className="pa-module-body">


                    {/*==================================================
                    ASISTENCIA
                    ==================================================*/}

                    {
                        modulo === "asistencia"
                        &&

                        <>


                            {/* MES */}

                            <div className="pm-mes-selector">

                                <span>
                                    Resumen
                                </span>


                                <select

                                    value={mes}

                                    onChange={
                                        e =>
                                            setMes(
                                                Number(
                                                    e.target.value
                                                )
                                            )
                                    }

                                >

                                    {
                                        meses.map(
                                            (
                                                nombre,
                                                index
                                            ) => (

                                                <option

                                                    key={
                                                        index
                                                    }

                                                    value={
                                                        index + 1
                                                    }

                                                >

                                                    {
                                                        nombre
                                                    }

                                                </option>

                                            )
                                        )
                                    }

                                </select>

                            </div>


                            {/*=========================================
                            TARDANZAS Y FALTAS
                            =========================================*/}

                            <div className="pm-resumen pm-resumen-2">


                                <div className="pm-resumen-item tardanza">

                                    <Clock3
                                        size={21}
                                    />

                                    <strong>

                                        {tardanzas}

                                    </strong>

                                    <span>

                                        Tardanzas

                                    </span>

                                </div>


                                <div className="pm-resumen-item falta">

                                    <CircleX
                                        size={21}
                                    />

                                    <strong>

                                        {faltas}

                                    </strong>

                                    <span>

                                        Faltas

                                    </span>

                                </div>


                            </div>


                            {/*=========================================
                            GUARDIAS NO CUMPLIDAS
                            =========================================*/}

                            <div className="pm-guardia-resumen">


                                <div className="pm-guardia-resumen-card">

                                    <div className="pm-guardia-titulo">

                                        <Coffee
                                            size={18}
                                        />

                                        <span>
                                            Recreo
                                        </span>

                                    </div>


                                    <div className="pm-guardia-incumplidas">

                                        <strong>

                                            {
                                                recreosNoCumplidos
                                            }

                                        </strong>

                                        <span>

                                            No cumplidas

                                        </span>

                                    </div>

                                </div>


                                <div className="pm-guardia-resumen-card">

                                    <div className="pm-guardia-titulo">

                                        <LogOut
                                            size={18}
                                        />

                                        <span>
                                            Salida
                                        </span>

                                    </div>


                                    <div className="pm-guardia-incumplidas">

                                        <strong>

                                            {
                                                salidasNoCumplidas
                                            }

                                        </strong>

                                        <span>

                                            No cumplidas

                                        </span>

                                    </div>

                                </div>


                            </div>


                            {/*=========================================
                            HISTORIAL DE INCIDENCIAS
                            =========================================*/}

                            <div className="pm-subtitulo">

                                Historial de incidencias

                            </div>


                            {
                                historialIncidencias.length === 0

                                    ?

                                    <div className="pa-empty">

                                        No existen incidencias
                                        en este mes.

                                    </div>

                                    :

                                    historialIncidencias.map(
                                        item => {

                                            const registro =
                                                item.asistencia;

                                            const guardia =
                                                item.guardia;


                                            return (

                                                <div

                                                    key={
                                                        item.fecha
                                                    }

                                                    className="pm-dia-card"

                                                >


                                                    {/* FECHA */}

                                                    <div className="pm-dia-top">

                                                        <div className="pm-dia-fecha">

                                                            <strong>

                                                                {
                                                                    item.fecha
                                                                }

                                                            </strong>

                                                        </div>


                                                        {
                                                            registro?.estatus
                                                            === "tardanza"
                                                            &&

                                                            <span className="pm-estado tardanza">

                                                                Tardanza

                                                            </span>
                                                        }


                                                        {
                                                            registro?.estatus
                                                            === "falta"
                                                            &&

                                                            <span className="pm-estado falta">

                                                                Falta

                                                            </span>
                                                        }

                                                    </div>


                                                    {/* SUPLENTE */}

                                                    {
                                                        registro?.estatus
                                                        === "falta"
                                                        &&
                                                        registro?.suplente
                                                        &&

                                                        <div className="pm-suplente">

                                                            <UserCheck
                                                                size={15}
                                                            />

                                                            <span>

                                                                Suplente:{" "}

                                                                <strong>

                                                                    {
                                                                        registro.suplente
                                                                    }

                                                                </strong>

                                                            </span>

                                                        </div>
                                                    }


                                                    {/* RECREO */}

                                                    {
                                                        guardia?.guardia_recreo
                                                        === false
                                                        &&

                                                        <div className="pm-dia-guardias">

                                                            <div>

                                                                <Coffee
                                                                    size={15}
                                                                />

                                                                <span>

                                                                    Guardia de recreo

                                                                </span>

                                                                <strong className="no">

                                                                    No cumplió

                                                                </strong>

                                                            </div>


                                                            {
                                                                guardia
                                                                    ?.relevo_recreo
                                                                &&

                                                                <small>

                                                                    Relevo:{" "}

                                                                    {
                                                                        guardia.relevo_recreo
                                                                    }

                                                                </small>
                                                            }

                                                        </div>
                                                    }


                                                    {/* SALIDA */}

                                                    {
                                                        guardia?.guardia_salida
                                                        === false
                                                        &&

                                                        <div className="pm-dia-guardias">

                                                            <div>

                                                                <LogOut
                                                                    size={15}
                                                                />

                                                                <span>

                                                                    Guardia de salida

                                                                </span>

                                                                <strong className="no">

                                                                    No cumplió

                                                                </strong>

                                                            </div>


                                                            {
                                                                guardia
                                                                    ?.relevo_salida
                                                                &&

                                                                <small>

                                                                    Relevo:{" "}

                                                                    {
                                                                        guardia.relevo_salida
                                                                    }

                                                                </small>
                                                            }

                                                        </div>
                                                    }


                                                </div>

                                            );

                                        }
                                    )
                            }


                        </>
                    }


                    {/*==================================================
                    REPORTES
                    ==================================================*/}

                    {
                        modulo === "reportes"
                        &&

                        <>

                            {
                                reportes.length === 0

                                    ?

                                    <div className="pa-empty">

                                        No existen reportes
                                        registrados.

                                    </div>

                                    :

                                    reportes.map(
                                        reporte => (

                                            <div

                                                key={
                                                    reporte.id
                                                }

                                                className="pa-card reporte-card"

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

                        </>
                    }


                    {/*==================================================
                    NOTAS
                    ==================================================*/}

                    {
                        modulo === "notas"
                        &&

                        <>

                            {
                                notas.length === 0

                                    ?

                                    <div className="pa-empty">

                                        No existen notas
                                        registradas.

                                    </div>

                                    :

                                    notas.map(
                                        nota => (

                                            <div

                                                key={
                                                    nota.id
                                                }

                                                className="pa-card pa-note verde"

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
                                                                        .toLocaleDateString(
                                                                            "es-MX"
                                                                        )
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


            {/*==================================================
            MODAL NUEVO / EDITAR REPORTE
            ==================================================*/}

            {
                modalReporte
                &&

                <div

                    className="pm-modal-overlay"

                    onClick={() =>
                        setModalReporte(
                            false
                        )
                    }

                >

                    <div

                        className="pm-modal"

                        onClick={
                            e =>
                                e.stopPropagation()
                        }

                    >


                        <div className="pm-modal-header">

                            <div>

                                <h2>

                                    {
                                        reporteEditar
                                            ?
                                            "Editar reporte"
                                            :
                                            "Nuevo reporte"
                                    }

                                </h2>

                                <span>

                                    {
                                        datosMaestro?.nombre
                                    }{" "}

                                    {
                                        datosMaestro
                                            ?.apellido_paterno
                                    }

                                </span>

                            </div>


                            <button

                                type="button"

                                onClick={() => {

                                    setModalReporte(
                                        false
                                    );

                                    setReporteEditar(
                                        null
                                    );

                                }}

                            >

                                <X
                                    size={20}
                                />

                            </button>

                        </div>


                        <div className="pm-modal-body">

                            <label>
                                Fecha
                            </label>

                            <input

                                type="date"

                                value={
                                    formReporte.fecha
                                }

                                onChange={
                                    e =>
                                        setFormReporte({

                                            ...formReporte,

                                            fecha:
                                                e.target.value

                                        })
                                }

                            />


                            <label>
                                Tipo de reporte
                            </label>

                            <select

                                value={
                                    formReporte.tipo
                                }

                                onChange={
                                    e =>
                                        setFormReporte({

                                            ...formReporte,

                                            tipo:
                                                e.target.value

                                        })
                                }

                            >

                                <option value="Incidencia">
                                    Incidencia
                                </option>

                                <option value="Incumplimiento">
                                    Incumplimiento
                                </option>

                                <option value="Tardanza">
                                    Tardanza
                                </option>

                                <option value="Falta">
                                    Falta
                                </option>

                                <option value="Guardia">
                                    Guardia
                                </option>

                                <option value="Observación">
                                    Observación
                                </option>

                                <option value="Reconocimiento">
                                    Reconocimiento
                                </option>

                                <option value="Otro">
                                    Otro
                                </option>

                            </select>


                            <label>
                                Motivo
                            </label>

                            <textarea

                                rows={3}

                                value={
                                    formReporte.motivo
                                }

                                onChange={
                                    e =>
                                        setFormReporte({

                                            ...formReporte,

                                            motivo:
                                                e.target.value

                                        })
                                }

                            />


                            <label>
                                Observaciones
                            </label>

                            <textarea

                                rows={5}

                                value={
                                    formReporte.observaciones
                                }

                                onChange={
                                    e =>
                                        setFormReporte({

                                            ...formReporte,

                                            observaciones:
                                                e.target.value

                                        })
                                }

                            />

                        </div>


                        <div className="pm-modal-actions">

                            <button

                                type="button"

                                className="pm-btn-cancelar"

                                onClick={() => {

                                    setModalReporte(
                                        false
                                    );

                                    setReporteEditar(
                                        null
                                    );

                                }}

                            >

                                Cancelar

                            </button>


                            <button

                                type="button"

                                className="pm-btn-guardar"

                                onClick={
                                    guardarReporte
                                }

                            >

                                <Save
                                    size={17}
                                />

                                Guardar

                            </button>

                        </div>


                    </div>

                </div>
            }


            {/*==================================================
            MODAL NUEVA / EDITAR NOTA
            ==================================================*/}

            {
                modalNota
                &&

                <div

                    className="pm-modal-overlay"

                    onClick={() =>
                        setModalNota(
                            false
                        )
                    }

                >

                    <div

                        className="pm-modal"

                        onClick={
                            e =>
                                e.stopPropagation()
                        }

                    >


                        <div className="pm-modal-header">

                            <div>

                                <h2>

                                    {
                                        notaEditar
                                            ?
                                            "Editar nota"
                                            :
                                            "Nueva nota"
                                    }

                                </h2>

                                <span>

                                    {
                                        datosMaestro?.nombre
                                    }{" "}

                                    {
                                        datosMaestro
                                            ?.apellido_paterno
                                    }

                                </span>

                            </div>


                            <button

                                type="button"

                                onClick={() => {

                                    setModalNota(
                                        false
                                    );

                                    setNotaEditar(
                                        null
                                    );

                                }}

                            >

                                <X
                                    size={20}
                                />

                            </button>

                        </div>


                        <div className="pm-modal-body">

                            <label>
                                Título
                            </label>

                            <input

                                type="text"

                                placeholder="Título de la nota"

                                value={
                                    formNota.titulo
                                }

                                onChange={
                                    e =>
                                        setFormNota({

                                            ...formNota,

                                            titulo:
                                                e.target.value

                                        })
                                }

                            />


                            <label>
                                Nota
                            </label>

                            <textarea

                                rows={8}

                                placeholder="Escribe la nota..."

                                value={
                                    formNota.nota
                                }

                                onChange={
                                    e =>
                                        setFormNota({

                                            ...formNota,

                                            nota:
                                                e.target.value

                                        })
                                }

                            />

                        </div>


                        <div className="pm-modal-actions">

                            <button

                                type="button"

                                className="pm-btn-cancelar"

                                onClick={() => {

                                    setModalNota(
                                        false
                                    );

                                    setNotaEditar(
                                        null
                                    );

                                }}

                            >

                                Cancelar

                            </button>


                            <button

                                type="button"

                                className="pm-btn-guardar"

                                onClick={
                                    guardarNota
                                }

                            >

                                <Save
                                    size={17}
                                />

                                Guardar

                            </button>

                        </div>


                    </div>

                </div>
            }


            {/*==================================================
            DETALLE REPORTE
            ==================================================*/}

            {
                reporteVista
                &&

                <div

                    className="pm-modal-overlay"

                    onClick={() =>
                        setReporteVista(
                            null
                        )
                    }

                >

                    <div

                        className="pm-modal pm-modal-detalle"

                        onClick={
                            e =>
                                e.stopPropagation()
                        }

                    >


                        <div className="pm-modal-header">

                            <div>

                                <h2>

                                    {
                                        reporteVista.tipo
                                    }

                                </h2>

                                <span>

                                    Reporte del maestro

                                </span>

                            </div>


                            <button

                                type="button"

                                onClick={() =>
                                    setReporteVista(
                                        null
                                    )
                                }

                            >

                                <X
                                    size={20}
                                />

                            </button>

                        </div>


                        <div className="pm-modal-body">

                            <div className="pm-detalle-item">

                                <span>
                                    Fecha
                                </span>

                                <strong>

                                    {
                                        reporteVista.fecha
                                    }

                                </strong>

                            </div>


                            <div className="pm-detalle-block">

                                <span>
                                    Motivo
                                </span>

                                <p>

                                    {
                                        reporteVista.motivo
                                        ||
                                        "Sin información"
                                    }

                                </p>

                            </div>


                            {
                                reporteVista.observaciones
                                &&

                                <div className="pm-detalle-block">

                                    <span>
                                        Observaciones
                                    </span>

                                    <p>

                                        {
                                            reporteVista
                                                .observaciones
                                        }

                                    </p>

                                </div>
                            }

                        </div>


                        <div className="pm-modal-actions">

                        {
                            soloLectura

                            ?

                            <button

                                type="button"

                                className="pm-btn-guardar pm-btn-cerrar-completo"

                                onClick={() =>
                                    setReporteVista(null)
                                }

                            >

                                Cerrar

                            </button>

                            :

                            <>

                                <button

                                    type="button"

                                    className="pm-btn-eliminar"

                                    onClick={() =>
                                        eliminarReporte(
                                            reporteVista.id
                                        )
                                    }

                                >

                                    <Trash2 size={16}/>

                                    Eliminar

                                </button>


                                <button

                                    type="button"

                                    className="pm-btn-guardar"

                                    onClick={() => {

                                        const reporte =
                                            reporteVista;

                                        setReporteVista(
                                            null
                                        );

                                        editarReporte(
                                            reporte
                                        );

                                    }}

                                >

                                    <Pencil size={16}/>

                                    Editar

                                </button>

                            </>
                        }

                    </div>


                    </div>

                </div>
            }


            {/*==================================================
            DETALLE NOTA
            ==================================================*/}

            {
                notaVista
                &&

                <div

                    className="pm-modal-overlay"

                    onClick={() =>
                        setNotaVista(
                            null
                        )
                    }

                >

                    <div

                        className="pm-modal pm-modal-detalle"

                        onClick={
                            e =>
                                e.stopPropagation()
                        }

                    >


                        <div className="pm-modal-header">

                            <div>

                                <h2>

                                    {
                                        notaVista.titulo
                                    }

                                </h2>

                                <span>

                                    Nota del maestro

                                </span>

                            </div>


                            <button

                                type="button"

                                onClick={() =>
                                    setNotaVista(
                                        null
                                    )
                                }

                            >

                                <X
                                    size={20}
                                />

                            </button>

                        </div>


                        <div className="pm-modal-body">

                            <div className="pm-detalle-block">

                                <span>
                                    Contenido
                                </span>

                                <p>

                                    {
                                        notaVista.nota
                                    }

                                </p>

                            </div>


                            {
                                notaVista.created_at
                                &&

                                <div className="pm-detalle-item">

                                    <span>
                                        Fecha
                                    </span>

                                    <strong>

                                        {
                                            new Date(
                                                notaVista.created_at
                                            )
                                                .toLocaleString(
                                                    "es-MX"
                                                )
                                        }

                                    </strong>

                                </div>
                            }

                        </div>


                        <div className="pm-modal-actions">

                            <button

                                type="button"

                                className="pm-btn-eliminar"

                                onClick={() =>
                                    eliminarNota(
                                        notaVista.id
                                    )
                                }

                            >

                                <Trash2
                                    size={16}
                                />

                                Eliminar

                            </button>


                            <button

                                type="button"

                                className="pm-btn-guardar"

                                onClick={() => {

                                    const nota =
                                        notaVista;

                                    setNotaVista(
                                        null
                                    );

                                    editarNota(
                                        nota
                                    );

                                }}

                            >

                                <Pencil
                                    size={16}
                                />

                                Editar

                            </button>

                        </div>


                    </div>

                </div>
            }


        </>

    );

}