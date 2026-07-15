import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../services/supabase";

import "../Styles/AppLayout.css";
import "../Styles/Auth.css";
import "../Styles/LoginProfesor.css";

import {
  FaUserTie,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
  FaShieldAlt
} from "react-icons/fa";

export default function LoginProfesor({

  cambiarPantalla,

  setTipoUsuario

}) {

  const [correo, setCorreo] = useState("");

  const [password, setPassword] = useState("");

  const [mostrarPassword, setMostrarPassword] = useState(false);

  const [error, setError] = useState("");

  const [cargando, setCargando] = useState(false);

  async function iniciarSesion() {

    setError("");

    setCargando(true);

    const { error } = await supabase.auth.signInWithPassword({

      email: correo,

      password

    });

    if (error) {

      setError("Correo o contraseña incorrectos");

      setCargando(false);

      return;

    }

    setTipoUsuario("profesor");

    setCargando(false);

    cambiarPantalla("teacher");

  }

  return (

    <>

      {/* Fondo institucional */}

      <div className="app-background">

        <div className="bg-wave1"></div>

        <div className="bg-wave2"></div>

        <div className="bg-light"></div>

      </div>

      {/* Pantalla */}

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

              <FaUserTie />

            </div>

            <div>

              <h1>Profesor</h1>

              <p>

                Acceso administrativo

              </p>

            </div>

          </div>

          {/* Correo */}

          <div className="input-group">

            <label>

              Correo electrónico

            </label>

            <div className="input-wrapper">

              <FaEnvelope className="left-icon"/>

              <input

                type="email"

                placeholder="ejemplo@correo.com"

                value={correo}

                onChange={(e)=>setCorreo(e.target.value)}

              />

            </div>

          </div>

          {/* Password */}

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

                className="eye-button"

                type="button"

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

          {/* Entrar */}

          <button

            className="btn-auth"

            onClick={iniciarSesion}

            disabled={cargando}

          >

            {

              cargando

              ?

              <div className="spinner"></div>

              :

              "Iniciar sesión"

            }

          </button>

          {/* Regresar */}

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

              Acceso seguro

            </span>

          </div>

        </motion.div>

      </div>

    </>

  );

}