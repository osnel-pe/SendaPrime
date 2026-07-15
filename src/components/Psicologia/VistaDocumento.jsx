import "../../Styles/VistaDocumento.css";

import {
    FileImage,
    Clock3
} from "lucide-react";

export default function VistaDocumento(){

    return(

        <div className="vista-documento">

            <h3>

                Documento seleccionado

            </h3>

            <div className="preview-card">

                <div className="preview-miniatura">

                    <FileImage size={48}/>

                </div>

                <div className="preview-info">

                    <h4>

                        Ficha General.pdf

                    </h4>

                    <p>

                        2 páginas • 1.8 MB

                    </p>

                    <div className="estado">

                        <Clock3 size={16}/>

                        Pendiente de procesar

                    </div>

                </div>

            </div>

        </div>

    );

}