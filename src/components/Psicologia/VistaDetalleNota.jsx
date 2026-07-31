import "../../Styles/VistaDetalle.css";

import {

    ArrowLeft,

    User,

    Calendar,

    Pencil

} from "lucide-react";

export default function VistaDetalleNota({

    abierta,

    nota,

    students = [],

    cerrar,

    editar

}){

    console.log("VistaDetalleNota", abierta, nota);

    if(!abierta || !nota) return null;
   
    const alumno = students?.find(

        (student)=>student.id===nota.alumno_id

    );

    return(

        <div className="vista-overlay">

            <div

                className={`vista-card ${nota.color || "verde"}`}

            >

                <div className="vista-top">

                    <button

                        className="vista-back"

                        onClick={cerrar}

                    >

                        <ArrowLeft size={20}/>

                    </button>

                    <div className="vista-title">

                        NOTA

                    </div>

                    <div className="vista-espacio"/>

                </div>

                <div className="vista-info">

                    <div className="vista-item">

                        <label>

                            Alumno

                        </label>

                        <span>

                            <User size={15}/>{" "}

                            {

                                nota.grupo

                                ?

                                `${nota.grupo}`

                                :

                                alumno

                                ?

                                `${alumno.nombre} ${alumno.apellido_paterno} ${alumno.apellido_materno}`

                                :

                                "Sin alumno"

                            }

                        </span>

                    </div>

                    <div className="vista-item">

                        <label>

                            Fecha

                        </label>

                        <span>

                            <Calendar size={15}/>{" "}

                            {

                                nota.created_at

                                ?

    
                                
                                new Date(nota.created_at).toLocaleDateString("es-MX")

                                :

                                "--"

                            }

                        </span>

                    </div>

                </div>

                {

                    nota.titulo &&

                    <div className="vista-section">

                        <h3>

                            Título

                        </h3>

                        <p>

                            {

                                nota.titulo

                            }

                        </p>

                    </div>

                }

                <div className="vista-section">

                    <h3>

                        Nota

                    </h3>

                    <p>

                        {

                            nota.texto ||

                            nota.descripcion ||

                            nota.contenido ||

                            nota.nota ||

                            ""

                        }

                    </p>

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
                        onClick={()=>editar(nota)}
                    >
                        <Pencil size={18}/>
                        Editar
                    </button>

                </div>

            </div>

        </div>

    );

}