import CitasHoy from "./CitasHoy";

import FrasePsico from "./FrasePsico";


type Props={

    cambiarPantalla:(pantalla:string)=>void;

    students:any[];

    setAlumnoSeleccionado:(alumno:any)=>void;

    setCitaActiva:(cita:any)=>void;

};


export default function Inicio({

    cambiarPantalla,

    students,

    setAlumnoSeleccionado,

    setCitaActiva

}:Props){

    return(

        <>

            <FrasePsico />

            <CitasHoy

                students={students}

                cambiarPantalla={cambiarPantalla}

                setAlumnoSeleccionado={setAlumnoSeleccionado}

                setCitaActiva={setCitaActiva}

            />

        </>

    );

}