import { useEffect, useState } from "react";

import {
    Users,
    CheckCircle2,
    Clock3,
    CircleX
} from "lucide-react";

import "../Styles/ListaPrefectura.css";

import { supabase } from "../services/supabase";

import { obtenerFechaLocal } from "../utils/fechaLocal";

export default function ListaPrefectura({

    students=[],
    abrirGrupo

}){

    const [resumen,setResumen]=useState([]);

    const hoy = obtenerFechaLocal();

    useEffect(()=>{

        cargarResumen();

    },[]);

    async function cargarResumen(){

        const grupos=[

            ...new Set(

                students.map(

                    a=>a.grupo

                )

            )

        ].sort();

        const {data}=await supabase

        .from("asistencia_prefectura")

        .select("*")

        .eq("fecha",hoy);

        const lista=[];

        grupos.forEach(grupo=>{

            const registros=(data || []).filter(

                r=>r.grupo===grupo

            );

            lista.push({

                grupo,

                total:students.filter(

                    a=>a.grupo===grupo

                ).length,

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

                completado:

                registros.length>0

            });

        });

        setResumen(lista);

    }

    return(

        <div className="lista-prefectura">

            {

                resumen.map(grupo=>(

                    <div

                        key={grupo.grupo}

                        className={
                        grupo.completado
                        ?
                        "lista-grupo-card completado"
                        :
                        "lista-grupo-card"
                        }

                        onClick={()=>abrirGrupo(grupo.grupo)}

                    >

                        <div className="grupo-header">

                            <Users size={22}/>

                            <div className="grupo-nombre">

                                <h3>

                                    {grupo.grupo}

                                </h3>

                                <span>

                                    ({grupo.total} alumnos)

                                </span>

                            </div>

                        </div>

                        <div className="grupo-info">

                            <div className="info presente">

                                <CheckCircle2 size={16}/>

                                <span>

                                    {grupo.presentes}

                                </span>

                            </div>

                            <div className="info tardanza">

                                <Clock3 size={16}/>

                                <span>

                                    {grupo.tardanzas}

                                </span>

                            </div>

                            <div className="info falta">

                                <CircleX size={16}/>

                                <span>

                                    {grupo.faltas}

                                </span>

                            </div>

                        </div>

                    </div>

                ))

            }

        </div>

    );

}