import { useState } from "react";

import {
    ArrowLeft,
    Search,
    ChevronRight
} from "lucide-react";

import "../Styles/AppLayout.css";
import "../Styles/Psicologia.css";
import "../Styles/GrupoPsicologia.css";

import fondoPsicologia from "../assets/fondo-psicologia.jpg";

import { supabase } from "../services/supabase";

export default function GrupoPrefectura({

    students,

    setStudents,

    grupoSeleccionado,

    cambiarPantalla,

    seleccionarAlumno,

    embebido=false

}){

    const [busqueda,setBusqueda]=useState("");

    const normalizar=(texto="")=>

        String(texto)

        .normalize("NFD")

        .replace(/[\u0300-\u036f]/g,"")

        .replace(/\s+/g," ")

        .trim()

        .toLowerCase();
    
    const alumnosGrupo=(students || []).filter(alumno=>{

    console.log(
        "Comparando:",
        `"${alumno.grupo}"`,
        "==",
        `"${grupoSeleccionado}"`
    );

    return alumno.grupo===grupoSeleccionado;

});

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

            {/* Barra reservada para futuras acciones de Prefectura */}

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

                            cambiarPantalla("perfilAlumnoPrefectura");

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

        </>

    );

}