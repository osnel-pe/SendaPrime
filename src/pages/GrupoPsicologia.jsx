import { useRef, useState, useEffect } from "react";

import {
  ArrowLeft,
  Search,
  ChevronRight,
  House
  } from "lucide-react";

import "../Styles/GrupoPsicologia.css";
import "../Styles/AppLayout.css";
import "../Styles/Psicologia.css";

import fondoPsicologia from "../assets/fondo-psicologia.jpg";

export default function GrupoPsicologia({

    students,

    grupoSeleccionado,

    cambiarPantalla,

    seleccionarAlumno

}){
  
  const alumnosGrupo = (students || []).filter(

    alumno => alumno.grupo === grupoSeleccionado

  );

  console.log("Grupo seleccionado:", grupoSeleccionado);
console.log("Primer alumno:", students[0]);
console.log("Alumnos del grupo:", alumnosGrupo.length);
  
  const [busqueda,setBusqueda]=useState("");

  const normalizar = (texto = "") =>
    String(texto)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();

    const alumnosFiltrados = alumnosGrupo.filter((alumno) => {

      const nombre = normalizar(
          `${alumno.nombre || ""} ${alumno.apellido_paterno || ""} ${alumno.apellido_materno || ""}`
      );
  
      const textoBusqueda = normalizar(busqueda.trim());
  
      return nombre.includes(textoBusqueda);
  
  });
  const alumnosMostrar =

  busqueda.trim() === ""

  ? alumnosGrupo

  : alumnosFiltrados;


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
              
          <div className="sticky-header">

              <div className="page-top">

                  <button

                      className="back-btn"

                      onClick={()=>cambiarPantalla("perfilPsicopedagogico")}

                  >

                      <ArrowLeft size={22}/>

                  </button>

                  <h1>

                      {grupoSeleccionado}

                  </h1>

                  <button

                      className="home-btn"

                      onClick={()=>cambiarPantalla("psicologia")}

                  >

                      <House size={21}/>

                  </button>

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
          </div>
            <div className="lista-alumnos">

              {

            alumnosMostrar.map(alumno=>(

              <div

              className="alumno-card"

              key={alumno.id}

              onClick={()=>{

              seleccionarAlumno(alumno);

              cambiarPantalla("perfilAlumnoPsico");

              }}

              >
                <div className="avatar-alumno">

                  {

                  `${alumno.nombre?.charAt(0) || ""}${alumno.apellido_paterno?.charAt(0) || ""}`

                  }

                  </div>
                <div className="info-alumno">

                <h3>

                {alumno.nombre} {alumno.apellido_paterno} {alumno.apellido_materno}

                </h3>

                <p>

                {alumno.sexo==="M" ? "Masculino" : "Femenino"}

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
          

       </div>

    </>

  );


}