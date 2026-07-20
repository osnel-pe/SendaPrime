import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import {
  FaUsers,
  FaArrowLeft,
  FaUserGraduate,
  FaCoins
} from "react-icons/fa";

import "../Styles/AppLayout.css";
import "../Styles/Students.css";

export default function Students({

  students,

  cambiarPantalla,

  seleccionarAlumno

}) {

  const [grupoSeleccionado, setGrupoSeleccionado] = useState(() => {

    return localStorage.getItem("grupoSeleccionado");

  });

  useEffect(() => {

    if (grupoSeleccionado) {

      localStorage.setItem(
        "grupoSeleccionado",
        grupoSeleccionado
      );

    } else {

      localStorage.removeItem(
        "grupoSeleccionado"
      );

    }

  }, [grupoSeleccionado]);

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

  const alumnosGrupo = students.filter(

    alumno => alumno.grupo === grupoSeleccionado

  );

  return (

    <>

      <div className="app-background">

        <div className="bg-wave1"></div>

        <div className="bg-wave2"></div>

        <div className="bg-light"></div>

      </div>

      <div className="app">

        <motion.div

          className="main-card students-card"

          initial={{ opacity: 0, y: 25 }}

          animate={{ opacity: 1, y: 0 }}

          transition={{ duration: .45 }}

        >

          {/*======================
                HEADER
          ======================*/}

          <div className="students-header">

            <div className="header-icon">

              <FaUsers />

            </div>

            <div className="header-info">

              {

                grupoSeleccionado ?

                  <>

                    <h1>{grupoSeleccionado}</h1>

                    <p>

                      {alumnosGrupo.length} alumnos registrados

                    </p>

                  </>

                  :

                  <>

                    <h1>Alumnos</h1>

                    <p>

                      Selecciona un grupo

                    </p>

                  </>

              }

            </div>

          </div>

          {/*======================
                GRUPOS
          ======================*/}

          {

            !grupoSeleccionado ?

              (

                <div className="groups-grid">

                  {

                    grupos.map(grupo => (

                      <motion.button

                        whileHover={{ scale: 1.03 }}

                        whileTap={{ scale: .98 }}

                        key={grupo}

                        className="group-button"

                        onClick={() => setGrupoSeleccionado(grupo)}

                      >

                        <div className="group-icon">

                          <FaUsers />

                        </div>

                        <h3>{grupo}</h3>

                      </motion.button>

                    ))

                  }

                </div>

              )

              :

              (

                <div className="students-list">

                  {

                    alumnosGrupo.map((alumno) => (

                      <motion.div

                        key={alumno.id}

                        layout

                        whileHover={{

                          scale: 1.02,

                          y: -2

                        }}

                        whileTap={{

                          scale: .98

                        }}

                        className="student-card"

                        onClick={() => {

                          seleccionarAlumno(alumno);

                          cambiarPantalla("profile");

                        }}

                      >

                        {/* Avatar */}

                        <div className="student-avatar">

                          <FaUserGraduate />

                        </div>

                        {/* Datos */}

                        <div className="student-data">

                          <h3>

                            {alumno.nombre} {alumno.apellido_paterno}

                          </h3>

                          <span>

                            Nivel {alumno.nivel}

                          </span>

                        </div>

                        {/* MathCoins */}

                        <div className="student-coins">

                          <FaCoins />

                          <strong>

                            {alumno.saldo}

                          </strong>

                        </div>

                      </motion.div>

                    ))

                  }

                </div>

              )

          }

          {/*======================
                BOTÓN
          ======================*/}

          <motion.button

            whileHover={{ scale: 1.02 }}

            whileTap={{ scale: .97 }}

            className="btn-back"

            onClick={() => {

              if (grupoSeleccionado) {

                setGrupoSeleccionado(null);

              }

              else {

                cambiarPantalla("teacher");

              }

            }}

          >

            <FaArrowLeft />

            &nbsp;

            {

              grupoSeleccionado ?

                "Cambiar grupo"

                :

                "Regresar"

            }

          </motion.button>

        </motion.div>

      </div>

    </>

  );

}