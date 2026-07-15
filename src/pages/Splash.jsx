import { motion } from "framer-motion";
import "../Styles/Splash.css";

import logo from "../assets/logo.png";

export default function Splash(){

return(

<div className="splash-screen">

<div className="app-background">

<div className="bg-wave1"></div>

<div className="bg-wave2"></div>

<div className="bg-light"></div>

</div>

<motion.div

className="splash-content"

initial={{opacity:0,scale:.85}}

animate={{opacity:1,scale:1}}

transition={{duration:.6}}

>

<motion.div

className="splash-logo"

animate={{

rotate:[0,-5,5,-5,5,0],

scale:[1,1.04,1]

}}

transition={{

repeat:Infinity,

duration:2

}}

>

<img

src={logo}

alt="Logo"

className="logo-image"

/>

</motion.div>

<h3>

Senda María Madre (Navojoa)

</h3>

<p>

Sistema de Gestión Escolar

</p>

<div className="loading">

<div className="loading-bar"></div>

</div>

<span>

Cargando...

</span>

</motion.div>

</div>

);

}