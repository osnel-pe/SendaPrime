import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {

    Bell,

    Brain,

    Users,

    LogOut

} from "lucide-react";

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

    const [historialPantallas,setHistorialPantallas]=useState(["inicio"]);

    const [mostrarConfirmarCerrar,setMostrarConfirmarCerrar]=

        useState(false);

    const [citaActiva,setCitaActiva]=useState(null);

    const [mostrarCerrarSesion,setMostrarCerrarSesion]=
    useState(false);

    useEffect(()=>{

        pedirPermiso();

        revisarCitas();

        const intervalo=setInterval(

            revisarCitas,

            60000

        );

        return()=>clearInterval(intervalo);

    },[]);

    useEffect(()=>{

    const manejarAtras=()=>{

        if(historialPantallas.length>1){

        volverPantalla();

        window.history.pushState(null,"");

    }
    else{

        setMostrarConfirmarCerrar(true);

        window.history.pushState(null,"");

    }

    };

    window.history.pushState(null,"");

    window.addEventListener(

        "popstate",

        manejarAtras

    );

    return()=>{

        window.removeEventListener(

            "popstate",

            manejarAtras

        );

    };

},[historialPantallas]);

    useEffect(()=>{

        window.history.replaceState(

            {psicologia:true},

            ""

        );

    },[]);

    function cambiarPantallaInterna(nuevaPantalla){

        setHistorialPantallas(historial=>[
            ...historial,
            nuevaPantalla
        ]);

        setPantallaActual(nuevaPantalla);

    }

    function volverPantalla(){

    setHistorialPantallas(historial=>{

        if(historial.length<=1){

            return historial;

        }

        const nuevo=[...historial];

        nuevo.pop();

        setPantallaActual(
            nuevo[nuevo.length-1]
        );

        return nuevo;

    });

}

    function renderContenido(){

    switch(pantallaActual){

        case "perfiles":

            return(

                <PerfilesPsicologia

                    embebido={true}

                    students={students}

                    cambiarPantalla={cambiarPantallaInterna}

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

                cambiarPantalla={cambiarPantallaInterna}

            />

            );

        case "nee":

            return(

                <NEE

                    students={students}

                    setStudents={setStudents}

                    cargarAlumnos={cargarAlumnos}

                    cambiarPantalla={cambiarPantallaInterna}

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

                        cambiarPantalla={cambiarPantallaInterna}

                    />

                </div>

            );

        default:

            return(

                <Inicio

                    students={students}

                    cambiarPantalla={cambiarPantallaInterna}

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

                        cambiarPantalla={cambiarPantallaInterna}

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

                        cambiarPantalla={cambiarPantallaInterna}

                        setAlumnoSeleccionado={setAlumnoSeleccionado}

                        citaActiva={citaActiva}

                        setCitaActiva={setCitaActiva}

                    />

                );

    }

}

    {
    mostrarConfirmarCerrar && (

    <div className="modal-overlay">

        <div className="modal-nee">

            <h2>

                Salir de Psicología

            </h2>

            <p>

                ¿Deseas salir de este módulo?

            </p>

            <div className="modal-botones">

                <button

                    className="btn-cancelar"

                    onClick={()=>

                        setMostrarConfirmarCerrar(false)

                    }

                >

                    Permanecer

                </button>

                <button

                    className="btn-eliminar"

                    onClick={()=>{

                        setMostrarConfirmarCerrar(false);

                        window.location.href="about:blank";

                    }}

                >

                    Salir

                </button>

            </div>

        </div>

    </div>

    )
    }

    {
mostrarCerrarSesion && (

<div className="modal-overlay">

    <div className="modal-nee">

        <h2>

            Cerrar sesión

        </h2>

        <p>

            ¿Deseas cerrar tu sesión?

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

                    <HeaderPsico

                        cerrarSesion={cerrarSesion}

                    />

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

                    cambiarPantalla={cambiarPantallaInterna}

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
