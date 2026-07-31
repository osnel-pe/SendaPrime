import "../../Styles/VistaDetalle.css";

import{

    ArrowLeft,

    Calendar,

    Clock,

    User,

    Pencil

}from"lucide-react";

export default function VistaDetalleCita({

    abierta,

    cita,

    students,

    cerrar,

    editar

}){

    if(!abierta||!cita)return null;

    const alumno=students.find(

        s=>s.id===cita.alumno_id

    );

    const fecha=new Date(cita.fecha+"T00:00");

    const fechaTexto=fecha.toLocaleDateString(

        "es-MX",

        {

            day:"2-digit",

            month:"2-digit",

            year:"numeric"

        }

    );

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

                        CITA

                    </div>

                    <div className="vista-espacio"/>

                </div>

                <div className="vista-info">

                    <div className="vista-item">

                        <label>Alumno</label>

                        <span>

                            <User size={15}/>{" "}

                            {

                                alumno

                                ?

                                `${alumno.nombre} ${alumno.apellido_paterno}`

                                :

                                "Sin alumno"

                            }

                        </span>

                    </div>

                    <div className="vista-item">

                        <label>Grupo</label>

                        <span>

                            {alumno?.grupo||"--"}

                        </span>

                    </div>

                    <div className="vista-item">

                        <label>Fecha</label>

                        <span>

                            <Calendar size={15}/>{" "}

                            {fechaTexto}

                        </span>

                    </div>

                    <div className="vista-item">

                        <label>Hora</label>

                        <span>

                            <Clock size={15}/>{" "}

                            {cita.hora?.slice(0,5)}

                        </span>

                    </div>

                </div>

                <div className="vista-section">

                    <h3>

                        Tipo

                    </h3>

                    <p>

                        {cita.tipo}

                    </p>

                </div>

                <div className="vista-section">

                    <h3>

                        Motivo

                    </h3>

                    <p>

                        {cita.motivo||"--"}

                    </p>

                </div>

                <div className="vista-section">

                <h3>

                    Intervención realizada

                </h3>

                <p>

                    {cita.intervencion || "--"}

                </p>

            </div>

            <div className="vista-section">

                <h3>

                    Acuerdos

                </h3>

                <p>

                    {cita.acuerdos || "--"}

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
                        onClick={()=>editar(cita)}
                    >
                        <Pencil size={18}/>
                        Editar
                    </button>

                </div>

            </div>

        </div>

    );

}