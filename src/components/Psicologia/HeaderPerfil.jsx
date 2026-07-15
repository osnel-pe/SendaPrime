//import "../../Styles/HeaderPerfil.css";

import { ArrowLeft } from "lucide-react";

export default function HeaderPerfil(){

return(

<div className="perfil-header">

<button className="volver">

<ArrowLeft size={20}/>

</button>

<div>

<h1>

Perfil Psicopedagógico

</h1>

<p>

Consulta y seguimiento integral

</p>

</div>

</div>

);

}