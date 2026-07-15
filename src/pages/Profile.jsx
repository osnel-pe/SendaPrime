import { motion } from "framer-motion";
import ProgressBar from "../components/ProgressBar";
import "../Styles/Profile.css";

import {
  FaUserGraduate,
  FaCoins,
  FaArrowUp,
  FaArrowDown,
  FaArrowLeft,
  FaStar
} from "react-icons/fa";

export default function Profile({

  alumno,

  agregarMathCoins,

  cambiarPantalla

}) {

  if (!alumno) {

    return (

      <div className="app">

        <div className="main-card">

          <h2>No hay alumno seleccionado</h2>

          <button
            className="btn-primary full"
            onClick={() => cambiarPantalla("students")}
          >

            Volver

          </button>

        </div>

      </div>

    );

  }

  const progreso = (alumno.saldo % 200) / 2;

  const faltan = 200 - (alumno.saldo % 200);

  async function modificar(cantidad) {

    await agregarMathCoins(alumno.id, cantidad);

  }

  return (

    <>

      <div className="app-background">

        <div className="bg-wave1"></div>

        <div className="bg-wave2"></div>

        <div className="bg-light"></div>

      </div>

      <motion.div

        className="app"

        initial={{ opacity: 0 }}

        animate={{ opacity: 1 }}

        transition={{ duration: .45 }}

      >

        <motion.div

          className="main-card profile-card"

          initial={{

            y: 35,

            opacity: 0

          }}

          animate={{

            y: 0,

            opacity: 1

          }}

          transition={{

            duration: .55

          }}

        >

          {/* ENCABEZADO */}

          <div className="profile-header">

            <div className="page-icon">

              <FaUserGraduate />

            </div>

            <div className="profile-info">

              <h1>

                {alumno.nombre} {alumno.apellido_paterno}

              </h1>

               <span>

                Grupo {alumno.grupo}

              </span>

            </div>

          </div>

          {/* TARJETA MATHCOINS */}

          <motion.div

            className="wallet-card"

            animate={{

              scale: [1, 1.03, 1]

            }}

            transition={{

              duration: .45

            }}

          >

            <div className="wallet-title">

              <FaCoins />

              <span>MathCoins</span>

            </div>

            <motion.h1

              key={alumno.saldo}

              initial={{

                scale: 1.35,

                opacity: .25

              }}

              animate={{

                scale: 1,

                opacity: 1

              }}

              transition={{

                duration: .30

              }}

            >

              {alumno.saldo}

            </motion.h1>

            <small>

              Saldo disponible

            </small>

          </motion.div>

          {/* NIVEL */}

          <div className="level-box">

            <div className="level-header">

              <div>

                <FaStar />

                &nbsp;

                Nivel {alumno.nivel}

              </div>

              <span>

                {faltan} para subir

              </span>

            </div>

            <ProgressBar

              progreso={progreso}

            />

          </div>

          {/* AGREGAR */}

          <h3 className="section-title">

            <FaArrowUp />

            Agregar MathCoins

          </h3>

          <div className="coins-grid">

            {

              [5, 10, 20, 50, 100].map(valor => (

                <motion.button

                  key={valor}

                  whileHover={{

                    scale: 1.06

                  }}

                  whileTap={{

                    scale: .92

                  }}

                  onClick={() => modificar(valor)}

                >

                  +{valor}

                </motion.button>

              ))

            }

          </div>

          {/* QUITAR */}

          <h3 className="section-title danger">

            <FaArrowDown />

            Descontar MathCoins

          </h3>

          <div className="coins-grid danger">

            {

              [5, 10, 20, 50, 100].map(valor => (

                <motion.button

                  key={valor}

                  whileHover={{

                    scale: 1.06

                  }}

                  whileTap={{

                    scale: .92

                  }}

                  onClick={() => modificar(-valor)}

                >

                  -{valor}

                </motion.button>

              ))

            }

          </div>

          {/* BOTÓN */}

          <motion.button

            className="btn-primary full"

            whileHover={{

              scale: 1.02

            }}

            whileTap={{

              scale: .96

            }}

            onClick={() => cambiarPantalla("students")}

          >

            <FaArrowLeft />

            &nbsp;

            Regresar

          </motion.button>

        </motion.div>

      </motion.div>

    </>

  );

}