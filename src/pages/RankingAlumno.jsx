import { motion } from "framer-motion";

import {
  FaArrowLeft,
  FaCoins,
  FaTrophy
} from "react-icons/fa";

import "../Styles/AppLayout.css";
import "../Styles/RankingAlumno.css";

export default function RankingAlumno({

  alumno,

  students,

  cambiarPantalla

}){

const esPrimero=alumno.grupo.startsWith("1");

const ranking=[...students]

.filter(a=>

esPrimero

?a.grupo.startsWith("1")

:a.grupo.startsWith("2")

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

});

const posicion=

ranking.findIndex(

a=>a.id===alumno.id

)+1;

const top10=ranking.slice(0,10);

const primero=top10[0];

const segundo=top10[1];

const tercero=top10[2];

const restantes=top10.slice(3);

function iniciales(a){

return(

a.nombre.charAt(0)+

a.apellido_paterno.charAt(0)

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

{esPrimero

?

"Primer grado"

:

"Segundo grado"}

</p>

</div>

</div>

{/* PODIO */}

<div className="podium">

{/* SEGUNDO */}

{

segundo&&

<div className="podium-box second">

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

</div>

}

{/* PRIMERO */}

{

primero&&

<div className="podium-box first">

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

</div>

}

{/* TERCERO */}

{

tercero&&

<div className="podium-box third">

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

</div>

}

</div>

{/* RESTO */}

<div className="ranking-list">

{

restantes.map((a,index)=>(

<div

className="ranking-row"

key={a.id}

>

<div className="rank-number">

{index+4}

</div>

<div className="rank-avatar">

{iniciales(a)}

</div>

<div className="rank-info">

<strong>

{a.nombre} {a.apellido_paterno}

</strong>

<small>

{a.grupo}

{" • "}

Nivel {a.nivel}

</small>

</div>

<div className="rank-coins">

<FaCoins/>

{a.saldo}

</div>

</div>

))

}

</div>

{/* MI POSICIÓN */}

<div className="my-position-card">

<h2>

⭐ Tu posición

</h2>

<div className="my-position">

<div className="my-rank">

#{posicion}

</div>

<div className="my-info">

<strong>

{alumno.nombre}

{" "}

{alumno.apellido_paterno}

</strong>

<small>

{alumno.grupo}

{" • "}

Nivel {alumno.nivel}

</small>

</div>

<div className="my-coins">

<FaCoins/>

{alumno.saldo}

</div>

</div>

</div>

<button

className="btn-back"

onClick={()=>cambiarPantalla("panelAlumno")}

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