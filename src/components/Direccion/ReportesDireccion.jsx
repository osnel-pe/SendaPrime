import { useEffect, useState } from "react";
import { FileWarning, Brain } from "lucide-react";
import { supabase } from "../../services/supabase";
import "../../Styles/ReportesDireccion.css";

export default function ReportesDireccion({

    students,

    setAlumnoSeleccionado,

    cambiarPantalla,

    setModuloPerfil

}){

    const [vista,setVista]=useState("nee");

    const [filtro,setFiltro]=useState("dia");

    const [nee,setNee]=useState([]);

    const [reportes,setReportes]=useState([]);

    useEffect(()=>{

        cargarNEE();

    },[students]);

    useEffect(()=>{

        cargarReportes();

    },[filtro]);

    async function cargarNEE(){

    const {data,error}=await supabase

    .from("alumnos")

    .select("*")

    .order("grupo")

    .order("apellido_paterno");

    if(error){

        console.log(error);

        return;

    }

    const lista=(data || []).filter(al=>{

        return(

            Array.isArray(al.nee) &&

            al.nee.length>0

        );

    });

    setNee(lista);

}

    async function cargarReportes(){

        const hoy=new Date();

        let inicio;

        switch(filtro){

            case "dia":

                inicio=new Date(

                    hoy.getFullYear(),

                    hoy.getMonth(),

                    hoy.getDate()

                );

            break;

            case "semana":

                inicio=new Date(hoy);

                inicio.setDate(

                    hoy.getDate()-6

                );

            break;

            default:

                inicio=new Date(

                    hoy.getFullYear(),

                    hoy.getMonth(),

                    1

                );

        }

        const fechaInicio=`${inicio.getFullYear()}-${String(

            inicio.getMonth()+1

        ).padStart(2,"0")}-${String(

            inicio.getDate()

        ).padStart(2,"0")}`;

                const {data}=await supabase

        .from("reportes_prefectura")

        .select("*")

        .gte("fecha",fechaInicio)

        .order("fecha",{ascending:false})

        .order("created_at",{ascending:false});

        if(!data){

            setReportes([]);

            return;

        }

        const ids=[

            ...new Set(

                data.map(r=>r.alumno_id)

            )

        ];

        const mapa={};

        students

        .filter(a=>ids.includes(a.id))

        .forEach(a=>{

            mapa[a.id]=a;

        });

        setReportes(

            data.map(r=>({

                ...r,

                alumno:mapa[r.alumno_id]

            }))

        );

    }

    function abrirPerfil(alumno,modulo){

        setAlumnoSeleccionado(alumno);

        setModuloPerfil(modulo);

        cambiarPantalla("perfilAlumnoDireccion");

    }

    function colorReporte(tipo){

        const texto=(tipo || "").toLowerCase();

        if(texto.includes("susp")) return "reporte-suspension";

        if(texto.includes("nota")) return "reporte-nota-conducta";

        if(texto.includes("reporte")) return "reporte-reporte-conducta";

        return "reporte-aviso";

    }

    return(

                <div className="rp-container">

            <div className="dr-tabs">

                <button

                    className={vista==="nee"?"activo":""}

                    onClick={()=>setVista("nee")}

                >

                    NEE

                </button>

                <button

                    className={vista==="reportes"?"activo":""}

                    onClick={()=>setVista("reportes")}

                >

                    Reportes

                </button>

            </div>

            {

                vista==="reportes" &&

                <div className="dr-filtro">

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

                </div>

            }

            {

                vista==="nee"

                ?

                <div className="rp-lista">

                    {

                        nee.length===0

                        ?

                        <div className="rp-vacio">

                            No existen alumnos con NEE.

                        </div>

                        :

                       nee.map(alumno=>(

                        <div

                            key={alumno.id}

                            className="pa-card"

                            onClick={()=>{
                                console.log("NEE", alumno);
                                setAlumnoSeleccionado(alumno);
                                setModuloPerfil("nee");
                                cambiarPantalla("perfilAlumnoDireccion");
                            }}

                        >

                            <div className="pa-card-left">

                                <Brain size={22}/>

                                <div className="pa-card-text">

                                    <h4>

                                        {alumno.nombre} {alumno.apellido_paterno}

                                    </h4>

                                    <p>

                                        {alumno.grupo}

                                    </p>

                                    {

                                        alumno.nee.map((item,index)=>(

                                            <div

                                                key={index}

                                                className="nee-item"

                                            >

                                                <strong>

                                                    {item.diagnostico}

                                                </strong>

                                                <span>

                                                    {item.nivel}

                                                </span>

                                            </div>

                                        ))

                                    }

                                </div>

                            </div>

                        </div>

                    ))

                    }

                </div>

                                :

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
                                    console.log("Reporte", reporte.alumno);

                                    setAlumnoSeleccionado(reporte.alumno);
                                    setModuloPerfil("reportes");
                                    cambiarPantalla("perfilAlumnoDireccion");
                                }}

                            >

                                <div className="pa-card-left">

                                    <FileWarning size={20}/>

                                    <div className="pa-card-text">

                                        <h4>

                                            {reporte.tipo}

                                        </h4>

                                        <h5>

                                            {reporte.alumno?.nombre}{" "}
                                            {reporte.alumno?.apellido_paterno}{" "}
                                            {reporte.alumno?.apellido_materno}

                                        </h5>

                                        <p className="reporte-grupo">

                                            Grupo: {reporte.alumno?.grupo}

                                        </p>

                                        <div className="reporte-motivo">

                                            {reporte.motivo}

                                        </div>

                                        <small>

                                            {reporte.fecha} · {

                                                reporte.created_at
                                                ? new Date(reporte.created_at).toLocaleTimeString(
                                                    "es-MX",
                                                    {
                                                        hour:"2-digit",
                                                        minute:"2-digit"
                                                    }
                                                )
                                                : ""

                                            }

                                        </small>

                                    </div>

                                </div>

                            </div>

                        ))

                    }

                </div>

            }

        </div>

    );

}