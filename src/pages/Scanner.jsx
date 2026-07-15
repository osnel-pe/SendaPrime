import { useState } from "react";

import {
FaCoins,
FaArrowLeft,
FaQrcode,
FaUserGraduate
} from "react-icons/fa";

import CameraScanner from "../components/CameraScanner";

import "../Styles/AppLayout.css";
import "../Styles/Scanner.css";

export default function Scanner({

students,

agregarMathCoins,

cambiarPantalla

}){

const [alumno,setAlumno]=useState(null);

function buscarAlumno(codigo){

const encontrado=students.find(

a=>String(a.id)===codigo

);

if(encontrado){

setAlumno(encontrado);

}

}

async function sumar(cantidad){

await agregarMathCoins(

alumno.id,

cantidad

);

setTimeout(()=>{

setAlumno(null);

},1200);

}

const botones=[5,10,20,50,100];

return(

<>

<div className="app-background">

<div className="bg-wave1"></div>

<div className="bg-wave2"></div>

<div className="bg-light"></div>

</div>

<div className="app">

<div className="main-card scanner-card">

<div className="page-header">

<div className="page-icon">

<FaQrcode/>

</div>

<div>

<h1>

Escanear QR

</h1>

<p>

Entrega o descuenta MathCoins

</p>

</div>

</div>

{

!alumno &&

<>

<div className="camera-frame">

<CameraScanner

onScan={buscarAlumno}

/>

<div className="scan-line"></div>

</div>

<p className="scanner-text">

Coloca el código QR dentro del recuadro.

</p>

</>

}

{

alumno &&

<>

<div className="scan-result-card">

<div className="student-avatar">

<FaUserGraduate/>

</div>

<h2>

{alumno.nombre}

</h2>

<p>

{alumno.apellido_paterno} {alumno.apellido_materno}

</p>

<span>

{alumno.grupo}

</span>

<div className="current-coins">

<FaCoins/>

{alumno.saldo}

</div>

</div>

<h3>

Agregar MathCoins

</h3>

<div className="coins-grid">

{

botones.map(valor=>(

<button

key={valor}

className="coin-add"

onClick={()=>sumar(valor)}

>

+{valor}

</button>

))

}

</div>

<h3>

Descontar MathCoins

</h3>

<div className="coins-grid">

{

botones.map(valor=>(

<button

key={valor}

className="coin-remove"

onClick={()=>sumar(-valor)}

>

-{valor}

</button>

))

}

</div>

</>

}

<button

className="btn-back"

onClick={()=>cambiarPantalla("teacher")}

>

<FaArrowLeft/>

&nbsp;

Regresar

</button>

</div>

</div>

</>

);

}