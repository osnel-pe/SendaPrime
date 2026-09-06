import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    Bell,
    Clock3,
    X,
    UserRound,
    Check,
    TriangleAlert,
    CircleX,
    FileWarning,
    Coffee,
    LogOut,
    GraduationCap
} from "lucide-react";

import { createPortal }
from "react-dom";

import {
    activarPushPrefectura
} from "../../utils/pushNotifications";

import { supabase }
from "../../services/supabase";

import {
    sincronizarNotificacionesPrefectura
} from "../../utils/notificacionesPrefectura";

import "../../Styles/NotificacionesPrefectura.css";


export default function NotificacionesPrefectura({

    abierto,

    cerrar,

    actualizarContador

}) {

    const [
        notificaciones,
        setNotificaciones
    ] = useState([]);

    const [
        cargando,
        setCargando
    ] = useState(false);

    const [
        activandoPush,
        setActivandoPush
    ] = useState(false);

    const [
        pushActivo,
        setPushActivo
    ] = useState(false);


    /*==================================================
    ABRIR
    ==================================================*/

    useEffect(() => {

        if (!abierto) return;

        preparar();

    }, [abierto]);

    useEffect(() => {

    function actualizarPanel() {

        if (!abierto) {

            return;

        }

        cargarNotificaciones();

    }

    window.addEventListener(
        "prefectura-actualizada",
        actualizarPanel
    );

    return () => {

        window.removeEventListener(
            "prefectura-actualizada",
            actualizarPanel
        );

    };

}, [abierto]);

    async function activarNotificacionesTelefono() {

    try {

        setActivandoPush(true);

        await activarPushPrefectura();

        setPushActivo(true);

    }

    catch (error) {

        console.log(error);

        alert(
            error.message
        );

    }

    finally {

        setActivandoPush(false);

    }

}


    async function preparar() {

    setCargando(true);


    console.log(
        "Reconstruyendo historial de notificaciones..."
    );


    await sincronizarNotificacionesPrefectura({

        historico: true

    });


    console.log(
        "Cargando historial..."
    );


    await cargarNotificaciones();


    setCargando(false);


    actualizarContador?.();

}


    /*==================================================
    CARGAR HISTORIAL
    ==================================================*/

    async function comprobarPushActivo() {

    if (
        !("serviceWorker" in navigator)
        ||
        !("PushManager" in window)
    ) {

        setPushActivo(false);

        return;

    }

    try {

        const registro =
            await navigator
                .serviceWorker
                .ready;

        const suscripcion =
            await registro
                .pushManager
                .getSubscription();

        setPushActivo(
            !!suscripcion
        );

    }

    catch (error) {

        console.log(
            "Error comprobando Push:",
            error
        );

        setPushActivo(false);

    }

}

    async function cargarNotificaciones() {

        const {
            data,
            error
        } = await supabase

            .from(
                "notificaciones_prefectura"
            )

            .select("*")

            .order(
                "fecha_evento",
                {
                    ascending: false,
                    nullsFirst: false
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
                "Error cargando notificaciones:",
                error
            );

            return;

        }


        const lista =
            data || [];


        /*==========================================
        IDS DE ALUMNOS
        ==========================================*/

        const alumnosIds = [

            ...new Set(

                lista
                    .filter(
                        n =>
                            n.alumno_id
                    )
                    .map(
                        n =>
                            n.alumno_id
                    )

            )

        ];


        /*==========================================
        IDS DE MAESTROS
        ==========================================*/

        const maestrosIds = [

            ...new Set(

                lista
                    .filter(
                        n =>
                            n.maestro_id
                    )
                    .map(
                        n =>
                            String(
                                n.maestro_id
                            )
                    )

            )

        ];


        let alumnos = [];

        let maestros = [];


        if (
            alumnosIds.length > 0
        ) {

            const {
                data: datosAlumnos,
                error: errorAlumnos
            } = await supabase

                .from("alumnos")

                .select(`
                    id,
                    nombre,
                    apellido_paterno,
                    apellido_materno,
                    grupo
                `)

                .in(
                    "id",
                    alumnosIds
                );


            if (errorAlumnos) {

                console.log(
                    errorAlumnos
                );

            }

            else {

                alumnos =
                    datosAlumnos || [];

            }

        }


        /*
        maestro_id está guardado como texto,
        por lo que cargamos maestros y después
        relacionamos por String(id).
        */

        if (
            maestrosIds.length > 0
        ) {

            const {
                data: datosMaestros,
                error: errorMaestros
            } = await supabase

                .from("maestros")

                .select("*");


            if (errorMaestros) {

                console.log(
                    errorMaestros
                );

            }

            else {

                maestros =
                    (datosMaestros || [])
                        .filter(
                            maestro =>
                                maestrosIds.includes(
                                    String(
                                        maestro.id
                                    )
                                )
                        );

            }

        }


        const mapaAlumnos = {};

        alumnos.forEach(
            alumno => {

                mapaAlumnos[
                    String(
                        alumno.id
                    )
                ] = alumno;

            }
        );


        const mapaMaestros = {};

        maestros.forEach(
            maestro => {

                mapaMaestros[
                    String(
                        maestro.id
                    )
                ] = maestro;

            }
        );


        setNotificaciones(

            lista.map(
                notificacion => ({

                    ...notificacion,

                    alumno:
                        notificacion.alumno_id
                            ?
                            mapaAlumnos[
                                String(
                                    notificacion.alumno_id
                                )
                            ]
                            :
                            null,

                    maestro:
                        notificacion.maestro_id
                            ?
                            mapaMaestros[
                                String(
                                    notificacion.maestro_id
                                )
                            ]
                            :
                            null

                })
            )

        );

    }


    /*==================================================
    MARCAR ATENDIDA
    ==================================================*/

    async function marcarAtendida(
        id
    ) {

        const fecha =
            new Date()
                .toISOString();


        const {
            error
        } = await supabase

            .from(
                "notificaciones_prefectura"
            )

            .update({

                atendida:
                    true,

                atendida_at:
                    fecha

            })

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


        setNotificaciones(
            actuales =>
                actuales.map(
                    notificacion =>

                        notificacion.id === id

                            ?

                            {
                                ...notificacion,

                                atendida:
                                    true,

                                atendida_at:
                                    fecha
                            }

                            :

                            notificacion
                )
        );


        actualizarContador?.();

    }


    /*==================================================
    FECHAS
    ==================================================*/

    function obtenerFechaNotificacion(
        notificacion
    ) {

        return (
            notificacion.fecha_evento
            ||
            notificacion.created_at
        );

    }


    function tituloFecha(
        fecha
    ) {

        if (!fecha) {

            return "Sin fecha";

        }


        /*
        Evitamos problemas de timezone
        con columnas DATE.
        */

        const soloFecha =
            String(fecha)
                .slice(0, 10);


        const [
            anio,
            mes,
            dia
        ] =
            soloFecha
                .split("-")
                .map(Number);


        const fechaNotificacion =
            new Date(
                anio,
                mes - 1,
                dia
            );


        const hoy =
            new Date();


        const ayer =
            new Date();

        ayer.setDate(
            hoy.getDate() - 1
        );


        function mismaFecha(
            a,
            b
        ) {

            return (

                a.getFullYear()
                === b.getFullYear()

                &&

                a.getMonth()
                === b.getMonth()

                &&

                a.getDate()
                === b.getDate()

            );

        }


        if (
            mismaFecha(
                fechaNotificacion,
                hoy
            )
        ) {

            return "Hoy";

        }


        if (
            mismaFecha(
                fechaNotificacion,
                ayer
            )
        ) {

            return "Ayer";

        }


        return fechaNotificacion
            .toLocaleDateString(
                "es-MX",
                {
                    day:
                        "2-digit",

                    month:
                        "long",

                    year:
                        fechaNotificacion
                            .getFullYear()
                        !==
                        hoy.getFullYear()

                            ?

                            "numeric"

                            :

                            undefined
                }
            );

    }


    /*==================================================
    AGRUPAR POR FECHA
    ==================================================*/

    const grupos =
        useMemo(() => {

            const resultado = [];


            notificaciones.forEach(
                notificacion => {

                    const fecha =
                        obtenerFechaNotificacion(
                            notificacion
                        );


                    const clave =
                        String(fecha)
                            .slice(0, 10);


                    let grupo =
                        resultado.find(
                            item =>
                                item.clave === clave
                        );


                    if (!grupo) {

                        grupo = {

                            clave,

                            titulo:
                                tituloFecha(
                                    fecha
                                ),

                            notificaciones:
                                []

                        };


                        resultado.push(
                            grupo
                        );

                    }


                    grupo.notificaciones.push(
                        notificacion
                    );

                }
            );


            return resultado;

        }, [notificaciones]);


    /*==================================================
    DATOS VISUALES
    ==================================================*/

    function obtenerDatos(
        notificacion
    ) {

        const cantidad =
            notificacion.cantidad
            ||
            notificacion.tardanzas
            ||
            0;


        switch (
            notificacion.tipo
        ) {

            /*------------------------------------------
            TARDANZAS ALUMNO
            ------------------------------------------*/

            case "tardanza_2":
            case "alumno_tardanza_2":

                return {

                    icono:
                        Clock3,

                    urgente:
                        false,

                    titulo:
                        "Avisar al tutor",

                    mensaje:
                        "2 tardanzas. La próxima impedirá el ingreso al salón.",

                    badge:
                        "2 tardanzas"

                };


            case "tardanza_3":
            case "alumno_tardanza_reincidente":

                return {

                    icono:
                        TriangleAlert,

                    urgente:
                        true,

                    titulo:
                        "No ingresa al salón",

                    mensaje:
                        `${cantidad} tardanzas acumuladas este mes.`,

                    badge:
                        `${cantidad} tardanzas`

                };


            /*------------------------------------------
            AUSENCIAS ALUMNO
            ------------------------------------------*/

            case "alumno_ausencia_2":

                return {

                    icono:
                        CircleX,

                    urgente:
                        true,

                    titulo:
                        "Alumno reincidente",

                    mensaje:
                        "2 ausencias acumuladas este mes.",

                    badge:
                        "2 ausencias"

                };


            case "alumno_ausencia_reincidente":

                return {

                    icono:
                        CircleX,

                    urgente:
                        true,

                    titulo:
                        "Nueva ausencia",

                    mensaje:
                        `${cantidad} ausencias acumuladas.`,

                    badge:
                        `${cantidad} ausencias`

                };


            case "alumno_reincidente_reporte":

                return {

                    icono:
                        FileWarning,

                    urgente:
                        true,

                    titulo:
                        "Nuevo reporte (alumno reincidente)",

                    mensaje:
                        "Este alumno alcanzó el criterio de reincidencia por ausencias y acaba de recibir un nuevo reporte",

                    badge:
                        "Reporte"

                };


            /*------------------------------------------
            FALTAS MAESTRO
            ------------------------------------------*/

            case "maestro_falta_2":

                return {

                    icono:
                        CircleX,

                    urgente:
                        true,

                    titulo:
                        "Maestro reincidente",

                    mensaje:
                        "2 faltas acumuladas este mes.",

                    badge:
                        "2 faltas"

                };


            case "maestro_falta_reincidente":

                return {

                    icono:
                        CircleX,

                    urgente:
                        true,

                    titulo:
                        "Nueva falta de maestro reincidente",

                    mensaje:
                        `El maestro acumula ${cantidad} faltas durante este mes.`,

                    badge:
                        `${cantidad} faltas`

                };


            /*------------------------------------------
            RECREO
            ------------------------------------------*/

            case "maestro_recreo_2":

                return {

                    icono:
                        Coffee,

                    urgente:
                        true,

                    titulo:
                        "Guardia de recreo",

                    mensaje:
                        "2 incumplimientos este mes.",

                    badge:
                        "2 incumplimientos"

                };


            case "maestro_recreo_reincidente":

                return {

                    icono:
                        Coffee,

                    urgente:
                        true,

                    titulo:
                        "Nuevo incumplimiento de recreo",

                    mensaje:
                        `El maestro acumula ${cantidad} incumplimientos de guardia de recreo este mes.`,

                    badge:
                        `${cantidad} recreos`

                };


            /*------------------------------------------
            SALIDA
            ------------------------------------------*/

            case "maestro_salida_2":

                return {

                    icono:
                        LogOut,

                    urgente:
                        true,

                    titulo:
                        "Incumplimiento reincidente de guardia",

                    mensaje:
                        "El maestro acumula 2 incumplimientos de guardia de salida este mes. Los días en los que faltó no se contabilizan.",

                    badge:
                        "2 salidas"

                };


            case "maestro_salida_reincidente":

                return {

                    icono:
                        LogOut,

                    urgente:
                        true,

                    titulo:
                        "Nuevo incumplimiento de salida",

                    mensaje:
                        `El maestro acumula ${cantidad} incumplimientos de guardia de salida este mes.`,

                    badge:
                        `${cantidad} salidas`

                };


            default:

                return {

                    icono:
                        Bell,

                    urgente:
                        false,

                    titulo:
                        "Notificación",

                    mensaje:
                        "Existe una nueva alerta que requiere revisión.",

                    badge:
                        "Alerta"

                };

        }

    }


    const pendientes =
        notificaciones.filter(
            notificacion =>
                !notificacion.atendida
        ).length;


    if (!abierto) {

        return null;

    }


    /*==================================================
    JSX
    ==================================================*/

    return createPortal(

    <div

        className="notif-overlay"

        onClick={cerrar}

    >

        <div

            className="notif-panel"

            onClick={e =>
                e.stopPropagation()
            }

        >


                {/* HEADER */}

                <div className="notif-header">


                    <div className="notif-header-left">


                        <div className="notif-header-icon">

                            <Bell
                                size={21}
                            />

                        </div>


                        <div>

                            <h2>
                                Notificaciones
                            </h2>

                            <span>

                                Centro de alertas de Prefectura

                            </span>

                        </div>

                    </div>


                    <button

                        type="button"

                        className="notif-close"

                        onClick={
                            cerrar
                        }

                    >

                        <X
                            size={20}
                        />

                    </button>


                </div>

                {
                    !pushActivo
                    &&

                    <button

                        type="button"

                        className="notif-activar-push"

                        onClick={
                            activarNotificacionesTelefono
                        }

                        disabled={
                            activandoPush
                        }

                    >

                        <Bell size={16}/>

                        {
                            activandoPush
                                ?
                                "Activando..."
                                :
                                "Activar notificaciones del teléfono"
                        }

                    </button>
                }


                {/* CONTENT */}

                <div className="notif-content">


                    {
                        cargando

                            ?

                            <div className="notif-vacio">

                                Revisando alertas...

                            </div>

                            :

                            notificaciones.length === 0

                                ?

                                <div className="notif-vacio">


                                    <div className="notif-vacio-icon">

                                        <Bell
                                            size={28}
                                        />

                                    </div>


                                    <strong>

                                        Sin notificaciones

                                    </strong>


                                    <span>

                                        No existen alertas registradas.

                                    </span>


                                </div>

                                :

                                <>


                                    <div className="notif-resumen">

                                        <strong>

                                            {
                                                pendientes
                                            }

                                        </strong>

                                        <span>

                                            {
                                                pendientes === 1
                                                    ?
                                                    "alerta pendiente"
                                                    :
                                                    "alertas pendientes"
                                            }

                                        </span>

                                    </div>


                                    {
                                        grupos.map(
                                            grupo => (

                                                <section

                                                    key={
                                                        grupo.clave
                                                    }

                                                    className="notif-dia"

                                                >


                                                    <div className="notif-dia-titulo">

                                                        {
                                                            grupo.titulo
                                                        }

                                                    </div>


                                                    {
                                                        grupo.notificaciones.map(
                                                            notificacion => {

                                                                const datos =
                                                                    obtenerDatos(
                                                                        notificacion
                                                                    );


                                                                const Icono =
                                                                    datos.icono;


                                                                const persona =
                                                                    notificacion.entidad_tipo
                                                                    === "maestro"

                                                                        ?

                                                                        notificacion.maestro

                                                                        :

                                                                        notificacion.alumno;


                                                                const nombre =
                                                                    persona

                                                                        ?

                                                                        `${persona.nombre || ""} ${persona.apellido_paterno || ""} ${persona.apellido_materno || ""}`

                                                                        :

                                                                        notificacion.entidad_tipo
                                                                        === "maestro"

                                                                            ?

                                                                            "Maestro"

                                                                            :

                                                                            "Alumno";


                                                                return (

                                                                    <article

                                                                        key={
                                                                            notificacion.id
                                                                        }

                                                                        className={

                                                                            datos.urgente

                                                                                ?

                                                                                "notif-card notif-card-urgente"

                                                                                :

                                                                                "notif-card"

                                                                        }

                                                                    >


                                                                        <div

                                                                            className={

                                                                                datos.urgente

                                                                                    ?

                                                                                    "notif-card-icon urgente"

                                                                                    :

                                                                                    "notif-card-icon"

                                                                            }

                                                                        >

                                                                            <Icono
                                                                                size={22}
                                                                            />

                                                                        </div>


                                                                        <div className="notif-card-info">


                                                                            <div className="notif-card-top">


                                                                                <div>

                                                                                    <h3>

                                                                                        {
                                                                                            nombre
                                                                                        }

                                                                                    </h3>


                                                                                    <span>

                                                                                        {
                                                                                            notificacion.entidad_tipo
                                                                                            === "maestro"

                                                                                                ?

                                                                                                (
                                                                                                    persona?.grupo
                                                                                                    ?
                                                                                                    `Maestro · ${persona.grupo}`
                                                                                                    :
                                                                                                    "Maestro"
                                                                                                )

                                                                                                :

                                                                                                (
                                                                                                    persona?.grupo
                                                                                                    ||
                                                                                                    "Alumno"
                                                                                                )
                                                                                        }

                                                                                    </span>

                                                                                </div>


                                                                                <div

                                                                                    className={

                                                                                        datos.urgente

                                                                                            ?

                                                                                            "notif-tardanzas urgente"

                                                                                            :

                                                                                            "notif-tardanzas"

                                                                                    }

                                                                                >

                                                                                    {
                                                                                        datos.badge
                                                                                    }

                                                                                </div>


                                                                            </div>


                                                                            <div

                                                                                className={

                                                                                    datos.urgente

                                                                                        ?

                                                                                        "notif-mensaje urgente"

                                                                                        :

                                                                                        "notif-mensaje"

                                                                                }

                                                                            >

                                                                                <strong>

                                                                                    {
                                                                                        datos.titulo
                                                                                    }

                                                                                </strong>


                                                                                <p>

                                                                                    {
                                                                                        datos.mensaje
                                                                                    }

                                                                                </p>

                                                                            </div>


                                                                            {
                                                                                notificacion.atendida

                                                                                    ?

                                                                                    <div className="notif-atendida-estado">

                                                                                        <Check
                                                                                            size={15}
                                                                                        />

                                                                                        Atendida

                                                                                    </div>

                                                                                    :

                                                                                    <button

                                                                                        type="button"

                                                                                        className="notif-atendida-btn"

                                                                                        onClick={() =>
                                                                                            marcarAtendida(
                                                                                                notificacion.id
                                                                                            )
                                                                                        }

                                                                                    >

                                                                                        <Check
                                                                                            size={16}
                                                                                        />

                                                                                        Marcar como atendida

                                                                                    </button>
                                                                            }


                                                                        </div>


                                                                    </article>

                                                                );

                                                            }
                                                        )
                                                    }


                                                </section>

                                            )
                                        )
                                    }


                                </>
                    }


                </div>


            </div>

    </div>,

    document.body

);

}