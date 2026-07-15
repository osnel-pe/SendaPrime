import { motion } from "framer-motion";

import {
  FaCoins,
  FaTrophy,
  FaSignOutAlt,
  FaStar,
  FaArrowUp
} from "react-icons/fa";

import "../Styles/AppLayout.css";
import "../Styles/PanelAlumno.css";

export default function PanelAlumno({

    alumno,
  
    students,
  
    cambiarPantalla,
  
    cerrarSesion
  
  }) {

    const alumnoActual =

        students.find(

        a=>a.id===alumno.id

        ) || alumno;   
    const progreso=((alumnoActual.saldo%200)/200)*100;

    const faltan=200-(alumnoActual.saldo%200);

  return(

  <>

  <div className="app-background">

      <div className="bg-wave1"></div>

      <div className="bg-wave2"></div>

      <div className="bg-light"></div>

  </div>

  <div className="app">

  <motion.div

  className="main-card panel-card"

  initial={{

  opacity:0,

  y:40

  }}

  animate={{

  opacity:1,

  y:0

  }}

  transition={{

  duration:.55

  }}

  >

  <div className="panel-header">

      <div className="panel-avatar">

          👨‍🎓

      </div>

      <div>

          <h1>

          {alumnoActual.nombre}

          </h1>

          <h3>

          {alumnoActual.apellido_paterno} {alumnoActual.apellido_materno}

          </h3>

          <span>

          {alumnoActual.grupo}

          </span>

      </div>

  </div>

  <div className="coins-card">

      <FaCoins className="coins-icon"/>

      <div>

          <small>

          Balance actual

          </small>

          <h2>

          {alumnoActual.saldo}

          </h2>

          <span>

          MathCoins

          </span>

      </div>

  </div>

  <div className="level-card">

      <div className="level-top">

          <div>

              <FaStar/>

              Nivel {alumnoActual.nivel}

          </div>

          <div>

              <FaArrowUp/>

              {faltan} MC

          </div>

      </div>

      <div className="progress-bar">

          <div

          className="progress-fill"

          style={{

          width:`${progreso}%`

          }}

          ></div>

      </div>

      <p>

      Te faltan <strong>{faltan}</strong> MathCoins para subir al siguiente nivel.

      </p>

  </div>

  <button

  className="panel-action"

  onClick={()=>cambiarPantalla("rankingAlumno")}

  >

      <FaTrophy/>

      Ver Ranking

  </button>

  <button

  className="logout-button"

  onClick={cerrarSesion}

  >

      <FaSignOutAlt/>

      Cerrar sesión

  </button>

  </motion.div>

  </div>

  </>

  );

}