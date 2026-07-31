import "../../Styles/VistaDetalleNEE.css";

import {
    ArrowLeft,
    Pencil
} from "lucide-react";

export default function VistaDetalleNEE({

    abierta,

    nee,

    cerrar,

    editar

}){

    if(!abierta || !nee){

        return null;

    }

    console.log(nee);

    return(

    <div className="vista-overlay">

        <div className="vista-card">

            <div className="vista-top">

                <button
                    className="vista-back"
                    onClick={cerrar}
                >
                    <ArrowLeft size={20}/>
                </button>

                <div className="vista-title">
                    NEE
                </div>

                <div className="vista-espacio"/>

            </div>

            <div className="vista-body">

                <div className="vista-campo">

                    <label>Diagnóstico</label>

                    <p>{nee.diagnostico}</p>

                </div>

                <div className="vista-campo">

                    <label>Nivel</label>

                    <p>{nee.nivel}</p>

                </div>

                {

                    nee.observaciones &&

                    <div className="vista-campo">

                        <label>Observaciones</label>

                        <p>{nee.observaciones}</p>

                    </div>

                }

            </div>

            <div className="vista-botones">

                <button
                    className="vista-btn cerrar"
                    onClick={cerrar}
                >
                    <ArrowLeft size={18}/>
                    Cerrar
                </button>

                <button
                    className="vista-btn editar"
                    onClick={()=>editar(nee)}
                >
                    <Pencil size={18}/>
                    Editar
                </button>

            </div>

        </div>

    </div>

);

}