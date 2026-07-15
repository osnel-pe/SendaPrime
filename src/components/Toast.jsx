import { AnimatePresence, motion } from "framer-motion";

import {
FaCheckCircle,
FaTimesCircle
} from "react-icons/fa";

export default function Toast({

mensaje,

tipo

}){

return(

<AnimatePresence>

{

mensaje && (

<div className={`toast ${tipo}`}>

<motion.div

className="toast-content"

initial={{

opacity:0,

scale:.6,

y:80

}}

animate={{

opacity:1,

scale:1,

y:0

}}

exit={{

opacity:0,

scale:.8,

y:-60

}}

transition={{

duration:.35

}}

>

<div className="toast-icon">

{

tipo==="success"

?

<FaCheckCircle/>

:

<FaTimesCircle/>

}

</div>

<div className="toast-text">

{mensaje}

</div>

</motion.div>

</div>

)

}

</AnimatePresence>

);

}