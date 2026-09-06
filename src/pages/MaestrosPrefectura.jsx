import {
    useEffect,
    useState
} from "react";

import { createPortal } from "react-dom";

import {
    UserRound,
    CheckCircle2,
    Clock3,
    CircleX,
    Coffee,
    LogOut,
    Save,
    UsersRound
} from "lucide-react";

import { supabase } from "../services/supabase";

import "../Styles/MaestrosPrefectura.css";


export default function MaestrosPrefectura() {

    /*==================================================
    ESTADOS
    ==================================================*/

    const [vista, setVista] =
        useState("lista");

    const [maestros, setMaestros] =
        useState([]);

    const [guardiasHorarioHoy, setGuardiasHorarioHoy] =
        useState([]);

    const [maestrosRecreoHoy, setMaestrosRecreoHoy] =
        useState([]);

    const [maestrosSalidaHoy, setMaestrosSalidaHoy] =
        useState([]);

    const [asistencia, setAsistencia] =
        useState({});

    const [recreo, setRecreo] =
        useState({});

    const [salida, setSalida] =
        useState({});

    const [cargando, setCargando] =
        useState(true);

    const [guardando, setGuardando] =
        useState(false);

    const [mensajeGuardado, setMensajeGuardado] =
        useState(false);


    /*==================================================
    FECHA Y DÍA
    ==================================================*/

    function obtenerFechaLocal() {

        const hoy = new Date();

        const anio =
            hoy.getFullYear();

        const mes =
            String(
                hoy.getMonth() + 1
            ).padStart(2, "0");

        const dia =
            String(
                hoy.getDate()
            ).padStart(2, "0");

        return `${anio}-${mes}-${dia}`;

    }


    function obtenerDiaSemanaActual() {

        const dias = [
            "domingo",
            "lunes",
            "martes",
            "miercoles",
            "jueves",
            "viernes",
            "sabado"
        ];

        return dias[
            new Date().getDay()
        ];

    }


    function nombreCompleto(
        maestro
    ) {

        return [
            maestro?.nombre,
            maestro?.apellido_paterno,
            maestro?.apellido_materno
        ]
            .filter(Boolean)
            .join(" ");

    }


    function mostrarGuardado() {

        setMensajeGuardado(true);

        setTimeout(
            () => {
                setMensajeGuardado(false);
            },
            2000
        );

    }


    /*==================================================
    HORARIO DE GUARDIAS DEL DÍA
    ==================================================*/

    async function cargarHorarioGuardiasHoy(
        listaMaestros
    ) {

        const dia =
            obtenerDiaSemanaActual();


        if (
            dia === "sabado"
            ||
            dia === "domingo"
        ) {

            setGuardiasHorarioHoy([]);
            setMaestrosRecreoHoy([]);
            setMaestrosSalidaHoy([]);

            return [];

        }


        const {
            data,
            error
        } = await supabase

            .from(
                "guardias_horario"
            )

            .select(`
                id,
                maestro_id,
                dia_semana,
                tipo_guardia,
                lugar,
                activo
            `)

            .eq(
                "dia_semana",
                dia
            )

            .eq(
                "activo",
                true
            );


        if (error) {

            console.log(
                "Error cargando horario de guardias:",
                error
            );

            setGuardiasHorarioHoy([]);
            setMaestrosRecreoHoy([]);
            setMaestrosSalidaHoy([]);

            return [];

        }


        const horarios =
            data || [];


        setGuardiasHorarioHoy(
            horarios
        );


        const idsRecreo =
            new Set(
                horarios

                    .filter(
                        guardia =>
                            guardia.tipo_guardia
                            === "recreo"
                    )

                    .map(
                        guardia =>
                            String(
                                guardia.maestro_id
                            )
                    )
            );


        const idsSalida =
            new Set(
                horarios

                    .filter(
                        guardia =>
                            guardia.tipo_guardia
                            === "salida"
                    )

                    .map(
                        guardia =>
                            String(
                                guardia.maestro_id
                            )
                    )
            );


        const listaRecreo =
            (listaMaestros || [])
                .filter(
                    maestro =>
                        idsRecreo.has(
                            String(
                                maestro.id
                            )
                        )
                );


        const listaSalida =
            (listaMaestros || [])
                .filter(
                    maestro =>
                        idsSalida.has(
                            String(
                                maestro.id
                            )
                        )
                );


        setMaestrosRecreoHoy(
            listaRecreo
        );

        setMaestrosSalidaHoy(
            listaSalida
        );


        return horarios;

    }


    function obtenerLugarGuardia(
        maestroId,
        tipo
    ) {

        return guardiasHorarioHoy

            .filter(
                guardia =>
                    String(
                        guardia.maestro_id
                    )
                    ===
                    String(
                        maestroId
                    )
                    &&
                    guardia.tipo_guardia
                    === tipo
            )

            .map(
                guardia =>
                    guardia.lugar
            )

            .filter(Boolean)

            .join(" · ");

    }


    /*==================================================
    CARGA INICIAL
    ==================================================*/

    useEffect(
        () => {

            cargarTodo();

        },
        []
    );


    async function cargarTodo() {

        setCargando(true);


        const fecha =
            obtenerFechaLocal();


        /*==============================================
        MAESTROS
        ==============================================*/

        const {
            data: maestrosData,
            error: maestrosError
        } = await supabase

            .from("maestros")

            .select("*")

            .eq(
                "activo",
                true
            )

            .order(
                "apellido_paterno",
                {
                    ascending: true,
                    nullsFirst: false
                }
            )

            .order(
                "apellido_materno",
                {
                    ascending: true,
                    nullsFirst: false
                }
            )

            .order(
                "nombre",
                {
                    ascending: true
                }
            );


        if (maestrosError) {

            console.log(
                "Error cargando maestros:",
                maestrosError
            );

            setCargando(false);

            return;

        }


        const listaMaestros =
            maestrosData || [];


        setMaestros(
            listaMaestros
        );


        const horariosHoy =
            await cargarHorarioGuardiasHoy(
                listaMaestros
            );


        const idsRecreoHoy =
            new Set(
                (horariosHoy || [])

                    .filter(
                        guardia =>
                            guardia.tipo_guardia
                            === "recreo"
                    )

                    .map(
                        guardia =>
                            String(
                                guardia.maestro_id
                            )
                    )
            );


        const idsSalidaHoy =
            new Set(
                (horariosHoy || [])

                    .filter(
                        guardia =>
                            guardia.tipo_guardia
                            === "salida"
                    )

                    .map(
                        guardia =>
                            String(
                                guardia.maestro_id
                            )
                    )
            );


        /*==============================================
        ASISTENCIA DE HOY
        ==============================================*/

        const {
            data: asistenciaData,
            error: asistenciaError
        } = await supabase

            .from(
                "asistencia_maestros"
            )

            .select("*")

            .eq(
                "fecha",
                fecha
            );


        if (asistenciaError) {

            console.log(
                "Error cargando asistencia:",
                asistenciaError
            );

        }


        /*==============================================
        GUARDIAS REGISTRADAS HOY
        ==============================================*/

        const {
            data: guardiasData,
            error: guardiasError
        } = await supabase

            .from(
                "guardias_maestros"
            )

            .select("*")

            .eq(
                "fecha",
                fecha
            );


        if (guardiasError) {

            console.log(
                "Error cargando guardias:",
                guardiasError
            );

        }


        /*==============================================
        MAPAS INICIALES
        ==============================================*/

        const asistenciaInicial = {};

        const recreoInicial = {};

        const salidaInicial = {};


        listaMaestros.forEach(
            maestro => {

                asistenciaInicial[
                    maestro.id
                ] = {

                    estatus: "",

                    suplente: ""

                };


                recreoInicial[
                    maestro.id
                ] = {

                    cumplio: null,

                    relevo: ""

                };


                salidaInicial[
                    maestro.id
                ] = {

                    cumplio: null,

                    relevo: ""

                };

            }
        );


        /*==============================================
        DATOS YA GUARDADOS DE ASISTENCIA
        ==============================================*/

        (asistenciaData || [])
            .forEach(
                registro => {

                    asistenciaInicial[
                        registro.maestro_id
                    ] = {

                        estatus:
                            registro.estatus,

                        suplente:
                            registro.suplente
                            || ""

                    };

                }
            );


        /*==============================================
        DATOS YA GUARDADOS DE GUARDIAS
        ==============================================*/

        (guardiasData || [])
            .forEach(
                registro => {

                    if (
                        registro.guardia_recreo
                        !== null
                    ) {

                        recreoInicial[
                            registro.maestro_id
                        ] = {

                            cumplio:
                                registro.guardia_recreo,

                            relevo:
                                registro.relevo_recreo
                                || ""

                        };

                    }


                    if (
                        registro.guardia_salida
                        !== null
                    ) {

                        salidaInicial[
                            registro.maestro_id
                        ] = {

                            cumplio:
                                registro.guardia_salida,

                            relevo:
                                registro.relevo_salida
                                || ""

                        };

                    }

                }
            );


        /*==============================================
SI FALTÓ, SOLO MARCAMOS "NO ESTÁ"
EN LAS GUARDIAS QUE REALMENTE TIENE HOY

autoPorFalta nos permite distinguir
entre:
- No está porque faltó todo el día.
- No está porque incumplió la guardia.
==============================================*/

(asistenciaData || [])
    .forEach(
        registro => {

            if (
                registro.estatus
                !== "falta"
            ) {

                return;

            }


            const maestroId =
                String(
                    registro.maestro_id
                );


            /*==========================================
            RECREO
            ==========================================*/

            if (
                idsRecreoHoy.has(
                    maestroId
                )
                &&
                recreoInicial[
                    registro.maestro_id
                ]?.cumplio
                === null
            ) {

                recreoInicial[
                    registro.maestro_id
                ] = {

                    ...recreoInicial[
                        registro.maestro_id
                    ],

                    cumplio:
                        false,

                    relevo:
                        "",

                    autoPorFalta:
                        true

                };

            }


            /*==========================================
            SALIDA
            ==========================================*/

            if (
                idsSalidaHoy.has(
                    maestroId
                )
                &&
                salidaInicial[
                    registro.maestro_id
                ]?.cumplio
                === null
            ) {

                salidaInicial[
                    registro.maestro_id
                ] = {

                    ...salidaInicial[
                        registro.maestro_id
                    ],

                    cumplio:
                        false,

                    relevo:
                        "",

                    autoPorFalta:
                        true

                };

            }

        }
    );


        setAsistencia(
            asistenciaInicial
        );

        setRecreo(
            recreoInicial
        );

        setSalida(
            salidaInicial
        );


        setCargando(false);

    }


    /*==================================================
    ASISTENCIA
    ==================================================*/

    function cambiarAsistencia(
    maestroId,
    estatus
) {

    /*==================================================
    ACTUALIZAR ASISTENCIA
    ==================================================*/

    setAsistencia(
        actual => ({

            ...actual,

            [maestroId]: {

                ...actual[
                    maestroId
                ],

                estatus,

                suplente:
                    estatus
                    === "falta"
                    ?
                    actual[
                        maestroId
                    ]?.suplente
                    || ""
                    :
                    ""

            }

        })
    );


    /*==================================================
    SABER QUÉ GUARDIAS TIENE HOY
    ==================================================*/

    const tieneRecreoHoy =
        guardiasHorarioHoy.some(
            guardia =>
                String(
                    guardia.maestro_id
                )
                ===
                String(
                    maestroId
                )
                &&
                guardia.tipo_guardia
                === "recreo"
        );


    const tieneSalidaHoy =
        guardiasHorarioHoy.some(
            guardia =>
                String(
                    guardia.maestro_id
                )
                ===
                String(
                    maestroId
                )
                &&
                guardia.tipo_guardia
                === "salida"
        );


    /*==================================================
    SI MARCAMOS FALTA

    Solo afectamos las guardias que realmente
    le corresponden hoy.
    ==================================================*/

    if (
        estatus === "falta"
    ) {

        if (
            tieneRecreoHoy
        ) {

            setRecreo(
                actual => ({

                    ...actual,

                    [maestroId]: {

                        ...actual[
                            maestroId
                        ],

                        cumplio:
                            false,

                        relevo:
                            "",

                        autoPorFalta:
                            true

                    }

                })
            );

        }


        if (
            tieneSalidaHoy
        ) {

            setSalida(
                actual => ({

                    ...actual,

                    [maestroId]: {

                        ...actual[
                            maestroId
                        ],

                        cumplio:
                            false,

                        relevo:
                            "",

                        autoPorFalta:
                            true

                    }

                })
            );

        }


        return;

    }


    /*==================================================
    SI CORREGIMOS LA FALTA

    Ejemplo:
    Faltó → Vino
    Faltó → Tarde

    Solo quitamos el "No está" si había sido
    puesto automáticamente por la falta.

    Si Prefectura había registrado manualmente
    un incumplimiento, NO lo tocamos.
    ==================================================*/

    if (
        tieneRecreoHoy
    ) {

        setRecreo(
            actual => {

                const registro =
                    actual[
                        maestroId
                    ];


                if (
                    !registro
                    ?.autoPorFalta
                ) {

                    return actual;

                }


                return {

                    ...actual,

                    [maestroId]: {

                        ...registro,

                        cumplio:
                            null,

                        relevo:
                            "",

                        autoPorFalta:
                            false

                    }

                };

            }
        );

    }


    if (
        tieneSalidaHoy
    ) {

        setSalida(
            actual => {

                const registro =
                    actual[
                        maestroId
                    ];


                if (
                    !registro
                    ?.autoPorFalta
                ) {

                    return actual;

                }


                return {

                    ...actual,

                    [maestroId]: {

                        ...registro,

                        cumplio:
                            null,

                        relevo:
                            "",

                        autoPorFalta:
                            false

                    }

                };

            }
        );

    }

}


    function cambiarSuplente(
        maestroId,
        valor
    ) {

        setAsistencia(
            actual => ({

                ...actual,

                [maestroId]: {

                    ...actual[
                        maestroId
                    ],

                    suplente:
                        valor

                }

            })
        );

    }


    /*==================================================
    RECREO
    ==================================================*/

    function cambiarRecreo(
        maestroId,
        cumplio
    ) {

        setRecreo(
            actual => ({

                ...actual,

                [maestroId]: {

                    ...actual[
                        maestroId
                    ],

                    cumplio,

                    relevo:
                        cumplio === false
                        ?
                        actual[
                            maestroId
                        ]?.relevo
                        || ""
                        :
                        ""

                }

            })
        );

    }


    function cambiarRelevoRecreo(
        maestroId,
        valor
    ) {

        setRecreo(
            actual => ({

                ...actual,

                [maestroId]: {

                    ...actual[
                        maestroId
                    ],

                    relevo:
                        valor

                }

            })
        );

    }


    /*==================================================
    SALIDA
    ==================================================*/

    function cambiarSalida(
        maestroId,
        cumplio
    ) {

        setSalida(
            actual => ({

                ...actual,

                [maestroId]: {

                    ...actual[
                        maestroId
                    ],

                    cumplio,

                    relevo:
                        cumplio === false
                        ?
                        actual[
                            maestroId
                        ]?.relevo
                        || ""
                        :
                        ""

                }

            })
        );

    }


    function cambiarRelevoSalida(
        maestroId,
        valor
    ) {

        setSalida(
            actual => ({

                ...actual,

                [maestroId]: {

                    ...actual[
                        maestroId
                    ],

                    relevo:
                        valor

                }

            })
        );

    }


    /*==================================================
    GUARDAR LISTA
    ==================================================*/

    async function guardarLista() {

        const fecha =
            obtenerFechaLocal();


        const incompletos =
            maestros.filter(
                maestro =>
                    !asistencia[
                        maestro.id
                    ]?.estatus
            );


        if (
            incompletos.length > 0
        ) {

            alert(
                `Falta registrar la asistencia de ${incompletos.length} maestro(s).`
            );

            return;

        }


        const faltasSinSuplente =
            maestros.filter(
                maestro => {

                    const registro =
                        asistencia[
                            maestro.id
                        ];


                    return (
                        registro?.estatus
                        === "falta"
                        &&
                        !registro
                            ?.suplente
                            ?.trim()
                    );

                }
            );


        if (
            faltasSinSuplente.length > 0
        ) {

            alert(
                "Los maestros que faltaron deben tener un suplente registrado."
            );

            return;

        }


        setGuardando(true);


        const registros =
            maestros.map(
                maestro => {

                    const registro =
                        asistencia[
                            maestro.id
                        ];


                    return {

                        maestro_id:
                            maestro.id,

                        fecha,

                        estatus:
                            registro.estatus,

                        suplente:
                            registro.estatus
                            === "falta"
                            ?
                            registro
                                .suplente
                                .trim()
                            :
                            null

                    };

                }
            );


        const {
            error
        } = await supabase

            .from(
                "asistencia_maestros"
            )

            .upsert(
                registros,
                {
                    onConflict:
                        "maestro_id,fecha"
                }
            );


        setGuardando(false);


        if (error) {

            alert(
                error.message
            );

            return;

        }


        mostrarGuardado();

    }


    /*==================================================
    GUARDAR UNA GUARDIA
    ==================================================*/

    async function guardarGuardia(
        tipo,
        listaMaestros,
        mapaGuardia
    ) {

        if (
            listaMaestros.length === 0
        ) {

            return;

        }


        const fecha =
            obtenerFechaLocal();


        const incompletos =
            listaMaestros.filter(
                maestro =>
                    mapaGuardia[
                        maestro.id
                    ]?.cumplio
                    === null
            );


        if (
            incompletos.length > 0
        ) {

            alert(
                `Falta registrar la guardia de ${tipo} de ${incompletos.length} maestro(s).`
            );

            return;

        }


        const sinRelevo =
            listaMaestros.filter(
                maestro => {

                    const registro =
                        mapaGuardia[
                            maestro.id
                        ];


                    return (
                        registro?.cumplio
                        === false
                        &&
                        !registro
                            ?.relevo
                            ?.trim()
                    );

                }
            );


        if (
            sinRelevo.length > 0
        ) {

            alert(
                "Cuando un maestro no está en su guardia debes indicar quién lo relevó."
            );

            return;

        }


        setGuardando(true);


        for (
            const maestro
            of listaMaestros
        ) {

            const registro =
                mapaGuardia[
                    maestro.id
                ];


            const {
                data: existente,
                error: errorBuscar
            } = await supabase

                .from(
                    "guardias_maestros"
                )

                .select("id")

                .eq(
                    "maestro_id",
                    maestro.id
                )

                .eq(
                    "fecha",
                    fecha
                )

                .maybeSingle();


            if (
                errorBuscar
            ) {

                setGuardando(false);

                alert(
                    errorBuscar.message
                );

                return;

            }


            const datos =
                tipo === "recreo"
                ?
                {
                    guardia_recreo:
                        registro.cumplio,

                    relevo_recreo:
                        registro.cumplio
                        === false
                        ?
                        registro
                            .relevo
                            .trim()
                        :
                        null
                }
                :
                {
                    guardia_salida:
                        registro.cumplio,

                    relevo_salida:
                        registro.cumplio
                        === false
                        ?
                        registro
                            .relevo
                            .trim()
                        :
                        null
                };


            let errorGuardar;


            if (
                existente
            ) {

                const {
                    error
                } = await supabase

                    .from(
                        "guardias_maestros"
                    )

                    .update(
                        datos
                    )

                    .eq(
                        "id",
                        existente.id
                    );


                errorGuardar =
                    error;

            }

            else {

                const {
                    error
                } = await supabase

                    .from(
                        "guardias_maestros"
                    )

                    .insert({

                        maestro_id:
                            maestro.id,

                        fecha,

                        ...datos

                    });


                errorGuardar =
                    error;

            }


            if (
                errorGuardar
            ) {

                setGuardando(false);

                alert(
                    errorGuardar.message
                );

                return;

            }

        }


        setGuardando(false);

        mostrarGuardado();

    }


    async function guardarRecreo() {

        await guardarGuardia(
            "recreo",
            maestrosRecreoHoy,
            recreo
        );

    }


    async function guardarSalida() {

        await guardarGuardia(
            "salida",
            maestrosSalidaHoy,
            salida
        );

    }


    /*==================================================
    ACCIONES RÁPIDAS
    ==================================================*/

    function marcarTodosPresentes() {

        const nuevo = {};


        maestros.forEach(
            maestro => {

                nuevo[
                    maestro.id
                ] = {

                    estatus:
                        "presente",

                    suplente:
                        ""

                };

            }
        );


        setAsistencia(
            nuevo
        );

    }


    function marcarTodosRecreo() {

        const nuevo = {
            ...recreo
        };


        maestrosRecreoHoy.forEach(
            maestro => {

                const falto =
                    asistencia[
                        maestro.id
                    ]?.estatus
                    === "falta";


                nuevo[
                    maestro.id
                ] = {

                    cumplio:
                        falto
                        ?
                        false
                        :
                        true,

                    relevo:
                        recreo[
                            maestro.id
                        ]?.relevo
                        || ""

                };

            }
        );


        setRecreo(
            nuevo
        );

    }


    function marcarTodosSalida() {

        const nuevo = {
            ...salida
        };


        maestrosSalidaHoy.forEach(
            maestro => {

                const falto =
                    asistencia[
                        maestro.id
                    ]?.estatus
                    === "falta";


                nuevo[
                    maestro.id
                ] = {

                    cumplio:
                        falto
                        ?
                        false
                        :
                        true,

                    relevo:
                        salida[
                            maestro.id
                        ]?.relevo
                        || ""

                };

            }
        );


        setSalida(
            nuevo
        );

    }


    function guardarActual() {

        if (
            vista === "lista"
        ) {

            guardarLista();

            return;

        }


        if (
            vista === "recreo"
        ) {

            guardarRecreo();

            return;

        }


        guardarSalida();

    }


    function obtenerCantidadVistaActual() {

        if (
            vista === "lista"
        ) {

            return maestros.length;

        }


        if (
            vista === "recreo"
        ) {

            return maestrosRecreoHoy.length;

        }


        return maestrosSalidaHoy.length;

    }


    function obtenerTextoVacioActual() {

        if (
            vista === "recreo"
        ) {

            return "No hay maestros con guardia de recreo asignada para hoy.";

        }


        if (
            vista === "salida"
        ) {

            return "No hay maestros con guardia de salida asignada para hoy.";

        }


        return "No existen maestros registrados.";

    }


    /*==================================================
    TARJETA DE ASISTENCIA
    ==================================================*/

    function renderTarjetaLista(
        maestro
    ) {

        const registro =
            asistencia[
                maestro.id
            ] || {};


        return (

            <div
                key={maestro.id}
                className="mp-card"
            >

                <div className="mp-maestro">

                    <div className="mp-avatar">

                        <UserRound
                            size={20}
                        />

                    </div>

                    <div className="mp-info">

                        <strong>
                            {nombreCompleto(maestro)}
                        </strong>

                        <span>
                            {
                                maestro.grupo
                                ||
                                "Sin grupo"
                            }
                        </span>

                    </div>

                </div>


                <div className="mp-opciones mp-opciones-3">

                    <button

                        className={
                            registro.estatus
                            === "presente"
                            ?
                            "mp-btn presente activo"
                            :
                            "mp-btn presente"
                        }

                        onClick={() =>
                            cambiarAsistencia(
                                maestro.id,
                                "presente"
                            )
                        }

                    >

                        <CheckCircle2
                            size={17}
                        />

                        Vino

                    </button>


                    <button

                        className={
                            registro.estatus
                            === "tardanza"
                            ?
                            "mp-btn tardanza activo"
                            :
                            "mp-btn tardanza"
                        }

                        onClick={() =>
                            cambiarAsistencia(
                                maestro.id,
                                "tardanza"
                            )
                        }

                    >

                        <Clock3
                            size={17}
                        />

                        Tarde

                    </button>


                    <button

                        className={
                            registro.estatus
                            === "falta"
                            ?
                            "mp-btn falta activo"
                            :
                            "mp-btn falta"
                        }

                        onClick={() =>
                            cambiarAsistencia(
                                maestro.id,
                                "falta"
                            )
                        }

                    >

                        <CircleX
                            size={17}
                        />

                        Faltó

                    </button>

                </div>


                {
                    registro.estatus
                    === "falta"
                    &&

                    <div className="mp-relevo">

                        <label>
                            Maestro suplente
                        </label>

                        <input

                            type="text"

                            placeholder="Nombre del suplente"

                            value={
                                registro.suplente
                                || ""
                            }

                            onChange={
                                e =>
                                    cambiarSuplente(
                                        maestro.id,
                                        e.target.value
                                    )
                            }

                        />

                    </div>
                }

            </div>

        );

    }


    /*==================================================
    TARJETA DE GUARDIA
    ==================================================*/

    function renderTarjetaGuardia(
        maestro,
        tipo
    ) {

        const esRecreo =
            tipo === "recreo";


        const registro =
            esRecreo
            ?
            recreo[
                maestro.id
            ] || {}
            :
            salida[
                maestro.id
            ] || {};


        const lugar =
            obtenerLugarGuardia(
                maestro.id,
                tipo
            );


        return (

            <div
                key={`${tipo}-${maestro.id}`}
                className="mp-card"
            >

                <div className="mp-maestro">

                    <div className="mp-avatar">

                        <UserRound
                            size={20}
                        />

                    </div>

                    <div className="mp-info">

                        <strong>
                            {nombreCompleto(maestro)}
                        </strong>

                        <span>

                            {
                                esRecreo
                                ?
                                "Guardia de recreo"
                                :
                                "Guardia de salida"
                            }

                            {
                                lugar
                                &&
                                <>
                                    {" · "}
                                    {lugar}
                                </>
                            }

                        </span>

                    </div>

                </div>


                <div className="mp-opciones mp-opciones-2">

                    <button

                        className={
                            registro.cumplio
                            === true
                            ?
                            "mp-btn presente activo"
                            :
                            "mp-btn presente"
                        }

                        onClick={() => {

                            if (
                                esRecreo
                            ) {

                                cambiarRecreo(
                                    maestro.id,
                                    true
                                );

                            }
                            else {

                                cambiarSalida(
                                    maestro.id,
                                    true
                                );

                            }

                        }}

                    >

                        <CheckCircle2
                            size={17}
                        />

                        En guardia

                    </button>


                    <button

                        className={
                            registro.cumplio
                            === false
                            ?
                            "mp-btn falta activo"
                            :
                            "mp-btn falta"
                        }

                        onClick={() => {

                            if (
                                esRecreo
                            ) {

                                cambiarRecreo(
                                    maestro.id,
                                    false
                                );

                            }
                            else {

                                cambiarSalida(
                                    maestro.id,
                                    false
                                );

                            }

                        }}

                    >

                        <CircleX
                            size={17}
                        />

                        No está

                    </button>

                </div>


                {
                    registro.cumplio
                    === false
                    &&

                    <div className="mp-relevo">

                        <label>
                            Maestro de relevo
                        </label>

                        <input

                            type="text"

                            placeholder="¿Quién cubrió la guardia?"

                            value={
                                registro.relevo
                                || ""
                            }

                            onChange={
                                e => {

                                    if (
                                        esRecreo
                                    ) {

                                        cambiarRelevoRecreo(
                                            maestro.id,
                                            e.target.value
                                        );

                                    }
                                    else {

                                        cambiarRelevoSalida(
                                            maestro.id,
                                            e.target.value
                                        );

                                    }

                                }
                            }

                        />

                    </div>
                }

            </div>

        );

    }


    /*==================================================
    JSX
    ==================================================*/

    return (
        <>

            <div className="mp-container">


                {/*=========================================
                HEADER
                =========================================*/}

                <div className="mp-header">

                    <div>

                        <h2>
                            Maestros
                        </h2>

                        <p>
                            Control diario
                        </p>

                    </div>


                    <div className="mp-fecha">

                        {
                            new Date()
                                .toLocaleDateString(
                                    "es-MX",
                                    {
                                        day:
                                            "2-digit",

                                        month:
                                            "short"
                                    }
                                )
                        }

                    </div>

                </div>


                {/*=========================================
                TABS
                =========================================*/}

                <div className="mp-tabs">

                    <button

                        className={
                            vista === "lista"
                            ?
                            "activo"
                            :
                            ""
                        }

                        onClick={() =>
                            setVista(
                                "lista"
                            )
                        }

                    >

                        <UsersRound
                            size={17}
                        />

                        Lista

                    </button>


                    <button

                        className={
                            vista === "recreo"
                            ?
                            "activo"
                            :
                            ""
                        }

                        onClick={() =>
                            setVista(
                                "recreo"
                            )
                        }

                    >

                        <Coffee
                            size={17}
                        />

                        Recreo

                    </button>


                    <button

                        className={
                            vista === "salida"
                            ?
                            "activo"
                            :
                            ""
                        }

                        onClick={() =>
                            setVista(
                                "salida"
                            )
                        }

                    >

                        <LogOut
                            size={17}
                        />

                        Salida

                    </button>

                </div>


                {/*=========================================
                ACCIONES RÁPIDAS
                =========================================*/}

                {
                    !cargando
                    &&
                    obtenerCantidadVistaActual()
                    > 0
                    &&

                    <div className="mp-acciones-superiores">

                        <button

                            className="mp-marcar-todos"

                            onClick={() => {

                                if (
                                    vista === "lista"
                                ) {

                                    marcarTodosPresentes();

                                }
                                else if (
                                    vista === "recreo"
                                ) {

                                    marcarTodosRecreo();

                                }
                                else {

                                    marcarTodosSalida();

                                }

                            }}

                        >

                            <CheckCircle2
                                size={18}
                            />

                            {
                                vista === "lista"
                                ?
                                "Todos presentes"
                                :
                                vista === "recreo"
                                ?
                                "Todos en recreo"
                                :
                                "Todos en salida"
                            }

                        </button>


                        <button

                            className="mp-guardar-superior"

                            disabled={
                                guardando
                            }

                            onClick={
                                guardarActual
                            }

                        >

                            <Save
                                size={18}
                            />

                            {
                                guardando
                                ?
                                "Guardando..."
                                :
                                "Guardar"
                            }

                        </button>

                    </div>
                }


                {/*=========================================
                CONTENIDO
                =========================================*/}

                {
                    cargando
                    ?

                    <div className="mp-vacio">
                        Cargando maestros...
                    </div>

                    :

                    obtenerCantidadVistaActual()
                    === 0
                    ?

                    <div className="mp-vacio">
                        {obtenerTextoVacioActual()}
                    </div>

                    :

                    <div className="mp-lista">

                        {
                            vista === "lista"
                            &&
                            maestros.map(
                                renderTarjetaLista
                            )
                        }


                        {
                            vista === "recreo"
                            &&
                            maestrosRecreoHoy.map(
                                maestro =>
                                    renderTarjetaGuardia(
                                        maestro,
                                        "recreo"
                                    )
                            )
                        }


                        {
                            vista === "salida"
                            &&
                            maestrosSalidaHoy.map(
                                maestro =>
                                    renderTarjetaGuardia(
                                        maestro,
                                        "salida"
                                    )
                            )
                        }

                    </div>
                }

            </div>


            {
                mensajeGuardado
                &&
                createPortal(

                    <div className="mp-toast-overlay">

                        <div className="mp-toast-exito">

                            <CheckCircle2
                                size={21}
                            />

                            <span>
                                Guardado con éxito
                            </span>

                        </div>

                    </div>,

                    document.body

                )
            }

        </>
    );

}
