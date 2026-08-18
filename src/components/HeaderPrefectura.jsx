import {
    useEffect,
    useState
} from "react";

import {
    Bell,
    LogOut
} from "lucide-react";

import logoPrefectura
from "../assets/logo-psico.jpg";

import "../Styles/HeaderPsico.css";
import "../Styles/NotificacionesPrefectura.css";

import NotificacionesPrefectura
from "./Prefectura/NotificacionesPrefectura";

import { supabase }
from "../services/supabase";


export default function HeaderPrefectura({

    cerrarSesion

}) {

    const [
        mostrarCerrarSesion,
        setMostrarCerrarSesion
    ] = useState(false);

    const [
        mostrarNotificaciones,
        setMostrarNotificaciones
    ] = useState(false);

    const [
        cantidadNotificaciones,
        setCantidadNotificaciones
    ] = useState(0);


    /*=========================================
    CARGAR CONTADOR
    =========================================*/

    useEffect(() => {

        cargarContador();

    }, []);


    async function cargarContador() {

    const hoy = new Date();

    const mesActual =
        hoy.getMonth() + 1;

    const anioActual =
        hoy.getFullYear();


    const {
        count,
        error
    } = await supabase

        .from("notificaciones_prefectura")

        .select(
            "*",
            {
                count: "exact",
                head: true
            }
        )

        .eq("vista", false)

        .eq("mes", mesActual)

        .eq("anio", anioActual);


    if (error) {

        console.log(
            "Error cargando contador de notificaciones:",
            error
        );

        return;

    }


    setCantidadNotificaciones(
        count || 0
    );

}


    return (

        <>

            <div className="psico-header">

                {/*=================================
                IZQUIERDA
                =================================*/}

                <div className="psico-header-left">

                    <div className="psico-logo">

                        <img

                            src={logoPrefectura}

                            alt="Prefectura"

                            className="psico-logo-img"

                        />

                    </div>

                    <h2>
                        Prefectura
                    </h2>

                </div>


                {/*=================================
                DERECHA
                =================================*/}

                <div className="psico-header-right">


                    {/* NOTIFICACIONES */}

                    <div className="header-notif-wrapper">

                        <button

                            className="logout-btn"

                            onClick={() =>

                                setMostrarNotificaciones(
                                    true
                                )

                            }

                            title="Notificaciones"

                        >

                            <Bell size={18}/>

                        </button>


                        {

                            cantidadNotificaciones > 0
                            &&

                            <span className="header-notif-badge">

                                {
                                    cantidadNotificaciones > 9
                                    ?
                                    "9+"
                                    :
                                    cantidadNotificaciones
                                }

                            </span>

                        }

                    </div>


                    {/* CERRAR SESIÓN */}

                    <button

                        className="logout-btn"

                        onClick={() =>

                            setMostrarCerrarSesion(
                                true
                            )

                        }

                    >

                        <LogOut size={18}/>

                    </button>

                </div>

            </div>


            {/*=================================
            PANTALLA NOTIFICACIONES
            =================================*/}

            <NotificacionesPrefectura

            abierto={
                mostrarNotificaciones
            }

            actualizarContador={
                cargarContador
            }

            cerrar={() => {

                setMostrarNotificaciones(
                    false
                );

                cargarContador();

            }}

        />


            {/*=================================
            CERRAR SESIÓN
            =================================*/}

            {

                mostrarCerrarSesion
                &&

                <div className="modal-overlay">

                    <div className="modal-nee">

                        <h2>
                            Cerrar sesión
                        </h2>

                        <p>

                            ¿Seguro que deseas
                            cerrar tu sesión?

                        </p>

                        <div className="modal-botones">

                            <button

                                className="btn-cancelar"

                                onClick={() =>

                                    setMostrarCerrarSesion(
                                        false
                                    )

                                }

                            >

                                Cancelar

                            </button>

                            <button

                                className="btn-eliminar"

                                onClick={() => {

                                    setMostrarCerrarSesion(
                                        false
                                    );

                                    cerrarSesion();

                                }}

                            >

                                Cerrar sesión

                            </button>

                        </div>

                    </div>

                </div>

            }

        </>

    );

}