import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";

import "../Styles/AppLayout.css";
import "../Styles/Psicologia.css";
import "../Styles/HeaderPsico.css";

import fondoPsicologia from "../assets/fondo-psicologia.jpg";

import HeaderPsico from "../components/Psicologia/HeaderPsico";
import BottomNavigation from "../components/Psicologia/BottomNavigation";
import BotonIA from "../components/Psicologia/BotonIA";

import Inicio from "../components/Psicologia/Inicio";
import PerfilesPsicologia from "../pages/PerfilesPsicologia";
import CitasProgramadas from "../pages/CitasProgramadas";
import NEE from "../pages/NEE";
import Notas from "../pages/Notas";
import GrupoPsicologia from "../pages/GrupoPsicologia";
import PerfilAlumnoPsico from "../pages/PerfilAlumnoPsico";
import { pedirPermiso } from "../services/notificaciones";
import { revisarCitas } from "../services/revisarCitas";

export default function Psicologia({

    cerrarSesion,

    cambiarPantalla,

    students,

    setStudents,

    cargarAlumnos,

    alumnoSeleccionado,

    setAlumnoSeleccionado,

    grupoSeleccionado,

    setGrupoSeleccionado

}){

    const [pantallaActual,setPantallaActual]=

        useState("inicio");

    const [mostrarConfirmarCerrar,setMostrarConfirmarCerrar]=

        useState(false);

    const [citaActiva,setCitaActiva]=useState(null);

    useEffect(()=>{

        pedirPermiso();

        revisarCitas();

        const intervalo=setInterval(

            revisarCitas,

            60000

        );

        return()=>clearInterval(intervalo);

    },[]);

    function renderContenido(){

    switch(pantallaActual){

        case "perfiles":

            return(

                <PerfilesPsicologia

                    embebido={true}

                    students={students}

                    cambiarPantalla={setPantallaActual}

                    seleccionarAlumno={setAlumnoSeleccionado}

                    setGrupoSeleccionado={setGrupoSeleccionado}

                />

            );

        case "citas":

            return(

                <CitasProgramadas

                embebido={true}

                students={students}

                setStudents={setStudents}

                cambiarPantalla={setPantallaActual}

            />

            );

        case "nee":

            return(

                <NEE

                    students={students}

                    setStudents={setStudents}

                    cargarAlumnos={cargarAlumnos}

                    cambiarPantalla={setPantallaActual}

                    seleccionarAlumno={setAlumnoSeleccionado}

                    embebido={true}

                    setCitaActiva={setCitaActiva}

                />

            );

        case "notas":

            return(

                <div className="notas-pantalla-completa">

                    <Notas

                        embebido={true}

                        students={students}

                        cambiarPantalla={setPantallaActual}

                    />

                </div>

            );

        default:

            return(

                <Inicio

                    students={students}

                    cambiarPantalla={setPantallaActual}

                    setAlumnoSeleccionado={setAlumnoSeleccionado}

                    setCitaActiva={setCitaActiva}

                />

            );

            case "grupoPsicologia":

                return(

                    <GrupoPsicologia

                        embebido={true}

                        students={students}

                        setStudents={setStudents}

                        grupoSeleccionado={grupoSeleccionado}

                        cambiarPantalla={setPantallaActual}

                        seleccionarAlumno={setAlumnoSeleccionado}

                    />

                );

            case "perfilAlumnoPsico":

                return(

                    <PerfilAlumnoPsico

                        embebido={true}

                        alumno={alumnoSeleccionado}

                        students={students}

                        setStudents={setStudents}

                        cambiarPantalla={setPantallaActual}

                        setAlumnoSeleccionado={setAlumnoSeleccionado}

                        citaActiva={citaActiva}

                        setCitaActiva={setCitaActiva}

                    />

                );

    }

}

    return(

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

                initial={{opacity:0}}

                animate={{opacity:1}}

                transition={{duration:.35}}

            >

                <div className="ps-fixed-top">

                    <HeaderPsico/>

                </div>

                <div className="ps-contenido">

                    {

                        renderContenido()

                    }

                </div>

                <BotonIA

                    abrir={()=>

                        cambiarPantalla(

                            "asistenteIA"

                        )

                    }

                />

                <BottomNavigation

                    pantalla={pantallaActual}

                    cambiarPantalla={setPantallaActual}

                />

            </motion.div>

        </div>

        {

            mostrarConfirmarCerrar && (

                <div className="modal-opciones">

                    <div className="modal-contenido cerrar-sesion-modal">

                        <div className="cerrar-sesion-icono">

                            <LogOut

                                size={34}

                            />

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

                                onClick={()=>

                                    setMostrarConfirmarCerrar(

                                        false

                                    )

                                }

                            >

                                Cancelar

                            </button>

                            <button

                                className="btn-confirmar-cerrar"

                                onClick={()=>{

                                    setMostrarConfirmarCerrar(

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

            )

        }

    </>

);

}
