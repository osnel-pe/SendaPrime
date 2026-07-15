import { motion } from "framer-motion";

import "../../Styles/AccesosRapidos.css";

import {
    UserRound,
    CalendarDays,
    Brain,
    FileText,
    ClipboardList,
    FolderOpen,
    NotebookPen,
    Star
} from "lucide-react";

const accesos = [

    {
        titulo:"Perfiles",
        icono:UserRound,
        pantalla:"perfilPsicopedagogico"
        },
        
        {
        titulo:"Citas",
        icono:CalendarDays,
        pantalla:"citasPsicologia"
        },
        
        {
        titulo:"NEE",
        icono:Brain,
        pantalla:"nee"
        },
        
        {
        titulo: "Files",
        icono: FolderOpen
        },
];

export default function AccesosRapidos({ cambiarPantalla }) {

    return (

        <div className="accesos">

            <div className="accesos-grid">

                {accesos.map((item, index) => {

                    const Icono = item.icono;

                    return (

                        <motion.div

                            key={index}

                            className="acceso-card"

                            whileHover={{
                                y:-4,
                                scale:1.03
                            }}

                            whileTap={{
                                scale:0.96
                            }}

                            onClick={() => item.pantalla && cambiarPantalla(item.pantalla)}

                        >

                            <div className="acceso-icon">

                                <Icono
                                    size={28}
                                    strokeWidth={2.2}
                                />

                            </div>

                            <span>

                                {item.titulo}

                            </span>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}