import { useState } from "react";

import {

    LogOut

} from "lucide-react";

import logoPrefectura from "../assets/logo-psico.jpg";

import "../Styles/HeaderPsico.css";

export default function HeaderDireccion({

    cerrarSesion

}){

    const [mostrarCerrarSesion,setMostrarCerrarSesion]=

        useState(false);

    return(

        <>

            <div className="psico-header">

                <div className="psico-header-left">

                    <div className="psico-logo">

                        <img

                            src={logoPrefectura}

                            alt="Prefectura"

                            className="psico-logo-img"

                        />

                    </div>

                    <h2>

                        Dirección

                    </h2>

                </div>

                <div className="psico-header-right">

                    <button

                        className="logout-btn"

                        onClick={()=>

                            setMostrarCerrarSesion(true)

                        }

                    >

                        <LogOut size={18}/>

                    </button>

                </div>

            </div>

            {

                mostrarCerrarSesion && (

                    <div className="modal-overlay">

                        <div className="modal-nee">

                            <h2>

                                Cerrar sesión

                            </h2>

                            <p>

                                ¿Seguro que deseas cerrar tu sesión?

                            </p>

                            <div className="modal-botones">

                                <button

                                    className="btn-cancelar"

                                    onClick={()=>

                                        setMostrarCerrarSesion(false)

                                    }

                                >

                                    Cancelar

                                </button>

                                <button

                                    className="btn-eliminar"

                                    onClick={()=>{

                                        setMostrarCerrarSesion(false);

                                        cerrarSesion();

                                    }}

                                >

                                    Cerrar sesión

                                </button>

                            </div>

                        </div>

                    </div>

                )

            }

        </>

    );

}