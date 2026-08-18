import {
    useEffect,
    useState
} from "react";

import {
    Bell,
    Clock3,
    X,
    UserRound,
    Check,
    TriangleAlert
} from "lucide-react";

import { supabase }
from "../../services/supabase";

import "../../Styles/NotificacionesPrefectura.css";


export default function NotificacionesPrefectura({

    abierto,

    cerrar,

    actualizarContador

}) {

    /*==================================================
    ESTADOS
    ==================================================*/

    const [
        notificaciones,
        setNotificaciones
    ] = useState([]);

    const [
        cargando,
        setCargando
    ] = useState(true);


    /*==================================================
    EFECTO AL ABRIR
    ==================================================*/

    useEffect(() => {

        if (!abierto) return;

        prepararNotificaciones();

    }, [abierto]);


    /*==================================================
    PREPARAR
    ==================================================*/

    async function prepararNotificaciones() {

        setCargando(true);


        /*
        1. Revisamos las tardanzas del mes actual
        y creamos las alertas nuevas necesarias.
        */

        await generarAlertasTardanzas();


        /*
        2. Cargamos TODO el historial,
        incluyendo meses anteriores.
        */

        await cargarNotificaciones();


        /*
        3. Como la prefecta ya abrió
        la pantalla, las nuevas del mes
        actual pasan a estar vistas.
        */

        await marcarComoVistas();


        setCargando(false);

    }


    /*==================================================
    GENERAR ALERTAS AUTOMÁTICAS
    ==================================================*/

    async function generarAlertasTardanzas() {

        const hoy = new Date();

        const anio =
            hoy.getFullYear();

        const numeroMes =
            hoy.getMonth() + 1;

        const mesTexto =
            String(
                numeroMes
            ).padStart(2, "0");


        const ultimoDia =
            new Date(
                anio,
                numeroMes,
                0
            ).getDate();


        const inicio =
            `${anio}-${mesTexto}-01`;

        const fin =
            `${anio}-${mesTexto}-${String(
                ultimoDia
            ).padStart(2, "0")}`;


        const {
            data,
            error
        } = await supabase

            .from(
                "asistencia_prefectura"
            )

            .select(`
                alumno_id,
                estatus,
                fecha
            `)

            .eq(
                "estatus",
                "tardanza"
            )

            .gte(
                "fecha",
                inicio
            )

            .lte(
                "fecha",
                fin
            );


        if (error) {

            console.log(
                "Error leyendo tardanzas:",
                error
            );

            return;

        }


        const contador = {};


        (data || []).forEach(
            registro => {

                contador[
                    registro.alumno_id
                ] =
                    (
                        contador[
                            registro.alumno_id
                        ]
                        || 0
                    ) + 1;

            }
        );


        /*==============================================
        CREAR ALERTAS
        ==============================================*/

        for (
            const alumnoId
            of Object.keys(contador)
        ) {

            const total =
                contador[alumnoId];


            /*
            SEGUNDA TARDANZA
            */

            if (total >= 2) {

                await crearNotificacionSiNoExiste({

                    alumnoId,

                    tipo:
                        "tardanza_2",

                    tardanzas:
                        2,

                    mes:
                        numeroMes,

                    anio

                });

            }


            /*
            TERCERA TARDANZA
            */

            if (total >= 3) {

                await crearNotificacionSiNoExiste({

                    alumnoId,

                    tipo:
                        "tardanza_3",

                    tardanzas:
                        3,

                    mes:
                        numeroMes,

                    anio

                });

            }

        }

    }


    /*==================================================
    CREAR NOTIFICACIÓN SI NO EXISTE
    ==================================================*/

    async function crearNotificacionSiNoExiste({

        alumnoId,

        tipo,

        tardanzas,

        mes,

        anio

    }) {

        const {
            data: existente,
            error: errorBuscar
        } = await supabase

            .from(
                "notificaciones_prefectura"
            )

            .select("id")

            .eq(
                "alumno_id",
                alumnoId
            )

            .eq(
                "tipo",
                tipo
            )

            .eq(
                "mes",
                mes
            )

            .eq(
                "anio",
                anio
            )

            .maybeSingle();


        if (errorBuscar) {

            console.log(
                "Error buscando notificación:",
                errorBuscar
            );

            return;

        }


        if (existente) {

            return;

        }


        const {
            error
        } = await supabase

            .from(
                "notificaciones_prefectura"
            )

            .insert({

                alumno_id:
                    alumnoId,

                tipo,

                tardanzas,

                mes,

                anio,

                atendida:
                    false,

                vista:
                    false

            });


        if (error) {

            console.log(
                "Error creando notificación:",
                error
            );

        }

    }


    /*==================================================
    CARGAR HISTORIAL COMPLETO
    ==================================================*/

    async function cargarNotificaciones() {

        /*
        IMPORTANTE:

        Aquí NO filtramos por mes/año.

        De esta manera siguen apareciendo
        también las notificaciones anteriores.
        */

        const {
            data,
            error
        } = await supabase

            .from(
                "notificaciones_prefectura"
            )

            .select("*")

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


        if (
            lista.length === 0
        ) {

            setNotificaciones([]);

            actualizarContador?.();

            return;

        }


        /*==============================================
        CARGAR ALUMNOS
        ==============================================*/

        const ids = [

            ...new Set(

                lista

                    .map(
                        n =>
                            n.alumno_id
                    )

                    .filter(Boolean)

            )

        ];


        if (
            ids.length === 0
        ) {

            setNotificaciones(
                lista
            );

            return;

        }


        const {
            data: alumnos,
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
                ids
            );


        if (errorAlumnos) {

            console.log(
                "Error cargando alumnos:",
                errorAlumnos
            );

            return;

        }


        const mapa = {};


        (alumnos || []).forEach(
            alumno => {

                mapa[
                    alumno.id
                ] = alumno;

            }
        );


        const resultado =
            lista.map(
                notificacion => ({

                    ...notificacion,

                    alumno:
                        mapa[
                            notificacion.alumno_id
                        ]
                        || null

                })
            );


        setNotificaciones(
            resultado
        );

    }


    /*==================================================
    MARCAR NUEVAS COMO VISTAS
    ==================================================*/

    async function marcarComoVistas() {

        const hoy =
            new Date();

        const mesActual =
            hoy.getMonth() + 1;

        const anioActual =
            hoy.getFullYear();


        const {
            error
        } = await supabase

            .from(
                "notificaciones_prefectura"
            )

            .update({

                vista:
                    true,

                vista_at:
                    new Date()
                        .toISOString()

            })

            .eq(
                "vista",
                false
            )

            .eq(
                "mes",
                mesActual
            )

            .eq(
                "anio",
                anioActual
            );


        if (error) {

            console.log(
                "Error marcando notificaciones como vistas:",
                error
            );

            return;

        }


        /*
        Actualizamos también localmente
        para no depender de otra consulta.
        */

        setNotificaciones(
            actuales =>
                actuales.map(
                    notificacion => {

                        if (
                            notificacion.mes === mesActual
                            &&
                            notificacion.anio === anioActual
                        ) {

                            return {

                                ...notificacion,

                                vista:
                                    true

                            };

                        }


                        return notificacion;

                    }
                )
        );


        actualizarContador?.();

    }


    /*==================================================
    MARCAR COMO ATENDIDA
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


        /*
        NO eliminamos la tarjeta.

        Solo cambia su estado.
        */

        setNotificaciones(
            actuales =>
                actuales.map(
                    notificacion => {

                        if (
                            notificacion.id
                            === id
                        ) {

                            return {

                                ...notificacion,

                                atendida:
                                    true,

                                atendida_at:
                                    fecha

                            };

                        }


                        return notificacion;

                    }
                )
        );


        actualizarContador?.();

    }


    /*==================================================
    TÍTULO DE LA FECHA
    ==================================================*/

    function tituloFecha(
        fecha
    ) {

        if (!fecha) {

            return "Sin fecha";

        }


        const fechaNotificacion =
            new Date(fecha);

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
    AGRUPAR POR DÍA
    ==================================================*/

    const notificacionesPorDia =
        notificaciones.reduce(
            (
                grupos,
                notificacion
            ) => {

                const titulo =
                    tituloFecha(
                        notificacion.created_at
                    );


                if (
                    !grupos[titulo]
                ) {

                    grupos[titulo] = [];

                }


                grupos[titulo].push(
                    notificacion
                );


                return grupos;

            },
            {}
        );


    /*==================================================
    CONTADOR DE PENDIENTES

    Este número NO es el badge rojo.

    Solo sirve para informar dentro
    de la pantalla cuántas siguen sin atender.
    ==================================================*/

    const pendientes =
        notificaciones.filter(
            n =>
                !n.atendida
        ).length;


    /*==================================================
    NO RENDERIZAR
    ==================================================*/

    if (!abierto) {

        return null;

    }


    /*==================================================
    JSX
    ==================================================*/

    return (

        <div

            className="notif-overlay"

            onClick={
                cerrar
            }

        >

            <div

                className="notif-panel"

                onClick={
                    e =>
                        e.stopPropagation()
                }

            >


                {/*=====================================
                HEADER
                =====================================*/}

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

                                Alertas de Prefectura

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


                {/*=====================================
                CONTENIDO
                =====================================*/}

                <div className="notif-content">


                    {
                        cargando

                            ?

                            <div className="notif-vacio">

                                Cargando...

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

                                        Cuando se genere una alerta,
                                        aparecerá aquí.

                                    </span>


                                </div>

                                :

                                <>


                                    {/*=================================
                                    RESUMEN
                                    =================================*/}

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

                                                    "pendiente de atender"

                                                    :

                                                    "pendientes de atender"
                                            }

                                        </span>

                                    </div>


                                    {/*=================================
                                    HISTORIAL AGRUPADO
                                    =================================*/}

                                    {
                                        Object.entries(
                                            notificacionesPorDia
                                        ).map(
                                            (
                                                [
                                                    dia,
                                                    lista
                                                ]
                                            ) => (

                                                <div

                                                    key={
                                                        dia
                                                    }

                                                    className="notif-dia"

                                                >


                                                    <div className="notif-dia-titulo">

                                                        {
                                                            dia
                                                        }

                                                    </div>


                                                    {
                                                        lista.map(
                                                            notificacion => {

                                                                const alumno =
                                                                    notificacion.alumno;


                                                                const esTercera =
                                                                    notificacion.tipo
                                                                    ===
                                                                    "tardanza_3";


                                                                return (

                                                                    <div

                                                                        key={
                                                                            notificacion.id
                                                                        }

                                                                        className={

                                                                            esTercera

                                                                                ?

                                                                                "notif-card notif-card-urgente"

                                                                                :

                                                                                "notif-card"

                                                                        }

                                                                    >


                                                                        {/*=============================
                                                                        ICONO
                                                                        =============================*/}

                                                                        <div

                                                                            className={

                                                                                esTercera

                                                                                    ?

                                                                                    "notif-card-icon urgente"

                                                                                    :

                                                                                    "notif-card-icon"

                                                                            }

                                                                        >

                                                                            {
                                                                                esTercera

                                                                                    ?

                                                                                    <TriangleAlert
                                                                                        size={22}
                                                                                    />

                                                                                    :

                                                                                    <UserRound
                                                                                        size={22}
                                                                                    />
                                                                            }

                                                                        </div>


                                                                        {/*=============================
                                                                        INFO
                                                                        =============================*/}

                                                                        <div className="notif-card-info">


                                                                            <div className="notif-card-top">


                                                                                <div>

                                                                                    <h3>

                                                                                        {
                                                                                            alumno?.nombre
                                                                                            ||
                                                                                            "Alumno"
                                                                                        }{" "}

                                                                                        {
                                                                                            alumno?.apellido_paterno
                                                                                            || ""
                                                                                        }{" "}

                                                                                        {
                                                                                            alumno?.apellido_materno
                                                                                            || ""
                                                                                        }

                                                                                    </h3>


                                                                                    <span>

                                                                                        {
                                                                                            alumno?.grupo
                                                                                            ||
                                                                                            "Sin grupo"
                                                                                        }

                                                                                    </span>

                                                                                </div>


                                                                                <div

                                                                                    className={

                                                                                        esTercera

                                                                                            ?

                                                                                            "notif-tardanzas urgente"

                                                                                            :

                                                                                            "notif-tardanzas"

                                                                                    }

                                                                                >

                                                                                    <Clock3
                                                                                        size={14}
                                                                                    />

                                                                                    {
                                                                                        notificacion.tardanzas
                                                                                    }

                                                                                </div>


                                                                            </div>


                                                                            {/*=========================
                                                                            MENSAJE
                                                                            =========================*/}

                                                                            {
                                                                                !esTercera

                                                                                    ?

                                                                                    <div className="notif-mensaje">

                                                                                        <strong>

                                                                                            Avisar al padre o tutor

                                                                                        </strong>


                                                                                        <p>

                                                                                            El alumno ha acumulado
                                                                                            2 tardanzas este mes.

                                                                                            Informe al padre o tutor
                                                                                            que, si vuelve a llegar
                                                                                            tarde, no podrá ingresar
                                                                                            a su salón de clases.

                                                                                        </p>

                                                                                    </div>

                                                                                    :

                                                                                    <div className="notif-mensaje urgente">

                                                                                        <strong>

                                                                                            Alerta: tercera tardanza

                                                                                        </strong>


                                                                                        <p>

                                                                                            El alumno ha acumulado
                                                                                            3 tardanzas durante este mes.

                                                                                            De acuerdo con la medida
                                                                                            establecida, no podrá ingresar
                                                                                            a su salón de clases.

                                                                                        </p>

                                                                                    </div>
                                                                            }


                                                                            {/*=========================
                                                                            ESTADO
                                                                            =========================*/}

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


                                                                    </div>

                                                                );

                                                            }
                                                        )
                                                    }


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

}