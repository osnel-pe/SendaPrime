import "./../../Styles/ExpedienteCard.css";

import {
    FolderOpen,
    FileText,
    Upload,
    Trash2
} from "lucide-react";

export default function ExpedienteCard({

    tieneExpediente = false,

    onOpen = () => {},

    onUpload = () => {},

    onDelete = () => {}

}) {

    return (

        <div className="expediente-card">

            <div className="expediente-header">

                <FolderOpen size={24} />

                <h3>Expediente</h3>

            </div>

            {

                tieneExpediente ?

                <>

                    <div className="expediente-documento">

                    <div
                        className="expediente-info"
                        onClick={onOpen}
                    >

                        <FileText size={20} />

                        <div>

                            <div className="expediente-nombre">

                                Ficha General

                            </div>

                            <div className="expediente-descripcion">

                                Documento registrado

                            </div>

                        </div>

                    </div>

                    <div className="expediente-acciones">

                        <button
                            className="icon-btn replace"
                            onClick={onUpload}
                        >

                            <Upload size={17} />

                        </button>

                        <button
                            className="icon-btn delete"
                            onClick={onDelete}
                        >

                            <Trash2 size={17} />

                        </button>

                    </div>

                </div>

                </>

                :

                <>

                    <p className="expediente-vacio">

                        No existe un expediente registrado.

                    </p>

                    <button
                        className="btn-subir-expediente"
                        onClick={onUpload}
                    >

                        <Upload size={18} />

                        Subir ficha general

                    </button>

                </>

            }

        </div>

    );

}