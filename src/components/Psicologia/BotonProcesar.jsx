import "../../Styles/BotonProcesar.css";

import { Sparkles, LoaderCircle, CheckCircle2 } from "lucide-react";

import { procesarDocumento } from "./ProcesadorDocumento";

export default function BotonProcesar({

    documento,

    setDocumento

}){

    const iniciarProceso = async () => {

        await procesarDocumento(

            documento,

            setDocumento

        );

    };

    const procesando =
        documento.progreso > 0 &&
        documento.progreso < 100;

    const terminado =
        documento.progreso === 100;

    return(

        <button

            className="btn-procesar"

            onClick={iniciarProceso}

            disabled={procesando}

        >

            {

                procesando ?

                <LoaderCircle

                    size={22}

                    className="spin"

                />

                :

                terminado ?

                <CheckCircle2 size={22}/>

                :

                <Sparkles size={22}/>

            }

            {

                procesando ?

                "Procesando..."

                :

                terminado ?

                "Documento procesado"

                :

                "Procesar documento"

            }

        </button>

    );

}