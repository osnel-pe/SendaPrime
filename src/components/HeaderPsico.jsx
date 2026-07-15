import { FaBell } from "react-icons/fa";
import "./HeaderPsico.css";

export default function HeaderPsico(){

return(

<div className="psico-header">

<div className="psico-header-left">

<div className="psico-logo">

🧠

</div>

<div>

<h2>

Psicología Escolar

</h2>

</div>

</div>

<div className="psico-notification">

<FaBell/>

<span></span>

</div>

</div>

);

}