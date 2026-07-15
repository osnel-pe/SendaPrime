import { useState } from "react";
import { motion } from "framer-motion";

import "../Styles/AppLayout.css";
import "../Styles/RankingProfesor.css";

import {
  FaArrowLeft,
  FaCoins,
  FaTrophy
} from "react-icons/fa";

export default function RankingProfesor({

  students,

  cambiarPantalla

}) {

  const [grado,setGrado]=useState(1);

  const ranking=[...students]

  .filter(alumno=>

    grado===1

    ? alumno.grupo.startsWith("1")

    : alumno.grupo.startsWith("2")

  )

  .sort((a,b)=>{

    if(b.saldo!==a.saldo){

      return b.saldo-a.saldo;

    }

    const nombreA=`${a.nombre} ${a.apellido_paterno}`;

    const nombreB=`${b.nombre} ${b.apellido_paterno}`;

    return nombreA.localeCompare(

      nombreB,

      "es",

      {

        sensitivity:"base"

      }

    );

  })

  .slice(0,10);

  const primero=ranking[0];

  const segundo=ranking[1];

  const tercero=ranking[2];

  const restantes=ranking.slice(3);

  function iniciales(alumno){

    if(!alumno) return "";

    return (

      alumno.nombre.charAt(0)+

      alumno.apellido_paterno.charAt(0)

    ).toUpperCase();

  }

  return(

    <>

    <div className="app-background">

      <div className="bg-wave1"></div>

      <div className="bg-wave2"></div>

      <div className="bg-light"></div>

    </div>

    <div className="app">

      <motion.div

      className="main-card ranking-profesor-card"

      initial={{opacity:0,y:35}}

      animate={{opacity:1,y:0}}

      transition={{duration:.45}}

      >

      {/* HEADER */}

      <div className="ranking-header">

        <div className="ranking-icon">

          <FaTrophy/>

        </div>

        <div>

          <h1>

            Ranking General

          </h1>

          <p>

            Compite, suma MathCoins y alcanza la cima.

          </p>

        </div>

      </div>

      {/* TABS */}

      <div className="ranking-tabs">

        <button

        className={grado===1?"active":""}

        onClick={()=>setGrado(1)}

        >

          Primer grado

        </button>

        <button

        className={grado===2?"active":""}

        onClick={()=>setGrado(2)}

        >

          Segundo grado

        </button>

      </div>

      {/* PODIO */}

      <div className="podium">

        {/* SEGUNDO */}

        {

          segundo&&

          <motion.div

          className="podium-box second"

          initial={{opacity:0,y:30}}

          animate={{opacity:1,y:0}}

          >

            <div className="avatar silver">

              {iniciales(segundo)}

            </div>

            <div className="medal">

              🥈

            </div>

            <h3>

              {segundo.nombre}

            </h3>

            <small>

              {segundo.apellido_paterno}

            </small>

            <span>

              {segundo.grupo}

            </span>

            <div className="coins">

              <FaCoins/>

              {segundo.saldo}

            </div>

            <div className="step silver-step">

              2

            </div>

          </motion.div>

        }

        {/* PRIMERO */}

        {

          primero&&

          <motion.div

          className="podium-box first"

          initial={{opacity:0,y:30}}

          animate={{opacity:1,y:0}}

          transition={{delay:.15}}

          >

            <div className="avatar gold">

              {iniciales(primero)}

            </div>

            <div className="medal">

              🥇

            </div>

            <h3>

              {primero.nombre}

            </h3>

            <small>

              {primero.apellido_paterno}

            </small>

            <span>

              {primero.grupo}

            </span>

            <div className="coins">

              <FaCoins/>

              {primero.saldo}

            </div>

            <div className="step gold-step">

              1

            </div>

          </motion.div>

        }

        {/* TERCERO */}

        {

          tercero&&

          <motion.div

          className="podium-box third"

          initial={{opacity:0,y:30}}

          animate={{opacity:1,y:0}}

          transition={{delay:.3}}

          >

            <div className="avatar bronze">

              {iniciales(tercero)}

            </div>

            <div className="medal">

              🥉

            </div>

            <h3>

              {tercero.nombre}

            </h3>

            <small>

              {tercero.apellido_paterno}

            </small>

            <span>

              {tercero.grupo}

            </span>

            <div className="coins">

              <FaCoins/>

              {tercero.saldo}

            </div>

            <div className="step bronze-step">

              3

            </div>

          </motion.div>

        }

      </div>

      {/* RESTO DEL RANKING */}

      <div className="ranking-list">

        {

          restantes.map((alumno,index)=>(

            <motion.div

            key={alumno.id}

            className="ranking-row"

            initial={{opacity:0,x:-20}}

            animate={{opacity:1,x:0}}

            transition={{delay:.45+index*.05}}

            >

              <div className="rank-number">

                {index+4}

              </div>

              <div className="rank-avatar">

                {iniciales(alumno)}

              </div>

              <div className="rank-info">

                <strong>

                  {alumno.nombre} {alumno.apellido_paterno}

                </strong>

                <small>

                  {alumno.grupo} • Nivel {alumno.nivel}

                </small>

              </div>

              <div className="rank-coins">

                <FaCoins/>

                {alumno.saldo}

              </div>

            </motion.div>

          ))

        }

      </div>

      <button

      className="btn-back"

      onClick={()=>cambiarPantalla("teacher")}

      >

        <FaArrowLeft/>

        &nbsp;

        Regresar

      </button>

      </motion.div>

    </div>

    </>

  );

}