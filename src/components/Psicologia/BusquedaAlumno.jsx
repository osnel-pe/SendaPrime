//import "../../Styles/BusquedaAlumno.css";

import { Search } from "lucide-react";

export default function BusquedaAlumno(){

return(

<div className="buscar">

<div className="buscar-input">

<Search size={20}/>

<input

type="text"

placeholder="Buscar alumno..."

/>

</div>

</div>

);

}