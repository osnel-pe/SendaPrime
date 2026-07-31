import { supabase } from "./supabase";
import { mostrarNotificacion } from "./notificaciones";

const notificadas=new Set();

export async function revisarCitas(){

    const ahora=new Date();

    const hoy=ahora.toISOString().slice(0,10);

    const {data,error}=await supabase

    .from("citas_programadas")

    .select(`
        *,
        alumnos(
            nombre,
            apellido_paterno
        )
    `)

    .eq("fecha",hoy);

    if(error || !data){

        return;

    }

    data.forEach(cita=>{

        const fechaCita=new Date(`${cita.fecha}T${cita.hora}`);

        const minutos=(fechaCita-ahora)/60000;

        const clave5=`5-${cita.id}`;
        const clave0=`0-${cita.id}`;

        if(minutos<=5 && minutos>4 && !notificadas.has(clave5)){

            notificadas.add(clave5);

            mostrarNotificacion(

                "Próxima cita",

                `${cita.alumnos.nombre} ${cita.alumnos.apellido_paterno} en 5 minutos.`

            );

        }

        if(minutos<=0 && minutos>-1 && !notificadas.has(clave0)){

            notificadas.add(clave0);

            mostrarNotificacion(

                "Es momento de la cita",

                `${cita.alumnos.nombre} ${cita.alumnos.apellido_paterno}`

            );

        }

    });

}