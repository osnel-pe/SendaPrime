import { useEffect,useState } from "react";

import {

ArrowLeft,

CheckCircle2,

Clock3,

CircleX

} from "lucide-react";

import "../../Styles/ListaPrefectura.css";

import { supabase } from "../../services/supabase";

import { obtenerFechaLocal } from "../../utils/fechaLocal";

export default function GrupoAsistencia({

grupo,

students,

volver

}){

const [lista,setLista]=useState([]);

useEffect(()=>{

    cargarAsistencia();

},[grupo,students]);

async function cargarAsistencia(){

    const hoy = obtenerFechaLocal();

    const alumnos=students

    .filter(

        a=>a.grupo===grupo

    );

    const {data}=await supabase

    .from("asistencia_prefectura")

    .select("*")

    .eq("grupo",grupo)

    .eq("fecha",hoy);

    const listaCompleta=alumnos.map(alumno=>{

        const registro=(data || []).find(

            r=>r.alumno_id===alumno.id

        );

        return{

            ...alumno,

            estatus:

            registro?.estatus || "presente"

        };

    });

    setLista(listaCompleta);

}

function cambiar(id,estatus){

setLista(

    lista.map(a=>

        a.id===id

        ?

        {

            ...a,

            estatus

        }

        :

        a

    )

);

}

async function guardarAsistencia(){

    const hoy = obtenerFechaLocal();

    const registros=lista.map(alumno=>({

        alumno_id:alumno.id,

        grupo:grupo,

        fecha:hoy,

        estatus:alumno.estatus

    }));

    const {error}=await supabase

    .from("asistencia_prefectura")

    .upsert(

        registros,

        {

            onConflict:"alumno_id,fecha"

        }

    );

    if(error){

        alert(error.message);

        return;

    }

    await cargarAsistencia();

    volver();

}

return(

<div className="grupo-asistencia">

<div className="grupo-titulo">

<button

className="back-btn"

onClick={volver}

>

<ArrowLeft size={20}/>

</button>

<h2>

{grupo}

</h2>

</div>

<div className="lista-alumnos">

    {lista.map((alumno,index)=>(

        <div
            key={alumno.id}
            className="alumno-card"
        >

            <div className="alumno-info">

                <span className="numero">

                    {index+1}

                </span>

                <div className="datos-alumno">

                    <strong>

                        {alumno.nombre} {alumno.apellido_paterno}

                    </strong>

                    <p>

                        {alumno.apellido_materno}

                    </p>

                </div>

            </div>

            <div className="estado-botones">

                <button
                    className={
                        alumno.estatus==="presente"
                        ? "estado activo presente"
                        : "estado"
                    }
                    onClick={()=>cambiar(alumno.id,"presente")}
                >
                    <CheckCircle2 size={16}/>
                </button>

                <button
                    className={
                        alumno.estatus==="tardanza"
                        ? "estado activo tardanza"
                        : "estado"
                    }
                    onClick={()=>cambiar(alumno.id,"tardanza")}
                >
                    <Clock3 size={16}/>
                </button>

                <button
                    className={
                        alumno.estatus==="falta"
                        ? "estado activo falta"
                        : "estado"
                    }
                    onClick={()=>cambiar(alumno.id,"falta")}
                >
                    <CircleX size={16}/>
                </button>

            </div>

        </div>

    ))}

</div>

<div className="guardar-contenedor">

    <button
        className="guardar-asistencia"
        onClick={guardarAsistencia}
    >
        Guardar asistencia
    </button>

</div>

</div>

);

}