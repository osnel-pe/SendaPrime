import {
    useEffect,
    useState
} from "react";

import {
    ArrowLeft,
    CheckCircle2,
    Clock3,
    CircleX
} from "lucide-react";

import { createPortal } from "react-dom";

import "../../Styles/ListaPrefectura.css";

import { supabase }
from "../../services/supabase";

import { obtenerFechaLocal }
from "../../utils/fechaLocal";

import {
    sincronizarNotificacionesPrefectura
} from "../../utils/notificacionesPrefectura";

export default function GrupoAsistencia({

    grupo,

    students,

    volver

}) {

    /*==================================================
    ESTADOS
    ==================================================*/

    const [lista, setLista] =
        useState([]);

    const [
        mensajeGuardado,
        setMensajeGuardado
    ] = useState(false);

    const [
        guardando,
        setGuardando
    ] = useState(false);


    /*==================================================
    CARGAR ASISTENCIA
    ==================================================*/

    useEffect(() => {

        if (!grupo) return;

        cargarAsistencia();

    }, [
        grupo,
        students
    ]);


    async function cargarAsistencia() {

        const hoy =
            obtenerFechaLocal();


        const alumnos =
            (students || [])
                .filter(
                    alumno =>
                        alumno.grupo === grupo
                );


        const {
            data,
            error
        } = await supabase

            .from(
                "asistencia_prefectura"
            )

            .select("*")

            .eq(
                "grupo",
                grupo
            )

            .eq(
                "fecha",
                hoy
            );


        if (error) {

            console.log(
                "Error cargando asistencia:",
                error
            );

            return;

        }


        const listaCompleta =
            alumnos.map(
                alumno => {

                    const registro =
                        (data || [])
                            .find(
                                item =>
                                    item.alumno_id
                                    === alumno.id
                            );


                    return {

                        ...alumno,

                        estatus:
                            registro?.estatus
                            || "presente"

                    };

                }
            );


        setLista(
            listaCompleta
        );

    }


    /*==================================================
    CAMBIAR ESTADO
    ==================================================*/

    function cambiar(
        id,
        estatus
    ) {

        setLista(
            actual =>
                actual.map(
                    alumno =>

                        alumno.id === id

                            ?

                            {
                                ...alumno,
                                estatus
                            }

                            :

                            alumno
                )
        );

    }


    /*==================================================
    MOSTRAR MENSAJE
    ==================================================*/

    function mostrarGuardado() {

        setMensajeGuardado(
            true
        );

    }


    /*==================================================
    GUARDAR
    ==================================================*/

    async function guardarAsistencia() {

        if (
            lista.length === 0
        ) {

            return;

        }


        if (guardando) {

            return;

        }


        setGuardando(
            true
        );


        const hoy =
            obtenerFechaLocal();


        const registros =
            lista.map(
                alumno => ({

                    alumno_id:
                        alumno.id,

                    grupo,

                    fecha:
                        hoy,

                    estatus:
                        alumno.estatus

                })
            );


        const {
            error
        } = await supabase

            .from(
                "asistencia_prefectura"
            )

            .upsert(

                registros,

                {
                    onConflict:
                        "alumno_id,fecha"
                }

            );


        if (error) {

            setGuardando(
                false
            );

            alert(
                error.message
            );

            return;

        }


        /* CREAR ALERTAS NUEVAS DE INMEDIATO */

        await sincronizarNotificacionesPrefectura({
            historico: false
        });

        /* AVISAR A TODA LA APP */

        window.dispatchEvent(
            new CustomEvent(
                "prefectura-actualizada"
            )
        );

        mostrarGuardado();


        /*
        Esperamos 2 segundos para que
        el usuario realmente vea el mensaje.
        */

        setTimeout(() => {

            setMensajeGuardado(
                false
            );

            setGuardando(
                false
            );

            /*
            Después de mostrar la confirmación
            regresamos a la lista de grupos.
            */

            volver();

        }, 2000);

    }


    /*==================================================
    JSX
    ==================================================*/

    return (

        <>


            <div className="grupo-asistencia">


                {/*=====================================
                HEADER
                =====================================*/}

                <div className="grupo-titulo">


                    <button

                        type="button"

                        className="back-btn"

                        onClick={
                            volver
                        }

                    >

                        <ArrowLeft
                            size={20}
                        />

                    </button>


                    <h2>

                        {grupo}

                    </h2>


                </div>


                {/*=====================================
                LISTA
                =====================================*/}

                <div className="lista-alumnos">


                    {
                        lista.length === 0

                            ?

                            <div className="lista-vacia">

                                No existen alumnos
                                en este grupo.

                            </div>

                            :

                            lista.map(
                                (
                                    alumno,
                                    index
                                ) => (

                                    <div

                                        key={
                                            alumno.id
                                        }

                                        className="alumno-card"

                                    >


                                        {/*=========================
                                        DATOS DEL ALUMNO
                                        =========================*/}

                                        <div className="alumno-info">


                                            <span className="numero">

                                                {
                                                    index + 1
                                                }

                                            </span>


                                            <div className="datos-alumno">


                                                <strong>

                                                    {
                                                        alumno.nombre
                                                    }{" "}

                                                    {
                                                        alumno.apellido_paterno
                                                    }

                                                </strong>


                                                <p>

                                                    {
                                                        alumno.apellido_materno
                                                    }

                                                </p>


                                            </div>


                                        </div>


                                        {/*=========================
                                        ESTADOS
                                        =========================*/}

                                        <div className="estado-botones">


                                            <button

                                                type="button"

                                                className={

                                                    alumno.estatus
                                                    === "presente"

                                                        ?

                                                        "estado activo presente"

                                                        :

                                                        "estado"

                                                }

                                                onClick={() =>
                                                    cambiar(
                                                        alumno.id,
                                                        "presente"
                                                    )
                                                }

                                                title="Presente"

                                            >

                                                <CheckCircle2
                                                    size={16}
                                                />

                                            </button>


                                            <button

                                                type="button"

                                                className={

                                                    alumno.estatus
                                                    === "tardanza"

                                                        ?

                                                        "estado activo tardanza"

                                                        :

                                                        "estado"

                                                }

                                                onClick={() =>
                                                    cambiar(
                                                        alumno.id,
                                                        "tardanza"
                                                    )
                                                }

                                                title="Tardanza"

                                            >

                                                <Clock3
                                                    size={16}
                                                />

                                            </button>


                                            <button

                                                type="button"

                                                className={

                                                    alumno.estatus
                                                    === "falta"

                                                        ?

                                                        "estado activo falta"

                                                        :

                                                        "estado"

                                                }

                                                onClick={() =>
                                                    cambiar(
                                                        alumno.id,
                                                        "falta"
                                                    )
                                                }

                                                title="Falta"

                                            >

                                                <CircleX
                                                    size={16}
                                                />

                                            </button>


                                        </div>


                                    </div>

                                )
                            )
                    }


                </div>


                {/*=====================================
                GUARDAR
                =====================================*/}

                <div className="guardar-contenedor">


                    <button

                        type="button"

                        className="guardar-asistencia"

                        disabled={
                            guardando
                        }

                        onClick={
                            guardarAsistencia
                        }

                    >

                        {
                            guardando

                                ?

                                "Guardando..."

                                :

                                "Guardar asistencia"
                        }

                    </button>


                </div>


            </div>


            {/*=========================================
            MENSAJE TEMPORAL
            =========================================*/}

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