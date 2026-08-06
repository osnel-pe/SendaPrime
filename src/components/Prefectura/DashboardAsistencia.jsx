import { useEffect, useState } from "react";

import {

    CheckCircle2,

    Clock3,

    CircleX,

    School,

    AlertTriangle,

    TriangleAlert

} from "lucide-react";

import { CircularProgressbar } from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";

import { supabase } from "../../services/supabase";

import "../../Styles/DashboardAsistencia.css";

import { obtenerFechaLocal } from "../../utils/fechaLocal";

export default function DashboardAsistencia({

    students=[],
    setAlumnoSeleccionado,
    cambiarPantalla,
    setModuloPerfil,
    setResumenAsistencia
}){

    const [datos,setDatos]=useState({

        presentes:0,

        tardanzas:0,

        faltas:0,

        completos:0,

        pendientes:0,

        total:0,

        gruposPendientes:[],

        incidencias:[],

        reportes:0

    });

    const [resumenCritico,setResumenCritico]=useState({

        asistencia:[],

        reportes:[]

    });

    useEffect(()=>{

        cargar();

    },[students]);

    async function cargar(){

    const hoy=obtenerFechaLocal();

    const inicioMes=`${hoy.slice(0,7)}-01`;

    const grupos=[
        ...new Set(
            students.map(a=>a.grupo)
        )
    ].sort();

    const {data}=await supabase

    .from("asistencia_prefectura")

    .select("*")

    .eq("fecha",hoy);

    const {data:reportesHoy}=await supabase

    .from("reportes_prefectura")

    .select("id")

    .eq("fecha",hoy);

    const registros=data || [];

    const gruposPendientes=[];

    const incidencias=[];

    let completos=0;

    grupos.forEach(grupo=>{

        const registrosGrupo=

        registros.filter(

            r=>r.grupo===grupo

        );

        if(registrosGrupo.length===0){

            gruposPendientes.push(grupo);

        }

        else{

            completos++;

        }

        const faltas=

        registrosGrupo.filter(

            r=>r.estatus==="falta"

        ).length;

        const tardanzas=

        registrosGrupo.filter(

            r=>r.estatus==="tardanza"

        ).length;

        if(faltas>0 || tardanzas>0){

            incidencias.push({

                grupo,

                faltas,

                tardanzas

            });

        }

    });

    const fechaInicio=

    hoy.substring(0,8)+"01";

    const {data:mesAsistencia}=await supabase

    .from("asistencia_prefectura")

    .select("alumno_id,estatus")

    .gte("fecha",fechaInicio)

    .lte("fecha",hoy);

    const {data:mesReportes}=await supabase

    .from("reportes_prefectura")

    .select("alumno_id")

    .gte("fecha",fechaInicio)

    .lte("fecha",hoy);

    const mapaAsistencia={};

    (mesAsistencia || []).forEach(reg=>{

        if(!mapaAsistencia[reg.alumno_id]){

            mapaAsistencia[reg.alumno_id]={

                faltas:0,

                tardanzas:0

            };

        }

        if(reg.estatus==="falta"){

            mapaAsistencia[reg.alumno_id].faltas++;

        }

        if(reg.estatus==="tardanza"){

            mapaAsistencia[reg.alumno_id].tardanzas++;

        }

    });

    const mapaReportes={};

    (mesReportes || []).forEach(rep=>{

        mapaReportes[rep.alumno_id]=

        (mapaReportes[rep.alumno_id] || 0)+1;

    });

    const alumnosAsistencia=students.filter(al=>{

        const dato=mapaAsistencia[al.id];

        if(!dato) return false;

        return dato.faltas>=3 || dato.tardanzas>=3;

    }).map(al=>({

        ...al,

        faltas:mapaAsistencia[al.id]?.faltas || 0,

        tardanzas:mapaAsistencia[al.id]?.tardanzas || 0

    }));

    const alumnosReportes=students.filter(al=>

        (mapaReportes[al.id] || 0)>=2

    ).map(al=>({

        ...al,

        reportes:mapaReportes[al.id]

    }));

    setResumenCritico({

        asistencia:alumnosAsistencia,

        reportes:alumnosReportes

    });

    const resumen={};

    registros.forEach(reg=>{

        if(
            reg.estatus!=="falta" &&
            reg.estatus!=="tardanza"
        ) return;

        if(!resumen[reg.grupo]){

            resumen[reg.grupo]=[];

        }

        const alumno=students.find(

            a=>a.id===reg.alumno_id

        );

        if(!alumno) return;

        resumen[reg.grupo].push({

            ...alumno,

            estatus:reg.estatus

        });

    });

    setResumenAsistencia(resumen);

    setDatos({

        presentes:

        registros.filter(

            r=>r.estatus==="presente"

        ).length,

        tardanzas:

        registros.filter(

            r=>r.estatus==="tardanza"

        ).length,

        faltas:

        registros.filter(

            r=>r.estatus==="falta"

        ).length,

        completos,

        pendientes:

        grupos.length-completos,

        total:students.length,

        gruposPendientes,

        incidencias,

        reportes:

        reportesHoy?.length || 0

    });

}

    const porcentaje=

    students.length===0

    ?

    0

    :

    Math.round(

        datos.presentes

        / students.length

        *100

    );

    return(

        <>

            <div

                className="dash-card"

                onClick={()=>cambiarPantalla("resumenAsistencia")}

                style={{cursor:"pointer"}}

            >

                <div className="dash-grafico">

                    <CircularProgressbar

                        value={porcentaje}

                        text={`${porcentaje}%`}

                        styles={{

                            path:{

                                stroke:"#4caf50"

                            },

                            trail:{

                                stroke:"rgba(255,255,255,.18)"

                            },

                            text:{

                                fill:"#fff",

                                fontSize:"20px",

                                fontWeight:"700"

                            }

                        }}

                    />

                </div>

                <div className="dash-resumen">

                    <div className="dash-item presente">

                        <CheckCircle2 size={18}/>

                        <div>

                            <strong>{datos.presentes}</strong>

                            <span>Presentes</span>

                        </div>

                    </div>

                    <div className="dash-item tardanza">

                        <Clock3 size={18}/>

                        <div>

                            <strong>{datos.tardanzas}</strong>

                            <span>Tardanzas</span>

                        </div>

                    </div>

                    <div className="dash-item falta">

                        <CircleX size={18}/>

                        <div>

                            <strong>{datos.faltas}</strong>

                            <span>Ausentes</span>

                        </div>

                    </div>

                </div>

            </div>

            <div className="dash-cajas">

                <div

                    className={

                        datos.pendientes===0

                        ?

                        "mini-card grupos completo"

                        :

                        "mini-card grupos pendiente"

                    }

                >

                    <School size={18}/>

                    <h3>

                        {datos.completos}/{datos.completos + datos.pendientes}

                    </h3>

                    <span>

                        Grupos listos

                    </span>

                </div>

                <div

                    className={

                        datos.reportes===0

                        ?

                        "mini-card reportes limpio"

                        :

                        "mini-card reportes alerta"

                    }

                >

                    <AlertTriangle size={18}/>

                    <h3>

                        {datos.reportes}

                    </h3>

                    <span>

                        Reportes

                    </span>

                </div>

            </div>

            <div className="dashboard-panel">

    <h3>

        Resumen crítico

    </h3>

    <div className="dashboard-subtitulo">

        <TriangleAlert size={16}/>

        <span>Tardanzas e inasistencias</span>

    </div>

    {

        resumenCritico.asistencia.length===0

        ?

        <p className="panel-vacio">

            No hay alumnos críticos este mes.

        </p>

        :

        resumenCritico.asistencia.map(alumno=>(

            <div

                key={alumno.id}

                className="critico-card"

                onClick={()=>{

                    setAlumnoSeleccionado(alumno);

                    setModuloPerfil("asistencia");

                    cambiarPantalla("perfilAlumnoPrefectura");

                }}

            >

                <div className="critico-info">

                    <strong>

                        {alumno.nombre} {alumno.apellido_paterno}

                    </strong>

                    <small>

                        {alumno.grupo}

                    </small>

                </div>

                <div className="critico-badges">

                    {

                        alumno.faltas>0 &&

                        <span className="badge-falta">

                            {alumno.faltas} faltas

                        </span>

                    }

                    {

                        alumno.tardanzas>0 &&

                        <span className="badge-tardanza">

                            {alumno.tardanzas} tardanzas

                        </span>

                    }

                </div>

            </div>

        ))

    }

    <div className="dashboard-subtitulo">

        <AlertTriangle size={16}/>

        <span>Reportes</span>

    </div>

    {

        resumenCritico.reportes.length===0

        ?

        <p className="panel-vacio">

            No hay alumnos críticos este mes.

        </p>

        :

        resumenCritico.reportes.map(alumno=>(

            <div

                key={alumno.id}

                className="critico-card"

                onClick={()=>{

                    setAlumnoSeleccionado(alumno);

                    setModuloPerfil("reportes");

                    cambiarPantalla("perfilAlumnoPrefectura");

                }}

            >

                <div className="critico-info">

                    <strong>

                        {alumno.nombre} {alumno.apellido_paterno}

                    </strong>

                    <small>

                        {alumno.grupo}

                    </small>

                </div>

                <div className="critico-badges">

                    <span className="badge-reporte">

                        {alumno.reportes} reportes

                    </span>

                </div>

            </div>

        ))

    }

</div>

        </>

    );

}