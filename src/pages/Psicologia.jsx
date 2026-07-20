import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { useState } from "react";

import "../Styles/AppLayout.css";
import "../Styles/Psicologia.css";
import "../Styles/HeaderPsico.css";
import "../Styles/FrasePsico.css";
import "../Styles/AccesosRapidos.css";

import HeaderPsico from "../components/Psicologia/HeaderPsico";
import FrasePsico from "../components/Psicologia/FrasePsico";
import AccesosRapidos from "../components/Psicologia/AccesosRapidos";
import CitasHoy from "../components/Psicologia/CitasHoy";
import BotonIA from "../components/Psicologia/BotonIA";

// ESTE ES EL COMPONENTE DEL BANNER
import fondoPsicologia from "../assets/fondo-psicologia.jpg";

export default function Psicologia({

    cerrarSesion,

    cambiarPantalla,

    students,

    setAlumnoSeleccionado

}){

    const [mostrarConfirmarCerrar, setMostrarConfirmarCerrar] = useState(false);

    return (

        <>

            <div
                className="app-background"
                style={{
                    backgroundImage:`url(${fondoPsicologia})`
                }}
            />

            <div className="ps-app ps-pantalla-principal">

                <motion.div
                    className="ps-container"
                    initial={{ opacity:0 }}
                    animate={{ opacity:1 }}
                    transition={{ duration:.35 }}
                >

                    <div className="ps-fixed-top">

                        <HeaderPsico/>

                        <FrasePsico/>

                        <AccesosRapidos
                            cambiarPantalla={cambiarPantalla}
                        />

                    </div>

                    <div className="citas-hoy-area">

                        <CitasHoy

                            cambiarPantalla={cambiarPantalla}

                            students={students}

                            seleccionarAlumno={setAlumnoSeleccionado}

                        />

                    </div>

                    <BotonIA

                        abrir={() => cambiarPantalla("asistenteIA")}

                    />

                    <div className="logout-container">

                        <button
                            className="cerrar-sesion-btn"
                            onClick={() => setMostrarConfirmarCerrar(true)}
                        >

                            <LogOut size={20}/>

                            Cerrar sesión

                        </button>

                    </div>

                </motion.div>

            </div>

            {

                mostrarConfirmarCerrar && (

                    <div className="modal-opciones">

                        <div className="modal-contenido cerrar-sesion-modal">

                            <div className="cerrar-sesion-icono">

                                <LogOut size={34}/>

                            </div>

                            <h2>

                                ¿Cerrar sesión?

                            </h2>

                            <p>

                                ¿Estás seguro de que deseas cerrar tu sesión?

                            </p>

                            <div className="modal-botones">

                                <button

                                    className="btn-cancelar"

                                    onClick={() =>

                                        setMostrarConfirmarCerrar(false)

                                    }

                                >

                                    Cancelar

                                </button>


                                <button

                                    className="btn-confirmar-cerrar"

                                    onClick={() => {

                                        setMostrarConfirmarCerrar(false);

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