import "../Styles/AppLayout.css";
import "../Styles/Psicologia.css";
import "../Styles/CitasProgramadas.css";

import {
    ArrowLeft,
    House,
    Plus,
    Pencil,
    Trash2
} from "lucide-react";

import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import ModalNuevaCita from "../components/Psicologia/ModalNuevaCita";
import fondoPsicologia from "../assets/fondo-psicologia.jpg";
import VistaDetalleCita from "../components/Psicologia/VistaDetalleCita";

export default function CitasProgramadas({

    cambiarPantalla,

    students,

    setStudents,

    embebido = false

}){

    const [citaVista,setCitaVista]=useState(null);
    
    const [modal,setModal]=useState(false);

    const [indiceEditar,setIndiceEditar]=useState(null);

    const [mostrarEliminar,setMostrarEliminar]=useState(false);

    const [citaEliminar,setCitaEliminar]=useState(null);

    const [citas,setCitas]=useState([]);

    useEffect(()=>{

        cargarCitas();

    },[]);

    async function cargarCitas(){

        const {data,error}=await supabase

        .from("citas_programadas")

        .select("*")

        .order("fecha",{ascending:true})

        .order("hora",{ascending:true});

        if(error){

            console.log(error);

            return;

        }

        setCitas(data || []);

    }

    async function guardarCita(datos){

        if(!datos.alumno_id){

            alert("Debes seleccionar un alumno.");

            return;

        }

        if(!datos.fecha){

            alert("Debes seleccionar una fecha.");

            return;

        }

        if(!datos.hora){

            alert("Debes seleccionar una hora.");

            return;

        }

        if(indiceEditar===null){

            const {error}=await supabase

            .from("citas_programadas")

            .insert({

                alumno_id:datos.alumno_id,

                fecha:datos.fecha,

                hora:datos.hora,

                tipo:datos.tipo

            })

            if(error){

                alert(error.message);

                return;

            }

        }else{

            const {error}=await supabase

            .from("citas_programadas")

            .update({

                alumno_id:datos.alumno_id,

                fecha:datos.fecha,

                hora:datos.hora,

                tipo:datos.tipo

            })

            .eq("id",indiceEditar);

            if(error){

                alert(error.message);

                return;

            }

        }

        setIndiceEditar(null);

        setModal(false);

        cargarCitas();

    }

    async function eliminarCita(){

        const {error}=await supabase

        .from("citas_programadas")

        .delete()

        .eq("id",citaEliminar.id);

        if(error){

            alert(error.message);

            return;

        }

        setMostrarEliminar(false);

        setCitaEliminar(null);

        cargarCitas();

    }

    const citasAgrupadas=citas.reduce((acc,cita)=>{

        const fecha=cita.fecha;

        if(!acc[fecha]){

            acc[fecha]=[];

        }

        acc[fecha].push(cita);

        return acc;

    },{});

    function obtenerTituloFecha(fecha){

        const hoy=new Date();

        const manana=new Date();

        manana.setDate(hoy.getDate()+1);

        const [anio,mes,dia]=fecha.split("-");

        const f=new Date(anio,mes-1,dia);

        const hoyTexto=`${hoy.getFullYear()}-${String(hoy.getMonth()+1).padStart(2,"0")}-${String(hoy.getDate()).padStart(2,"0")}`;

        const mananaTexto=`${manana.getFullYear()}-${String(manana.getMonth()+1).padStart(2,"0")}-${String(manana.getDate()).padStart(2,"0")}`;

        if(fecha===hoyTexto){

            return "Hoy:";

        }

        if(fecha===mananaTexto){

            return "Mañana:";

        }

        return f.toLocaleDateString("es-MX",{

            weekday:"long",

            day:"numeric",

            month:"long"

        });

    }

    const contenido=(

        <>

            {
                !embebido && (

                    <div className="sticky-header">

                        <div className="page-top">

                            <button
                                className="back-btn"
                                onClick={()=>cambiarPantalla("psicologia")}
                            >
                                <ArrowLeft size={22}/>
                            </button>

                            <h1>Agenda</h1>

                            <button
                                className="home-btn"
                                onClick={()=>cambiarPantalla("psicologia")}
                            >
                                <House size={20}/>
                            </button>

                        </div>

                    </div>

                )
            }

            <div className="agenda-toolbar">

                <button
                    className="agenda-add"
                    onClick={()=>setModal(true)}
                >
                    <Plus size={18}/>
                    Nueva cita
                </button>

            </div>

            <div className="agenda-lista">

                            {

                Object.keys(citasAgrupadas).length===0

                ?

                (

                    <div className="agenda-vacia">

                        No existen citas programadas.

                    </div>

                )

                :

                Object.entries(citasAgrupadas).map(([fecha,lista])=>(

                    <div

                        key={fecha}

                        className="agenda-dia"

                    >

                        <div className="agenda-fecha">

                            {obtenerTituloFecha(fecha)}

                        </div>

                        {

                            lista.map(cita=>{

                                const alumno=(students||[]).find(

                                    a=>a.id===cita.alumno_id

                                );

                                return(

                                    <div

                                        key={cita.id}

                                        className="agenda-item"

                                        onClick={(e)=>{

                                            if(e.target.closest(".agenda-acciones")){

                                                return;

                                            }

                                            setCitaVista(cita);

                                        }}

                                    >

                                        <div className="agenda-hora">

                                            {cita.hora.slice(0,5)}

                                        </div>

                                        <div className="agenda-info">

                                            <h3>

                                                {alumno?.nombre} {alumno?.apellido_paterno}

                                            </h3>

                                            <p>

                                                {alumno?.grupo}

                                            </p>

                                            <p>

                                                {cita.tipo}

                                            </p>

                                        </div>

                                        <div className="agenda-acciones">

                                            <button

                                                className="agenda-icon editar"

                                                onClick={()=>{

                                                    setIndiceEditar(cita.id);

                                                    setModal(true);

                                                }}

                                            >

                                                <Pencil size={15}/>

                                            </button>

                                            <button

                                                className="agenda-icon eliminar"

                                                onClick={()=>{

                                                    setCitaEliminar(cita);

                                                    setMostrarEliminar(true);

                                                }}

                                            >

                                                <Trash2 size={15}/>

                                            </button>

                                        </div>

                                    </div>

                                );

                            })

                        }

                    </div>

                ))

            }

        </div>

        <ModalNuevaCita

            abierto={modal}

            cerrar={()=>{

                setIndiceEditar(null);

                setModal(false);

            }}

            guardar={guardarCita}

            students={students}

            citaActual={

                indiceEditar===null

                ? null

                : citas.find(c=>c.id===indiceEditar)

            }

        />

        {
    mostrarEliminar && (

        <div className="modal-overlay">
            <div className="modal-nee">

                <h2>Eliminar cita</h2>

                <p>
                    ¿Deseas eliminar esta cita programada?
                </p>

                <div className="eliminar-botones">

                    <button
                        className="btn-cancelar"
                        onClick={()=>{
                            setMostrarEliminar(false);
                            setCitaEliminar(null);
                        }}
                    >
                        Cancelar
                    </button>

                    <button
                        className="btn-eliminar"
                        onClick={eliminarCita}
                    >
                        Eliminar
                    </button>

                </div>

            </div>
        </div>

    )
}

<VistaDetalleCita

    abierta={citaVista!==null}

    cita={citaVista}

    students={students}

    cerrar={()=>setCitaVista(null)}

    editar={(cita)=>{

        setCitaVista(null);

        

        setModal(true);

    }}

    />
                </>

    );

    return (

        <>

            {

                embebido

                ?

                contenido

                :

                <>

                    <div

                        className="app-background"

                        style={{

                            backgroundImage:`url(${fondoPsicologia})`

                        }}

                    />

                    <div className="ps-app">

                        <div className="ps-container">

                            {contenido}

                        </div>

                    </div>

                </>

            }

        </>

    );

}