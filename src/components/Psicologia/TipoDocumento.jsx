import "../../Styles/TipoDocumento.css";

import {
    FileText,
    ClipboardList,
    HeartPulse,
    FolderOpen
} from "lucide-react";

const documentos = [

    {
        icono: ClipboardList,
        titulo: "Ficha General"
    },

    {
        icono: HeartPulse,
        titulo: "Valoración"
    },

    {
        icono: FileText,
        titulo: "Informe"
    },

    {
        icono: FolderOpen,
        titulo: "Otro"
    }

];

export default function TipoDocumento(){

    return(

        <div className="tipo-documento">

            <h3>

                Tipo de documento

            </h3>

            <div className="tipo-grid">

                {documentos.map((item,index)=>{

                    const Icono=item.icono;

                    return(

                        <button

                            key={index}

                            className="tipo-card"

                        >

                            <Icono size={28}/>

                            <span>

                                {item.titulo}

                            </span>

                        </button>

                    );

                })}

            </div>

        </div>

    );

}