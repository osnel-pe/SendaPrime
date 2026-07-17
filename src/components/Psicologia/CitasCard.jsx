import "./../../Styles/CitasCard.css";

import {

    Brain,

    Plus,

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

                        className="cita-item"

                    >

                        <div className="cita-info">

                            <strong>

                                {cita.fecha}

                            </strong>

                            <div>

                                {cita.tipo}

                            </div>

                            <p>

                                {cita.motivo}

                            </p>

                        </div>

                        <div className="cita-acciones">

                            <button

                                onClick={()=>onEditar(index)}

                            >

                                <Pencil size={17}/>

                            </button>

                            <button

                                onClick={()=>onEliminar(index)}

                            >

                                <Trash2 size={17}/>

                            </button>

                        </div>

                    </div>

                ))

            }

        </div>

    );

}