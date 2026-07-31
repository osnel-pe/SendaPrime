import { useState } from "react";

import {
    ArrowLeft,
    Search,
    ChevronRight,
    Plus,
    House
} from "lucide-react";

import "../Styles/AppLayout.css";
import "../Styles/Psicologia.css";
import "../Styles/GrupoPsicologia.css";

import fondoPsicologia from "../assets/fondo-psicologia.jpg";

import ModalSeguimientoGrupo from "../components/Psicologia/ModalSeguimientoGrupo";

import { supabase } from "../services/supabase";

export default function GrupoPsicologia({

    students,

    setStudents,

    grupoSeleccionado,

    cambiarPantalla,

    seleccionarAlumno,

    embebido=false

}){

    const [busqueda,setBusqueda]=useState("");

    const [modalGrupo,setModalGrupo]=useState(false);

    const normalizar=(texto="")=>

        String(texto)

        .normalize("NFD")

        .replace(/[\u0300-\u036f]/g,"")

        .replace(/\s+/g," ")

        .trim()

        .toLowerCase();

    const alumnosGrupo=(students || []).filter(

        alumno=>alumno.grupo===grupoSeleccionado

    );

    const alumnosMostrar=alumnosGrupo.filter(alumno=>{

        if(busqueda.trim()==="") return true;

        const nombre=normalizar(

            `${alumno.nombre || ""}

            ${alumno.apellido_paterno || ""}

            ${alumno.apellido_materno || ""}`

        );

        return nombre.includes(

            normalizar(busqueda)

        );

    });

    const guardarSeguimientoGrupo=async(datos)=>{

        const nuevosStudents=[...students];

        for(const alumno of alumnosGrupo){

            const historial=[

                ...(alumno.citas || [])

            ];

            historial.unshift({

                ...datos,

                tipo:"grupal"

            });

            const {error}=await supabase

            .from("alumnos")

            .update({

                citas:historial

            })

            .eq("id",alumno.id);

            if(error){

                alert(error.message);

                return;

            }

            const indice=nuevosStudents.findIndex(

                a=>a.id===alumno.id

            );

            if(indice!==-1){

                nuevosStudents[indice]={

                    ...alumno,

                    citas:historial

                };

            }

        }

        setStudents(nuevosStudents);

        setModalGrupo(false);

        alert("Seguimiento grupal registrado.");

    };

    const contenido=(
            <div className="grupo-wrapper">

        <div className="sticky-header">

            <div className="page-top">

                <h2>

                    {grupoSeleccionado}

                </h2>

            </div>

            <div className="search-box">

                <Search size={18}/>

                <input

                    className="search-input"

                    placeholder="Buscar alumno..."

                    value={busqueda}

                    onChange={(e)=>setBusqueda(e.target.value)}

                />

            </div>

            <div className="grupo-toolbar">

                <button

                    className="btn-seguimiento-grupal"

                    onClick={()=>setModalGrupo(true)}

                >

                    <Plus size={18}/>

                    Seguimiento grupal

                </button>

            </div>

        </div>

        <div className="lista-alumnos">

            {

                alumnosMostrar.length===0

                ?

                (

                    <div className="agenda-vacia">

                        No hay alumnos en este grupo.

                    </div>

                )

                :

                alumnosMostrar.map(alumno=>(

                    <div

                        key={alumno.id}

                        className="alumno-card"

                        onClick={()=>{

                            seleccionarAlumno(alumno);

                            cambiarPantalla("perfilAlumnoPsico");

                        }}

                    >

                        <div className="avatar-alumno">

                            {

                                `${

                                    alumno.nombre?.charAt(0) || ""

                                }${
                                    alumno.apellido_paterno?.charAt(0) || ""
                                }`

                            }

                        </div>

                        <div className="info-alumno">

                            <h3>

                                {alumno.nombre}{" "}

                                {alumno.apellido_paterno}{" "}

                                {alumno.apellido_materno}

                            </h3>

                            <p>

                                {

                                    alumno.sexo==="M"

                                    ?

                                    "Masculino"

                                    :

                                    "Femenino"

                                }

                            </p>

                        </div>

                        <ChevronRight

                            size={22}

                            color="#2B8A57"

                        />

                    </div>

                ))

            }

        </div>

    </div>

);

    return(

        <>

            {

                !embebido && (

                    <div

                        className="app-background"

                        style={{

                            backgroundImage:`url(${fondoPsicologia})`

                        }}

                    />

                )

            }

            {

                embebido

                ?

                contenido

                :

                <div className="ps-app">

                    <div className="ps-container">

                        {contenido}

                    </div>

                </div>

            }

            <ModalSeguimientoGrupo

                abierto={modalGrupo}

                cerrar={()=>setModalGrupo(false)}

                guardar={guardarSeguimientoGrupo}

            />

        </>

    );

}