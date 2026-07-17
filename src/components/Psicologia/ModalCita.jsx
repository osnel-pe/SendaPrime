import "../../Styles/ModalCita.css";

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

        }else{

            setVista({

                fecha:new Date().toISOString().split("T")[0],

                tipo:"Seguimiento",

                motivo:"",

                intervencion:"",

                acuerdos:""

            });

        }

    },[citaActual,abierto]);

    if(!abierto) return null;

    return(

<div className="modal-opciones">

    <div className="modal-contenido modal-cita">

        <h2>

            Seguimiento

        </h2>

        <input

            type="date"

            value={vista.fecha}

            onChange={(e)=>setVista({

                ...vista,

                fecha:e.target.value

            })}

        />

        <select

            value={vista.tipo}

            onChange={(e)=>setVista({

                ...vista,

                tipo:e.target.value

            })}

        >

            <option>Entrevista inicial</option>

            <option>Seguimiento</option>

            <option>Intervención individual</option>

            <option>Intervención grupal</option>

            <option>Orientación familiar</option>

            <option>Orientación docente</option>

            <option>Cierre</option>

            <option>Otro</option>

        </select>

        <label className="campo-label">

            Motivo:

        </label>

        <textarea

            rows={1}

            value={vista.motivo}

            onChange={(e)=>setVista({

                ...vista,

                motivo:e.target.value

            })}

        />

        <label className="campo-label">

            Intervención realizada:

        </label>

        <textarea

            rows={5}

            value={vista.intervencion}

            onChange={(e)=>setVista({

                ...vista,

                intervencion:e.target.value

            })}

        />

        <label className="campo-label">

            Acuerdos:

        </label>

        <textarea

            rows={5}

            value={vista.acuerdos}

            onChange={(e)=>setVista({

                ...vista,

                acuerdos:e.target.value

            })}

        />

        <div className="modal-botones">

            <button

                className="btn-cancelar"

                onClick={cerrar}

            >

                Cancelar

            </button>

            <button

                className="btn-guardar"

                onClick={()=>guardar(vista)}

            >

                Guardar

            </button>

        </div>

    </div>

</div>

);
}