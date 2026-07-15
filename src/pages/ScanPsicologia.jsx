import { motion } from "framer-motion";

import "../Styles/AppLayout.css";
import "../Styles/ScanPsicologia.css";

import { useState } from "react";


import HeaderScan from "../components/Psicologia/HeaderScan";
import SelectorAlumno from "../components/Psicologia/SelectorAlumno";
import TipoDocumento from "../components/Psicologia/TipoDocumento";
import ZonaEscaneo from "../components/Psicologia/ZonaEscaneo";
import VistaDocumento from "../components/Psicologia/VistaDocumento";
import BarraProceso from "../components/Psicologia/BarraProceso";
import BotonProcesar from "../components/Psicologia/BotonProcesar";

export default function ScanPsicologia({ cambiarPantalla }) {

    const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);

    const [tipoDocumento, setTipoDocumento] = useState(null);

    const [documento, setDocumento] = useState({

        // Archivo temporal (NO se guarda)
        archivo: null,
    
        // Vista previa
        preview: null,
    
        // Información del archivo
        nombre: "",
    
        tamaño: 0,
    
        tipo: "",
    
        // Alumno seleccionado
        alumno: null,
    
        // Tipo de documento
        tipoDocumento: "Ficha General",
    
        // Estado del proceso
        estado: "Esperando documento",
    
        progreso: 0,
    
        // Resultado OCR
        textoOCR: "",
    
        // Información organizada por IA
        datosExtraidos: null,
    
        // Documento Word generado
        wordGenerado: null,

        urlDocumento:"",

        fechaProcesado:null,

        errores:[]
    
    });

    return(

        <>

            <div className="app-background">

                <div className="bg-wave1"></div>

                <div className="bg-wave2"></div>

                <div className="bg-light"></div>

            </div>

            <div className="ps-app">

                <motion.div

                    className="scan-container"

                    initial={{opacity:0}}

                    animate={{opacity:1}}

                    transition={{duration:.4}}

                >

                  <HeaderScan

                  volver={() => cambiarPantalla("psicologia")}

                  />

                    <SelectorAlumno/>

                    <TipoDocumento/>

                    <ZonaEscaneo

                        documento={documento}

                        setDocumento={setDocumento}

                    />

                    <VistaDocumento

                    documento={documento}

                    />

                    <BarraProceso

                    documento={documento}

                    />

                    <BotonProcesar

                    documento={documento}

                    setDocumento={setDocumento}

                    />

                </motion.div>

            </div>

        </>

    );

}