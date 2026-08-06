import { useEffect, useState } from "react";
import { FilePlus2, FileWarning } from "lucide-react";
import { supabase } from "../services/supabase";
import "../Styles/ReportesPrefectura.css";

import ModalReporte from "../components/Prefectura/ModalReporte";

export default function ReportesPrefectura({

    students,

    setAlumnoSeleccionado,

    cambiarPantalla,

    setModuloPerfil

}){

    const [filtro,setFiltro]=useState("dia");

    const [reportes,setReportes]=useState([]);

    const [modalReporte,setModalReporte]=useState(false);

    const [alumnoNuevoReporte,setAlumnoNuevoReporte]=useState(null);

    useEffect(()=>{

        cargarReportes();

    },[filtro]);

    async function cargarReportes(){

    const hoy=new Date();

    let fechaInicio;

    switch(filtro){

        case "dia":

            fechaInicio=new Date(
                hoy.getFullYear(),
                hoy.getMonth(),
                hoy.getDate()
            );

        break;

        case "semana":

            fechaInicio=new Date(hoy);

            fechaInicio.setDate(
                hoy.getDate()-6
            );

        break;

        default:

            fechaInicio=new Date(
                hoy.getFullYear(),
                hoy.getMonth(),
                1
            );

    }

    function formatearFechaLocal(fecha){

        return `${fecha.getFullYear()}-${
            String(fecha.getMonth()+1).padStart(2,"0")
        }-${
            String(fecha.getDate()).padStart(2,"0")
        }`;

    }

    const inicio = formatearFechaLocal(fechaInicio);

    const {data,error}=await supabase

        .from("reportes_prefectura")

        .select("*")

        .gte("fecha",inicio)

        .order("fecha",{
            ascending:false
        })

        .order("created_at",{
            ascending:false
        });

    if(error){

        console.log(error);

        return;

    }

    if(!data){

        setReportes([]);

        return;

    }

    const ids=[

        ...new Set(
            data.map(r=>r.alumno_id)
        )

    ];

    const {data:alumnos}=await supabase

        .from("alumnos")

        .select("id,nombre,apellido_paterno,apellido_materno,grupo")

        .in("id",ids);

    const mapa={};

    (alumnos || []).forEach(a=>{

        mapa[a.id]=a;

    });

    const lista=data.map(r=>({

        ...r,

        alumno:mapa[r.alumno_id]

    }));

    setReportes(lista);

}

function colorReporte(tipo){

    const t=(tipo || "")
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g,"")
        .toLowerCase();

    switch(t){

        case "aviso":
            return "reporte-aviso";

        case "aviso de conducta":
            return "reporte-aviso-conducta";

        case "nota de conducta":
            return "reporte-nota-conducta";

        case "reporte de conducta":
            return "reporte-reporte-conducta";

        case "suspension":
            return "reporte-suspension";

        default:
            return "reporte-aviso";
    }

}

    return(

        <div className="rp-container">

            <div className="rp-header">

                <select

                    value={filtro}

                    onChange={e=>setFiltro(e.target.value)}

                >

                    <option value="dia">

                        Hoy

                    </option>

                    <option value="semana">

                        Semana

                    </option>

                    <option value="mes">

                        Mes

                    </option>

                </select>

                <button

                        className="rp-add"

                        onClick={()=>{

                            setAlumnoNuevoReporte(null);

                            setModalReporte(true);

                        }}

                    >

                    <FilePlus2 size={18}/>

                    Nuevo reporte

                </button>

            </div>

            <div className="rp-lista">

                {

                    reportes.length===0

                    ?

                    <div className="rp-vacio">

                        No existen reportes.

                    </div>

                    :

                    reportes.map(reporte=>(

                        <div
                            key={reporte.id}

                            className={`pa-card reporte-card ${colorReporte(reporte.tipo)}`}

                            onClick={()=>{

                                if(!reporte.alumno) return;

                                setModuloPerfil("reportes");

                                setAlumnoSeleccionado(reporte.alumno);

                                cambiarPantalla("perfilAlumnoPrefectura");

                            }}
                        >

                            <div className="pa-card-left">

                            <div className="pa-card-icon reporte-icon">

                                <FileWarning size={20}/>

                            </div>

                            <div className="pa-card-text">

                                <h4>

                                    {reporte.tipo}

                                </h4>

                                <h5>

                                    {reporte.alumno?.nombre}{" "}
                                    {reporte.alumno?.apellido_paterno}{" "}
                                    {reporte.alumno?.apellido_materno}

                                </h5>

                                <p>

                                    {reporte.alumno?.grupo}

                                </p>

                                <span>

                                    {reporte.motivo}

                                </span>

                                <small>

                                    {reporte.fecha}

                                </small>

                            </div>

                            </div>

                        </div>

                    ))

                }

            </div>

            <ModalReporte

                abierto={modalReporte}

                cerrar={()=>{

                    setModalReporte(false);

                    setAlumnoNuevoReporte(null);

                }}

                guardar={()=>{

                    setModalReporte(false);

                    setAlumnoNuevoReporte(null);

                    cargarReportes();

                }}

                alumno={alumnoNuevoReporte}

                students={students}

            />

        </div>

    );

}