import "./../../Styles/CitasCard.css";

import {

    Brain,

    Plus,

    Eye,

    Pencil,

    Trash2

} from "lucide-react";

export default function CitasCard({

    citas,

    onAgregar,

    onEditar,

    onEliminar

}){

    const lista = Array.isArray(citas)

        ? citas

        : [];

    return(

        <div className="citas-card">

            <div className="citas-header">

                <div className="citas-title">

                    <Brain size={22}/>

                    <h3>

                        Seguimiento

                    </h3>

                </div>

                <button

                    className="citas-add"

                    onClick={onAgregar}

                >

                    +

                </button>

            </div>

            {

                lista.length===0 ?

                <div className="citas-vacio">

                    No existen registros.

                </div>

                :

                lista.map((cita,index)=>(

                    <div

                        key={index}

                        className="timeline-item"

                    >

                        <div className="timeline-dot"/>

                        <div className="timeline-line"/>

                        <div className="timeline-content">

                            <div className="timeline-fecha">

                                {new Date(cita.fecha).toLocaleDateString(

                                    "es-MX",

                                    {

                                        day:"numeric",

                                        month:"short",

                                        year:"numeric"

                                    }

                                )}

                            </div>

                            <div
                                className={
                                    cita.tipo === "grupal"
                                        ? "timeline-tipo grupal"
                                        : "timeline-tipo individual"
                                }
                            >

                                {
                                    cita.tipo === "grupal"
                                        ? "👥 Seguimiento grupal"
                                        : "👤 Atención individual"
                                }

                            </div>

                            <div className="timeline-motivo">

                                {
                                    cita.tipo === "grupal"

                                        ? cita.tema

                                        : cita.motivo
                                }

                            </div>

                            <div className="timeline-footer">

                                <button

                                    className="timeline-ver"

                                    onClick={()=>onEditar(index)}

                                >

                                    Ver detalles

                                </button>

                                <button

                                    className="timeline-delete"

                                    onClick={()=>onEliminar(index)}

                                >

                                    <Trash2 size={14}/>

                                </button>

                            </div>

                        </div>

                    </div>

                ))

            }

        </div>

    );

}