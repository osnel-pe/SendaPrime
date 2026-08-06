import { useEffect, useState } from "react";

import { Clock3, CircleX } from "lucide-react";

import { supabase } from "../../services/supabase";

import "../../Styles/TarjetaAsistenciaAlumno.css";

import VistaDetalleAsistencia from "./VistaDetalleAsistencia";

export default function TarjetaAsistenciaAlumno({ alumnoId }){
    const mesActual=new Date().getMonth()+1;

    const añoActual=new Date().getFullYear();

    const [mes,setMes]=useState(mesActual);

    const [verDetalle,setVerDetalle]=useState(false);

    const [datos,setDatos]=useState({

        tardanzas:0,

        faltas:0

    });

    const [asistencias,setAsistencias]=useState([]);

    const incidencias = asistencias.filter(a=>

        a.estatus==="tardanza" ||

        a.estatus==="falta"

    );

    useEffect(()=>{

        if(!alumnoId) return;

        cargar();

    },[alumnoId, mes]);

    async function cargar(){

        const inicio = new Date(añoActual, mes-1, 1)
        .toISOString()
        .slice(0,10);

        const fin = new Date(añoActual, mes, 0)
        .toISOString()
        .slice(0,10);

        const { data, error } = await supabase
            .from("asistencia_prefectura")
            .select("fecha, estatus")
            .eq("alumno_id", alumnoId)
            .gte("fecha", inicio)
            .lte("fecha", fin);

        if(error){
            console.log(error);
            return;
        }

        const registros=data || [];

        setAsistencias(registros);

        setDatos({
            tardanzas:registros.filter(r=>r.estatus==="tardanza").length,
            faltas:registros.filter(r=>r.estatus==="falta").length
        });

    }

    const meses=[

        "Enero",

        "Febrero",

        "Marzo",

        "Abril",

        "Mayo",

        "Junio",

        "Julio",

        "Agosto",

        "Septiembre",

        "Octubre",

        "Noviembre",

        "Diciembre"

    ];

    if(verDetalle){

    return(

    <VistaDetalleAsistencia

    registros={incidencias}

    cerrar={()=>setVerDetalle(false)}

    />

    );

    }

    return(

        <div className="card-asistencia">

            <div className="cabecera-asistencia">

                <h3>

                    Resumen

                </h3>

                <select

                    value={mes}

                    onChange={e=>setMes(Number(e.target.value))}

                >

                    {

                        meses.map((nombre,index)=>(

                            <option

                                key={index}

                                value={index+1}

                            >

                                {nombre}

                            </option>

                        ))

                    }

                </select>

            </div>

            <div className="fila-asistencia">

                <Clock3/>

                <span>

                    Tardanzas

                </span>

                <strong>

                    {datos.tardanzas}

                </strong>

            </div>

            <div className="fila-asistencia">

                <CircleX/>

                <span>

                    Inasistencias

                </span>

                <strong>

                    {datos.faltas}

                </strong>

            </div>

            <button

            className="ta-detalle-btn"

            onClick={()=>setVerDetalle(true)}

            >

            Detalles

            </button>

        </div>

    );

}