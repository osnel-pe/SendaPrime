import { useState } from "react";
import { motion } from "framer-motion";

import "../Styles/AppLayout.css";
import "../Styles/Auth.css";
import "../Styles/LoginAlumno.css";

import {
  FaUserGraduate,
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
  FaShieldAlt
} from "react-icons/fa";

export default function LoginAlumno({

  students,

  seleccionarAlumno,

  cambiarPantalla,

  setTipoUsuario

}) {

  const [usuario, setUsuario] = useState("");

  const [password, setPassword] = useState("");

  const [mostrarPassword, setMostrarPassword] = useState(false);

  const [error, setError] = useState("");

  function iniciarSesion() {

    setError("");

    const alumno = students.find((a) => {

      const usuarioAlumno = `${a.nombre}.${a.apellido_paterno}`
        .toLowerCase()
        .replace(/\s+/g, "");

      return (

        usuarioAlumno === usuario.toLowerCase()

        &&

        a.apellido_paterno.toLowerCase() === password.toLowerCase()

      );

    });

    if (!alumno) {

      setError("Usuario o contraseña incorrectos");

      return;

    }

    seleccionarAlumno(alumno);

    setTipoUsuario("alumno");

    cambiarPantalla("panelAlumno");

  }

  return (

    <>

      {/* Fondo institucional */}

      <div className="app-background">

        <div className="bg-wave1"></div>

        <div className="bg-wave2"></div>

        <div className="bg-light"></div>

      </div>

      <div className="app">

        <motion.div

          className="main-card auth-card"

          initial={{

            opacity:0,

            y:50

          }}

          animate={{

            opacity:1,

            y:0

          }}

          transition={{

            duration:.55

          }}

        >

          {/* Encabezado */}

          <div className="page-header">

            <div className="page-icon">

              <FaUserGraduate/>

            </div>

            <div>

              <h1>

                Alumno

              </h1>

              <p>

                Acceso a tu perfil escolar

              </p>

            </div>

          </div>

          {/* Usuario */}

          <div className="input-group">

            <label>

              Usuario

            </label>

            <div className="input-wrapper">

              <FaUser className="left-icon"/>

              <input

                type="text"

                placeholder="nombre.apellido"

                value={usuario}

                onChange={(e)=>setUsuario(e.target.value)}

              />

            </div>

          </div>

          {/* Contraseña */}

          <div className="input-group">

            <label>

              Contraseña

            </label>

            <div className="input-wrapper">

              <FaLock className="left-icon"/>

              <input

                type={

                  mostrarPassword

                  ?

                  "text"

                  :

                  "password"

                }

                placeholder="********"

                value={password}

                onChange={(e)=>setPassword(e.target.value)}

              />

              <button

                type="button"

                className="eye-button"

                onClick={()=>setMostrarPassword(!mostrarPassword)}

              >

                {

                  mostrarPassword

                  ?

                  <FaEyeSlash/>

                  :

                  <FaEye/>

                }

              </button>

            </div>

          </div>

          {/* Error */}

          {

            error &&

            <div className="auth-error">

              {error}

            </div>

          }

          {/* Botón Entrar */}

          <button

            className="btn-auth"

            onClick={iniciarSesion}

          >

            Iniciar sesión

          </button>

          {/* Volver */}

          <button

            className="btn-back"

            onClick={()=>cambiarPantalla("home")}

          >

            <FaArrowLeft/>

            Volver

          </button>

          {/* Footer */}

          <div className="footer-login">

            <FaShieldAlt/>

            <span>

              Tus datos escolares están protegidos

            </span>

          </div>

        </motion.div>

      </div>

    </>

  );

}