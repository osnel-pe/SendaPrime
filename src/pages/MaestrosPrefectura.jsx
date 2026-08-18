import {
    useEffect,
    useState
} from "react";

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
    ESTADOS GENERALES
    ==================================================*/

    const [vista, setVista] =
        useState("lista");

    const [maestros, setMaestros] =
        useState([]);

    const [cargando, setCargando] =
        useState(true);

    const [guardando, setGuardando] =
        useState(false);


    /*==================================================
    ASISTENCIA

    {
        maestroId: {
            estatus: "presente" | "tardanza" | "falta",
            suplente: ""
        }
    }
    ==================================================*/

    const [asistencia, setAsistencia] =
        useState({});


    /*==================================================
    GUARDIA RECREO

    {
        maestroId: {
            cumplio: true | false | null,
            relevo: ""
        }
    }
    ==================================================*/

    const [recreo, setRecreo] =
        useState({});


    /*==================================================
    GUARDIA SALIDA
    ==================================================*/

    const [salida, setSalida] =
        useState({});


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
    CARGA INICIAL
    ==================================================*/

    useEffect(() => {

        cargarTodo();

    }, []);


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

            .eq("activo", true)

            .order(
                "apellido_paterno",
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


        /*==============================================
        ASISTENCIA DE HOY
        ==============================================*/

        const {
            data: asistenciaData,
            error: asistenciaError
        } = await supabase

            .from("asistencia_maestros")

            .select("*")

            .eq("fecha", fecha);


        if (asistenciaError) {

            console.log(
                "Error cargando asistencia:",
                asistenciaError
            );

        }


        /*==============================================
        GUARDIAS DE HOY
        ==============================================*/

        const {
            data: guardiasData,
            error: guardiasError
        } = await supabase

            .from("guardias_maestros")

            .select("*")

            .eq("fecha", fecha);


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
        DATOS YA GUARDADOS
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
                            registro.suplente || ""

                    };

                }
            );

        /*==============================================
        SI EL MAESTRO FALTÓ,
        LO MARCAMOS COMO AUSENTE
        EN SUS GUARDIAS
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
                    registro.suplente || ""

            };


            if (
                registro.estatus === "falta"
            ) {

                recreoInicial[
                    registro.maestro_id
                ] = {

                    cumplio: false,

                    relevo: ""

                };

                salidaInicial[
                    registro.maestro_id
                ] = {

                    cumplio: false,

                    relevo: ""

                };

            }

        }
    );


    (guardiasData || [])
        .forEach(
            registro => {

                recreoInicial[
                    registro.maestro_id
                ] = {

                    cumplio:
                        registro.guardia_recreo,

                    relevo:
                        registro.relevo_recreo
                        || ""

                };


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
    CAMBIAR ASISTENCIA
    ==================================================*/

    function cambiarAsistencia(
    maestroId,
    estatus
) {

    setAsistencia(
        actual => ({

            ...actual,

            [maestroId]: {

                ...actual[maestroId],

                estatus,

                suplente:
                    estatus === "falta"
                    ?
                    actual[
                        maestroId
                    ]?.suplente || ""
                    :
                    ""

            }

        })
    );


    /*=========================================
    SI FALTÓ, AUTOMÁTICAMENTE
    NO ESTÁ EN SUS GUARDIAS
    =========================================*/

    if (
        estatus === "falta"
    ) {

        setRecreo(
            actual => ({

                ...actual,

                [maestroId]: {

                    ...actual[maestroId],

                    cumplio: false

                }

            })
        );


        setSalida(
            actual => ({

                ...actual,

                [maestroId]: {

                    ...actual[maestroId],

                    cumplio: false

                }

            })
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

                    ...actual[maestroId],

                    suplente: valor

                }

            })
        );

    }


    /*==================================================
    CAMBIAR RECREO
    ==================================================*/

    function cambiarRecreo(
        maestroId,
        cumplio
    ) {

        setRecreo(
            actual => ({

                ...actual,

                [maestroId]: {

                    ...actual[maestroId],

                    cumplio,

                    relevo:
                        cumplio === false
                        ?
                        actual[
                            maestroId
                        ]?.relevo || ""
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

                    ...actual[maestroId],

                    relevo: valor

                }

            })
        );

    }


    /*==================================================
    CAMBIAR SALIDA
    ==================================================*/

    function cambiarSalida(
        maestroId,
        cumplio
    ) {

        setSalida(
            actual => ({

                ...actual,

                [maestroId]: {

                    ...actual[maestroId],

                    cumplio,

                    relevo:
                        cumplio === false
                        ?
                        actual[
                            maestroId
                        ]?.relevo || ""
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

                    ...actual[maestroId],

                    relevo: valor

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
                maestro => {

                    return !asistencia[
                        maestro.id
                    ]?.estatus;

                }
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


        alert(
            "Asistencia de maestros guardada."
        );

    }


    /*==================================================
    GUARDAR RECREO
    ==================================================*/

    async function guardarRecreo() {

        const fecha =
            obtenerFechaLocal();


        const incompletos =
            maestros.filter(
                maestro => {

                    return (
                        recreo[
                            maestro.id
                        ]?.cumplio
                        === null
                    );

                }
            );


        if (
            incompletos.length > 0
        ) {

            alert(
                `Falta registrar la guardia de recreo de ${incompletos.length} maestro(s).`
            );

            return;

        }


        const sinRelevo =
            maestros.filter(
                maestro => {

                    const registro =
                        recreo[
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
            of maestros
        ) {

            const registro =
                recreo[
                    maestro.id
                ];


            const {
                data: existente
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


            if (existente) {

                const {
                    error
                } = await supabase

                    .from(
                        "guardias_maestros"
                    )

                    .update({

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

                    })

                    .eq(
                        "id",
                        existente.id
                    );


                if (error) {

                    setGuardando(false);

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
                        "guardias_maestros"
                    )

                    .insert({

                        maestro_id:
                            maestro.id,

                        fecha,

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

                    });


                if (error) {

                    setGuardando(false);

                    alert(
                        error.message
                    );

                    return;

                }

            }

        }


        setGuardando(false);


        alert(
            "Guardia de recreo guardada."
        );

    }


    /*==================================================
    GUARDAR SALIDA
    ==================================================*/

    async function guardarSalida() {

        const fecha =
            obtenerFechaLocal();


        const incompletos =
            maestros.filter(
                maestro => {

                    return (
                        salida[
                            maestro.id
                        ]?.cumplio
                        === null
                    );

                }
            );


        if (
            incompletos.length > 0
        ) {

            alert(
                `Falta registrar la guardia de salida de ${incompletos.length} maestro(s).`
            );

            return;

        }


        const sinRelevo =
            maestros.filter(
                maestro => {

                    const registro =
                        salida[
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
            of maestros
        ) {

            const registro =
                salida[
                    maestro.id
                ];


            const {
                data: existente
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


            if (existente) {

                const {
                    error
                } = await supabase

                    .from(
                        "guardias_maestros"
                    )

                    .update({

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

                    })

                    .eq(
                        "id",
                        existente.id
                    );


                if (error) {

                    setGuardando(false);

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
                        "guardias_maestros"
                    )

                    .insert({

                        maestro_id:
                            maestro.id,

                        fecha,

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

                    });


                if (error) {

                    setGuardando(false);

                    alert(
                        error.message
                    );

                    return;

                }

            }

        }


        setGuardando(false);


        alert(
            "Guardia de salida guardada."
        );

    }

    /*==================================================
    TODOS PRESENTES
    ==================================================*/

    function marcarTodosPresentes() {

        const nuevo = {};

        maestros.forEach(maestro => {

            nuevo[maestro.id] = {

                estatus: "presente",

                suplente: ""

            };

        });

        setAsistencia(nuevo);

    }


    /*==================================================
    TODOS EN GUARDIA DE RECREO
    ==================================================*/

    function marcarTodosRecreo() {

        const nuevo = {};

        maestros.forEach(maestro => {

            /*
            Si el maestro fue marcado como falta,
            mantenemos automáticamente No está.
            */

            const falto =

                asistencia[
                    maestro.id
                ]?.estatus === "falta";


            nuevo[maestro.id] = {

                cumplio:
                    falto
                    ?
                    false
                    :
                    true,

                relevo:
                    recreo[
                        maestro.id
                    ]?.relevo || ""

            };

        });

        setRecreo(nuevo);

    }


    /*==================================================
    TODOS EN GUARDIA DE SALIDA
    ==================================================*/

    function marcarTodosSalida() {

        const nuevo = {};

        maestros.forEach(maestro => {

            const falto =

                asistencia[
                    maestro.id
                ]?.estatus === "falta";


            nuevo[maestro.id] = {

                cumplio:
                    falto
                    ?
                    false
                    :
                    true,

                relevo:
                    salida[
                        maestro.id
                    ]?.relevo || ""

            };

        });

        setSalida(nuevo);

    }


    /*==================================================
    GUARDAR SEGÚN PESTAÑA
    ==================================================*/

    function guardarActual() {

        if (vista === "lista") {

            guardarLista();

            return;

        }


        if (vista === "recreo") {

            guardarRecreo();

            return;

        }


        guardarSalida();

    }


    /*==================================================
    JSX
    ==================================================*/

    return (

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
                                    day: "2-digit",
                                    month: "short"
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
                        setVista("lista")
                    }

                >

                    <UsersRound size={17}/>

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
                        setVista("recreo")
                    }

                >

                    <Coffee size={17}/>

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
                        setVista("salida")
                    }

                >

                    <LogOut size={17}/>

                    Salida

                </button>


            </div>

            {/*=========================================
            ACCIÓN RÁPIDA
            =========================================*/}

            {
            !cargando
            &&
            maestros.length > 0
            &&

            <div className="mp-acciones-superiores">

                <button
                    className="mp-marcar-todos"
                    onClick={() => {

                        if (vista === "lista") {

                            marcarTodosPresentes();

                        }
                        else if (vista === "recreo") {

                            marcarTodosRecreo();

                        }
                        else {

                            marcarTodosSalida();

                        }

                    }}
                >

                    <CheckCircle2 size={18}/>

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
                    disabled={guardando}
                    onClick={guardarActual}
                >

                    <Save size={18}/>

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
            CARGANDO
            =========================================*/}

            {

                cargando

                ?

                <div className="mp-vacio">

                    Cargando maestros...

                </div>

                :

                maestros.length === 0

                ?

                <div className="mp-vacio">

                    No existen maestros registrados.

                </div>

                :

                <div className="mp-lista">


                    {/*=================================
                    LISTA
                    =================================*/}

                    {

                        vista === "lista"
                        &&

                        maestros.map(
                            maestro => {

                                const registro =
                                    asistencia[
                                        maestro.id
                                    ] || {};


                                return (

                                    <div

                                        key={
                                            maestro.id
                                        }

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

                                                    {
                                                        maestro.nombre
                                                    }{" "}

                                                    {
                                                        maestro.apellido_paterno
                                                    }{" "}

                                                    {
                                                        maestro.apellido_materno
                                                    }

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
                                                        registro
                                                            .suplente
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
                        )

                    }


                    {/*=================================
                    GUARDIA RECREO
                    =================================*/}

                    {

                        vista === "recreo"
                        &&

                        maestros.map(
                            maestro => {

                                const registro =
                                    recreo[
                                        maestro.id
                                    ] || {};


                                return (

                                    <div

                                        key={
                                            maestro.id
                                        }

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

                                                    {
                                                        maestro.nombre
                                                    }{" "}

                                                    {
                                                        maestro.apellido_paterno
                                                    }

                                                </strong>

                                                <span>

                                                    Guardia de recreo

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

                                                onClick={() =>
                                                    cambiarRecreo(
                                                        maestro.id,
                                                        true
                                                    )
                                                }

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

                                                onClick={() =>
                                                    cambiarRecreo(
                                                        maestro.id,
                                                        false
                                                    )
                                                }

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
                                                        registro
                                                            .relevo
                                                        || ""
                                                    }

                                                    onChange={
                                                        e =>
                                                        cambiarRelevoRecreo(
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
                        )

                    }


                    {/*=================================
                    GUARDIA SALIDA
                    =================================*/}

                    {

                        vista === "salida"
                        &&

                        maestros.map(
                            maestro => {

                                const registro =
                                    salida[
                                        maestro.id
                                    ] || {};


                                return (

                                    <div

                                        key={
                                            maestro.id
                                        }

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

                                                    {
                                                        maestro.nombre
                                                    }{" "}

                                                    {
                                                        maestro.apellido_paterno
                                                    }

                                                </strong>

                                                <span>

                                                    Guardia de salida

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

                                                onClick={() =>
                                                    cambiarSalida(
                                                        maestro.id,
                                                        true
                                                    )
                                                }

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

                                                onClick={() =>
                                                    cambiarSalida(
                                                        maestro.id,
                                                        false
                                                    )
                                                }

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
                                                        registro
                                                            .relevo
                                                        || ""
                                                    }

                                                    onChange={
                                                        e =>
                                                        cambiarRelevoSalida(
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
                        )

                    }


                </div>

            }


            {/*=========================================
            GUARDAR
            =========================================*/}


        </div>

    );

}