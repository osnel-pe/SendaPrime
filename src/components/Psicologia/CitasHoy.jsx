import { motion } from "framer-motion";
import { CalendarDays, Plus, Clock } from "lucide-react";

import "../../Styles/CitasHoy.css";

const citas = [

{
    hora:"09:00",
    alumno:"Juan Pérez López",
    grupo:"2° B",
    motivo:"Entrevista inicial"
},

{
    hora:"11:30",
    alumno:"María García Ruiz",
    grupo:"1° A",
    motivo:"Seguimiento"
},

{
    hora:"13:00",
    alumno:"Luis Hernández",
    grupo:"2° A",
    motivo:"Orientación"
}

];

export default function CitasHoy(){

return(

<motion.section

className="citas-card"

initial={{opacity:0,y:20}}

animate={{opacity:1,y:0}}

transition={{duration:.4}}

>

<div className="citas-header">

<div className="titulo">

<CalendarDays size={20}/>

<h3>Citas de hoy</h3>

</div>

<button className="ver-todas">

Ver todas

</button>

</div>

<div className="lista-citas">

{

citas.map((cita,index)=>(

<div

key={index}

className="cita"

>

<div className="hora">

<Clock size={16}/>

<span>{cita.hora}</span>

</div>

<div className="info">

<h4>{cita.alumno}</h4>

<p>

{cita.grupo} • {cita.motivo}

</p>

</div>

</div>

))

}

</div>

<button className="btn-cita">

<Plus size={18}/>

Nueva cita

</button>

</motion.section>

);

}