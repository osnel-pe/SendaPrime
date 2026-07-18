import { motion } from "framer-motion";
import { LogOut } from "lucide-react";

import "../Styles/AppLayout.css";
import "../Styles/Psicologia.css";
import "../Styles/HeaderPsico.css";
import "../Styles/FrasePsico.css";
import "../Styles/AccesosRapidos.css";

import HeaderPsico from "../components/Psicologia/HeaderPsico";
import FrasePsico from "../components/Psicologia/FrasePsico";
import AccesosRapidos from "../components/Psicologia/AccesosRapidos";
import CitasHoy from "../components/Psicologia/CitasHoy";

// ESTE ES EL COMPONENTE DEL BANNER
import fondoPsicologia from "../assets/fondo-psicologia.jpg";

export default function Psicologia({

    cerrarSesion,

    cambiarPantalla,

    students,

    setAlumnoSeleccionado

}){

    return (

        <>

            <div
                className="app-background"
                style={{
                    backgroundImage:`url(${fondoPsicologia})`
                }}
            />

            <div className="ps-app">

                <motion.div
                    className="ps-container"
                    initial={{ opacity:0 }}
                    animate={{ opacity:1 }}
                    transition={{ duration:.35 }}
                >

                    <HeaderPsico/>

                    <FrasePsico/>
               
                    <AccesosRapidos
                        cambiarPantalla={cambiarPantalla}
                    />
                    
                    <CitasHoy

                        cambiarPantalla={cambiarPantalla}

                        students={students}

                        seleccionarAlumno={setAlumnoSeleccionado}

                    />
            

                    <div className="logout-container">

                        <button
                            className="logout-btn"
                            onClick={cerrarSesion}
                        >

                            <LogOut size={20}/>

                            Cerrar sesión

                        </button>

                    </div>

                </motion.div>

            </div>

        </>

    );

}