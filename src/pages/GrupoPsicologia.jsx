import { useRef, useState, useEffect } from "react";

import {
  ArrowLeft,
  Search,
  ChevronRight,
  Plus,
  House
  } from "lucide-react";

import "../Styles/GrupoPsicologia.css";
import "../Styles/AppLayout.css";
import "../Styles/Psicologia.css";

import fondoPsicologia from "../assets/fondo-psicologia.jpg";
import ModalSeguimientoGrupo from "../components/Psicologia/ModalSeguimientoGrupo";
import { supabase } from "../services/supabase";

export default function GrupoPsicologia({

    students,
    
    setstudents,

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

  const [modalGrupo,setModalGrupo]=useState(false);

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

  const guardarSeguimientoGrupo = async(datos)=>{

      const alumnosActualizados = [];

      for(const alumno of students.filter(
          a=>a.grupo===grupoSeleccionado
      )){

          const historial = [...(alumno.citas || [])];

          historial.unshift({

              ...datos,

              tipo:"grupal"

          });

          const { error } = await supabase

              .from("alumnos")

              .update({

                  citas: historial

              })

              .eq("id", alumno.id);

          if(error){

              alert(error.message);

              return;

          }

          alumnosActualizados.push({

              ...alumno,

              citas: historial

          });

      }

      setStudents(alumnosActualizados);

      setModalGrupo(false);

      alert("Seguimiento grupal registrado.");

  };

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

            <div className="grupo-toolbar">

                <button
                    className="btn-seguimiento-grupal"
                    onClick={()=>setModalGrupo(true)}
                >

                    <Plus size={18}/>

                    Seguimiento

                </button>

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

        <ModalSeguimientoGrupo

            abierto={modalGrupo}

            cerrar={()=>setModalGrupo(false)}

            guardar={guardarSeguimientoGrupo}

        />

    </>

  );


}