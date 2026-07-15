import "../Styles/AppLayout.css";
import "../Styles/Teacher.css";

import { motion } from "framer-motion";

import {
  FaUsers,
  FaQrcode,
  FaUserGraduate,
  FaSignOutAlt,
  FaTrophy
} from "react-icons/fa";

export default function Teacher({

  students,

  cambiarPantalla,

  cerrarSesion

}) {

  const totalAlumnos = students.length;

  const totalGrupos = 6;

  return (

    <>

      <div className="app-background">

        <div className="bg-wave1"></div>

        <div className="bg-wave2"></div>

        <div className="bg-light"></div>

      </div>

      <div className="app">

        <motion.div

          className="main-card teacher-card"

          initial={{ opacity: 0, y: 35 }}

          animate={{ opacity: 1, y: 0 }}

          transition={{ duration: .45 }}

        >

          {/* ENCABEZADO */}

          <div className="teacher-header">

            <div className="teacher-icon">

              👨‍🏫

            </div>

            <div>

              <h1>

                Panel del Profesor

              </h1>

              <p>

                Administración General

              </p>

            </div>

          </div>

          {/* ESTADÍSTICAS */}

          <div className="stats-grid">

            <div className="stat-card">

              <div className="stat-icon green">

                <FaUserGraduate/>

              </div>

              <h2>

                {totalAlumnos}

              </h2>

              <span>

                Alumnos

              </span>

            </div>

            <div className="stat-card">

              <div className="stat-icon gold">

                <FaUsers/>

              </div>

              <h2>

                {totalGrupos}

              </h2>

              <span>

                Grupos

              </span>

            </div>

          </div>

          {/* MENÚ */}

          <div className="teacher-actions">

            <motion.button

              whileHover={{ scale: 1.02 }}

              whileTap={{ scale: .96 }}

              className="teacher-button"

              onClick={() => cambiarPantalla("students")}

            >

              <FaUsers/>

              <span>

                Administrar alumnos

              </span>

            </motion.button>

            <motion.button

              whileHover={{ scale: 1.02 }}

              whileTap={{ scale: .96 }}

              className="teacher-button"

              onClick={() => cambiarPantalla("scanner")}

            >

              <FaQrcode/>

              <span>

                Escanear códigos QR

              </span>

            </motion.button>

            <motion.button

              whileHover={{ scale: 1.02 }}

              whileTap={{ scale: .96 }}

              className="teacher-button ranking"

              onClick={() => cambiarPantalla("rankingProfesor")}

            >

              <FaTrophy/>

              <span>

                Ranking General

              </span>

            </motion.button>

          </div>

          {/* CERRAR SESIÓN */}

          <motion.button

            whileHover={{ scale: 1.02 }}

            whileTap={{ scale: .96 }}

            className="logout-button"

            onClick={cerrarSesion}

          >

            <FaSignOutAlt/>

            <span>

              Cerrar sesión

            </span>

          </motion.button>

        </motion.div>

      </div>

    </>

  );

}