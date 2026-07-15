import "../../Styles/IndicadoresAlumno.css";

import {
    Smile,
    GraduationCap,
    ShieldCheck,
    CalendarClock
} from "lucide-react";

const indicadores=[

{

titulo:"Bienestar",

valor:"92%",

icono:Smile,

color:"#22C55E"

},

{

titulo:"Rendimiento",

valor:"Bueno",

icono:GraduationCap,

color:"#3B82F6"

},

{

titulo:"Riesgo",

valor:"Bajo",

icono:ShieldCheck,

color:"#F59E0B"

},

{

titulo:"Última cita",

valor:"4 días",

icono:CalendarClock,

color:"#8B5CF6"

}

];

export default function IndicadoresAlumno(){

return(

<div className="indicadores-grid">

{

indicadores.map((item,index)=>{

const Icono=item.icono;

return(

<div

key={index}

className="indicador-card"

>

<div

className="indicador-icono"

style={{background:item.color}}

>

<Icono size={18}/>

</div>

<div>

<h4>{item.valor}</h4>

<p>{item.titulo}</p>

</div>

</div>

);

})

}

</div>

);

}