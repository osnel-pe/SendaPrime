import logo from "../assets/logo.png";

import {
FaChalkboardTeacher,
FaUserGraduate,
FaUsers,
FaBrain,
FaSearch,
FaChevronRight,
FaSchool
} from "react-icons/fa";

import "../Styles/Home.css";
import { motion } from "framer-motion";
import fondoPsicologia from "../assets/fondo-psicologia1.webp";

export default function Home({ cambiarPantalla }) {

  return (

    <>
     <div
      className="app-background"
      style={{
      backgroundImage:`url(${fondoPsicologia})`
      }}
      ></div>

                <motion.div
          className="home-screen"

          initial={{
          opacity:0
          }}

          animate={{
          opacity:1
          }}

          transition={{
          duration:.6
          }}
          >

              <motion.div

              className="home-card"

              initial={{

              y:60,

              opacity:0

              }}

              animate={{

              y:0,

              opacity:1

              }}

              transition={{

              duration:.7

              }}

              >

            <div className="logo-container">

            <img
            className="home-logo"
            src={logo}
            alt="SendaPrime"
            />

            </div>

          {/* PROFESOR */}

          <motion.button

            className="menu-button profesor"
            onClick={()=>cambiarPantalla("loginProfesor")}

            whileHover={{

            scale:1.02

            }}

            whileTap={{

            scale:.96

            }}

            initial={{

            x:-50,

            opacity:0

            }}

            animate={{

            x:0,

            opacity:1

            }}

            transition={{

            delay:.45

            }}
            >

            <div className="menu-left">
              <FaChalkboardTeacher className="menu-icon" />
              <div>

              <div className="menu-text">

                  Profesor

              </div>

              <div className="menu-subtext">

                  Administración

              </div>

          </div>
            </div>

            <FaChevronRight className="menu-arrow" />

         </motion.button>

          {/* ALUMNO */}

          <button
            className="menu-button"
            onClick={() => cambiarPantalla("loginAlumno")}
          >

            <div className="menu-left">
              <FaUserGraduate className="menu-icon" />
              <div>

              <div className="menu-text">

              Alumno

              </div>

              <div className="menu-subtext">

              Mi perfil escolar

              </div>

              </div>
            </div>

            <FaChevronRight className="menu-arrow" />

          </button>

          <div className="home-divider">

          <span>

          Coordinación

          </span>

          </div>

          {/* Dirección */}

          <button
          className="menu-button"
          onClick={()=>cambiarPantalla("loginDireccion")}
          >

          <div className="menu-left">

          <FaSchool className="menu-icon"/>

          <div>

          <div className="menu-text">

          Dirección

          </div>

          <div className="menu-subtext">

          Gestión escolar

          </div>

          </div>

          </div>

          <FaChevronRight className="menu-arrow"/>

          </button>

          {/* PSICOLOGÍA */}

          <button
            className="menu-button"
            onClick={()=>cambiarPantalla("loginPsicologia")}
          >

            <div className="menu-left">
              <FaBrain className="menu-icon" />
              <div>

              <div className="menu-text">

              Psicología

              </div>

              <div className="menu-subtext">

              Seguimiento

              </div>

              </div>
            </div>

            <FaChevronRight className="menu-arrow" />

          </button>

          {/* Prefectura */}

          <button
          className="menu-button"
          onClick={() => cambiarPantalla("loginPrefectura")}
          >

          <div className="menu-left">

          <FaUsers className="menu-icon"/>

          <div>

          <div className="menu-text">

          Prefectura

          </div>

          <div className="menu-subtext">

          Control escolar

          </div>

          </div>

          </div>

          <FaChevronRight className="menu-arrow"/>

          </button>

          <div className="home-footer">

            <hr />

            <span>
              Versión 1.0
            </span>

            <hr />

          </div>

          </motion.div>

        </motion.div>
        

    </>

  );

}