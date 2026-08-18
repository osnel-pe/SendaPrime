import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {

    Bell,

    Brain,

    Users,

    LogOut

} from "lucide-react";

import "../Styles/AppLayout.css";
import "../Styles/Prefectura.css";
import "../Styles/HeaderPrefectura.css";

import fondoPrefectura from "../assets/fondo-psicologia.jpg";

import MaestrosPrefectura from "../pages/MaestrosPrefectura";
import HeaderPrefectura from "../components/HeaderPrefectura";
import BottomNavigationPrefectura from "../components/BottomNavigationPrefectura.jsx";
import BotonIA from "../components/Psicologia/BotonIA";

import ListaPrefectura from "../pages/ListaPrefectura";
import GrupoAsistencia from "../components/Prefectura/GrupoAsistencia";

import InicioPrefectura from "../pages/InicioPrefectura";
import PerfilesPrefectura from "../pages/PerfilesPrefectura";
import ReportesPrefectura from "../pages/ReportesPrefectura";
import NotasPrefectura from "../pages/NotasPrefectura";
import GrupoPrefectura from "../pages/GrupoPrefectura";
import PerfilAlumnoPrefectura from "../pages/PerfilAlumnoPrefectura";
import ResumenAsistencia from "../components/Prefectura/ResumenAsistencia";
import MaestrosPerfilesPrefectura
from "../pages/MaestrosPerfilesPrefectura";

import PerfilMaestroPrefectura
from "../pages/PerfilMaestroPrefectura";

export default function Prefectura({

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

    const [mostrarCerrarSesion,setMostrarCerrarSesion]=
    useState(false);

    const [resumenAsistencia,setResumenAsistencia]=useState({});

    const [moduloPerfil,setModuloPerfil]=useState("archivos");

    const [
        maestroSeleccionado,
        setMaestroSeleccionado
    ] = useState(null);

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

        if(nuevaPantalla==="lista"){
            setGrupoSeleccionado(null);
        }

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

        console.log("Pantalla:", pantallaActual);
        console.log("Grupo seleccionado:", grupoSeleccionado);

    switch(pantallaActual){

        case "perfiles":

            return(

                <PerfilesPrefectura

                    embebido={true}

                    students={students}

                    cambiarPantalla={cambiarPantallaInterna}

                    seleccionarAlumno={setAlumnoSeleccionado}

                    setGrupoSeleccionado={setGrupoSeleccionado}

                />

            );

        case "lista":

        return(

            grupoSeleccionado

            ?

            <GrupoAsistencia

                grupo={grupoSeleccionado}

                students={students}

                volver={()=>setGrupoSeleccionado(null)}

            />

            :

           <ListaPrefectura

                key={grupoSeleccionado===null?"lista":"grupo"}

                students={students}

                abrirGrupo={setGrupoSeleccionado}

            />

        );

        case "reportes":

            return(

                <ReportesPrefectura

                    embebido={true}

                    students={students}

                    setStudents={setStudents}

                    cargarAlumnos={cargarAlumnos}

                    setAlumnoSeleccionado={setAlumnoSeleccionado}

                    cambiarPantalla={cambiarPantallaInterna}

                    setModuloPerfil={setModuloPerfil}


                />

            );

        case "maestros":

            return (

                <MaestrosPrefectura

                    embebido={true}

                    cambiarPantalla={
                        cambiarPantallaInterna
                    }

                />

            );

        case "notas":

            return(

                <NotasPrefectura

                    embebido={true}

                    students={students}

                    cambiarPantalla={cambiarPantallaInterna}

                />

            );

        case "grupoPrefectura":

            return(

                <GrupoPrefectura

                    embebido={true}

                    students={students}

                    setStudents={setStudents}

                    grupoSeleccionado={grupoSeleccionado}

                    cambiarPantalla={cambiarPantallaInterna}

                    seleccionarAlumno={setAlumnoSeleccionado}

                />

            );

case "perfilAlumnoPrefectura":

    return(

        <PerfilAlumnoPrefectura

            embebido={true}

            alumno={alumnoSeleccionado}

            students={students}

            setStudents={setStudents}

            cambiarPantalla={cambiarPantallaInterna}

            setAlumnoSeleccionado={setAlumnoSeleccionado}

            moduloInicial={moduloPerfil}

        />

    );

    case "maestrosPerfiles":

    return (

        <MaestrosPerfilesPrefectura

            seleccionarMaestro={
                setMaestroSeleccionado
            }

            cambiarPantalla={
                cambiarPantallaInterna
            }

        />

    );


case "perfilMaestroPrefectura":

    return (

        <PerfilMaestroPrefectura

            embebido={true}

            maestro={
                maestroSeleccionado
            }

            cambiarPantalla={
                cambiarPantallaInterna
            }

        />

    );

    case "resumenAsistencia":

        return(

            <ResumenAsistencia

                resumen={resumenAsistencia}

            />

        );

        default:

            return(

                <InicioPrefectura

                    students={students}

                    setAlumnoSeleccionado={setAlumnoSeleccionado}

                    cambiarPantalla={cambiarPantallaInterna}

                    setModuloPerfil={setModuloPerfil}

                    setResumenAsistencia={setResumenAsistencia}

                />

            );

    }

}

    {
    mostrarConfirmarCerrar && (

    <div className="modal-overlay">

        <div className="modal-nee">

            <h2>

                Salir de Prefectura

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

                backgroundImage:`url(${fondoPrefectura})`

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

                    <HeaderPrefectura

                        cerrarSesion={cerrarSesion}

                    />

                </div>

                <div className="ps-contenido">

                    {

                        renderContenido()

                    }

                </div>

                {/*

                <BotonIA
                    abrir={()=>
                        cambiarPantalla(
                            "asistenteIA"
                        )
                    }
                />

                */}

                <BottomNavigationPrefectura

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
