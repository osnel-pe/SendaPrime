import "../Styles/AppLayout.css";
import "../Styles/Psicologia.css";
import "../Styles/PerfilesPsicologia.css";

import { Search, UserRound, ChevronRight } from "lucide-react";

import PageHeader from "../components/Common/PageHeader";

import fondoPsicologia from "../assets/fondo-psicologia.jpg";

import { useState } from "react";

export default function PerfilesPsicologia({

  students,

  cambiarPantalla,

  setGrupoSeleccionado,

  seleccionarAlumno

}){

    const [busqueda,setBusqueda]=useState("");
    const normalizar = (texto = "") =>
      String(texto)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();
    const grupos = [

      "1ro A",
      "1ro B",
      "1ro C",
      
      "2do A",
      "2do B",
      "2do C",
      
      "3ro A",
      "3ro B"
      
      ];

      const resultados = students.filter((alumno) => {

        const nombre = normalizar(
            `${alumno.nombre || ""} ${alumno.apellido_paterno || ""} ${alumno.apellido_materno || ""}`
        );
    
        const textoBusqueda = normalizar(busqueda);
    
        return nombre.includes(textoBusqueda);
    
    });

    return(

        <>

            <div
                className="app-background"
                style={{
                    backgroundImage:`url(${fondoPsicologia})`
                }}
            />

            <div className="ps-app">

                <div className="ps-container">

                <PageHeader

                  titulo="Perfiles"

                  volver={()=>cambiarPantalla("psicologia")}

                  />
                    <div className="search-box">

                      <Search size={18}/>

                      <input

                          className="search-input"

                          placeholder="Buscar alumno..."

                          value={busqueda}

                          onChange={(e)=>setBusqueda(e.target.value)}

                      />

                      </div>
                      {

                        busqueda===""

                        ?

                        (

                        <div className="grupos-grid">

                        {

                        grupos.map(grupo=>(

                        <div

                        className="grupo-card"

                        key={grupo}

                        onClick={()=>{

                        setGrupoSeleccionado(grupo);

                        cambiarPantalla("grupoPsicologia");

                        }}

                        >

                        <h2>

                        {grupo}

                        </h2>

                        <ChevronRight/>

                        </div>

                        ))

                        }

                        </div>

                        )

                        :

                        (

                        <div className="lista-perfiles">

                        {

                        resultados.map(alumno=>(

                          <div

                          className="perfil-card"

                          key={alumno.id}

                          onClick={()=>{

                              seleccionarAlumno(alumno);

                              cambiarPantalla("perfilAlumnoPsico");

                          }}

                          >

                        <div className="avatar">

                        <UserRound size={24}/>

                        </div>

                        <div className="info-perfil">

                        <h3>

                          {alumno.nombre} {alumno.apellido_paterno} {alumno.apellido_materno}

                          </h3>

                        <p>

                        {alumno.grupo}

                        </p>

                        </div>

                        <ChevronRight/>

                        </div>

                        ))

                        }

                        </div>

                        )

                        }

                </div>

            </div>

        </>

    );

}