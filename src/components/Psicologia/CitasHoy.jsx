import { motion } from "framer-motion";
import { CalendarDays, Clock, Plus } from "lucide-react";
import { useEffect,useState } from "react";
import { supabase } from "../../services/supabase";
import { Circle, CircleCheckBig } from "lucide-react";

import "../../Styles/CitasHoy.css";

import ModalNuevaCita from "./ModalNuevaCita";

export default function CitasHoy({

cambiarPantalla,

students,

seleccionarAlumno

}){

    const [citas,setCitas]=useState([]);

    const [modalNuevaCita,setModalNuevaCita]=useState(false);

    const eliminarCitasVencidas = async()=>{

        const hoy=new Date().toISOString().slice(0,10);

        await supabase

        .from("citas_programadas")

        .delete()

        .lt("fecha", hoy);

    };

    const cargarCitasHoy=async()=>{

    const hoy=new Date().toISOString().slice(0,10);

    const {data,error}=await supabase

    .from("citas_programadas")

    .select(`

    *,

    alumnos(

    nombre,

    apellido_paterno,

    apellido_materno,

    grupo

    )

    `)

    .eq("fecha",hoy)

    .order("hora",{ascending:true});

    if(error){

    console.log(error);

    return;

    }

    setCitas(data);

    };

    useEffect(()=>{

    cargarCitasHoy();

    },[]);

    useEffect(()=>{

        const iniciar=async()=>{

            await eliminarCitasVencidas();

            await cargarCitasHoy();

        };

        iniciar();

    },[]);

    const guardarNuevaCita=async(datos)=>{

        const {error}=await supabase

        .from("citas_programadas")

        .insert({

            ...datos,

            cumplida:false

        })

        if(error){

        alert(error.message);

        return;

        }

        setModalNuevaCita(false);

        cargarCitasHoy();

    };

    const abrirAlumno=(id)=>{

    const alumno=students.find(

    a=>a.id===id

    );

    if(!alumno) return;

    seleccionarAlumno(alumno);

    cambiarPantalla("perfilAlumnoPsico");

    };

    const cambiarEstado = async(cita)=>{

        const { error } = await supabase

        .from("citas_programadas")

        .update({

            cumplida: !cita.cumplida

        })

        .eq("id", cita.id);

        if(error){

            alert(error.message);

            return;

        }

        cargarCitasHoy();

    };

return(

<motion.section

className="citas-card"

initial={{opacity:0,y:20}}

animate={{opacity:1,y:0}}

transition={{duration:.4}}

>

    <ModalNuevaCita

    abierto={modalNuevaCita}

    cerrar={()=>setModalNuevaCita(false)}

    guardar={guardarNuevaCita}

    students={students}

    />

<div className="citas-header">

<div className="titulo">

<CalendarDays size={20}/>

<h3>Citas de hoy</h3>

</div>

<button

className="agenda-add-mini"

onClick={()=>setModalNuevaCita(true)}

>

<Plus size={17}/>

 Nueva

</button>

</div>

<div className="lista-citas">

{

citas.length===0?

(

<div className="sin-citas">

No hay citas programadas para hoy.

</div>

)

:

citas.map((cita,index)=>(

<div

key={index}

className={`cita ${cita.cumplida ? "realizada" : ""}`}

onClick={()=>abrirAlumno(cita.alumno_id)}

>
   <button

        className="check-cita"

        onClick={(e)=>{

        e.stopPropagation();

        cambiarEstado(cita);

        }}

        >

        {

        cita.cumplida

        ?

        <CircleCheckBig size={24}/>

        :

        <Circle size={24}/>

        }

    </button>

<div className="hora">

<Clock size={16}/>

<span>

{cita.hora.slice(0,5)}

</span>

</div>

<div className="info">

<h4>

{cita.alumnos?.nombre}

{" "}

{cita.alumnos?.apellido_paterno}

{" "}

{cita.alumnos?.apellido_materno}

</h4>

<p>

{cita.alumnos?.grupo}

•

{cita.tipo}

</p>

</div>

</div>

))

}

</div>

</motion.section>

);

}