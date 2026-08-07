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

import HeaderDireccion from "../components/HeaderDireccion";
import BottomNavigationDireccion from "../components/BottomNavigationDireccion";
import BotonIA from "../components/Psicologia/BotonIA";

import ListaPrefectura from "../pages/ListaPrefectura";
import GrupoAsistencia from "../components/Prefectura/GrupoAsistencia";

import InicioDireccion from "../pages/InicioDireccion";
import PerfilesDireccion from "../components/Direccion/PerfilesDireccion";
import ListaDireccion from "../components/Direccion/ListaDireccion";
import GrupoDireccion from "../components/Direccion/GrupoDireccion";
import PerfilAlumnoDireccion from "../pages/PerfilAlumnoDireccion.jsx";
import ReportesDireccion from "../components/Direccion/ReportesDireccion";

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

                <PerfilesDireccion

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

           <ListaDireccion

                key={grupoSeleccionado===null?"lista":"grupo"}

                students={students}

                abrirGrupo={setGrupoSeleccionado}

            />

        );

        case "reportes":

            return(

                <ReportesDireccion

                    embebido={true}

                    students={students}

                    setStudents={setStudents}

                    cargarAlumnos={cargarAlumnos}

                    setAlumnoSeleccionado={setAlumnoSeleccionado}

                    cambiarPantalla={cambiarPantallaInterna}

                    setModuloPerfil={setModuloPerfil}


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

                <GrupoDireccion

                    embebido={true}

                    students={students}

                    setStudents={setStudents}

                    grupoSeleccionado={grupoSeleccionado}

                    cambiarPantalla={cambiarPantallaInterna}

                    seleccionarAlumno={setAlumnoSeleccionado}

                />

            );

            case "perfilAlumnoDireccion":

                return(

                    <PerfilAlumnoDireccion

                        embebido={true}

                        alumno={alumnoSeleccionado}

                        students={students}

                        setStudents={setStudents}

                        cambiarPantalla={cambiarPantallaInterna}

                        setAlumnoSeleccionado={setAlumnoSeleccionado}

                        moduloInicial={moduloPerfil}

                        volver={volverPantalla}

                    />

                );

    case "neeReportes":

    return(

        <ReportesDireccion

            students={students}

            cambiarPantalla={cambiarPantallaInterna}

            setAlumnoSeleccionado={setAlumnoSeleccionado}

            setModuloPerfil={setModuloPerfil}

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

                <InicioDireccion

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

                Salir de Dirección

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

                    <HeaderDireccion
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

                <BottomNavigationDireccion

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
