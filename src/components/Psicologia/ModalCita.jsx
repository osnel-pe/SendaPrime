import {useState,useEffect} from "react";

export default function ModalCita({

    abierto,

    cerrar,

    guardar,

    citaActual

}){

    const[vista,setVista]=useState({

        fecha:"",

        tipo:"Seguimiento",

        motivo:"",

        intervencion:"",

        acuerdos:""

    });

    useEffect(()=>{

        if(citaActual){

            setVista(citaActual);

        }

    },[citaActual]);

    if(!abierto) return null;

    return(

        <div className="modal-opciones">

            <div className="modal-contenido">

                <h2>

                    Cita Psicopedagógica

                </h2>

            </div>

        </div>

    );

}