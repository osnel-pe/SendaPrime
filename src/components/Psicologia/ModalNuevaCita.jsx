import { useEffect, useState } from "react";

import "../../Styles/ModalCita.css";

import { createPortal } from "react-dom";

export default function ModalNuevaCita({

abierto,

cerrar,

guardar,

students,

citaActual

}){


const inicial={

alumno_id:"",
fecha:new Date().toISOString().slice(0,10),
hora:"",
tipo:"",
motivo:"",
observaciones:""

};

    const [buscarAlumno,setBuscarAlumno]=useState("");

    const [mostrarLista,setMostrarLista]=useState(false);

    const [datos,setDatos]=useState(inicial);

        useEffect(()=>{

        if(!abierto) return;

        if(citaActual){

        setDatos({

        ...citaActual

        });

        }else{

        setDatos({

            ...inicial

        });

            setBuscarAlumno("");

        }

        },[abierto,citaActual]);

    if(!abierto) return null;

    const normalizar = (texto="")=>

    texto

    .normalize("NFD")

    .replace(/[\u0300-\u036f]/g,"")

    .toLowerCase()

    .trim();

    const alumnosFiltrados = students.filter(alumno=>{

        const nombre = normalizar(

            `${alumno.nombre} ${alumno.apellido_paterno} ${alumno.apellido_materno}`

        );

        const grupo = normalizar(alumno.grupo);

        const busqueda = normalizar(buscarAlumno);

        return (

            nombre.includes(busqueda)

            ||

            grupo.includes(busqueda)

        );

    });

return createPortal(

<div className="modal-opciones">

    <div className="modal-contenido modal-cita">

<h2>

Nueva cita

</h2>

<label>

Alumno

</label>

<div className="buscador-alumno">

    <input

        type="text"

        placeholder="Buscar alumno..."

        value={buscarAlumno}

        onFocus={()=>setMostrarLista(true)}

        onChange={(e)=>{

            setBuscarAlumno(e.target.value);

            setMostrarLista(true);

        }}

    />

    {

        mostrarLista && (

            <div className="lista-alumnos-modal">

                {

                    alumnosFiltrados.map(alumno=>(

                        <div

                            key={alumno.id}

                            className="item-alumno-modal"

                            onClick={()=>{

                                setDatos({

                                    ...datos,

                                    alumno_id:alumno.id

                                });

                                setBuscarAlumno(

                                        `${alumno.nombre} ${alumno.apellido_paterno} ${alumno.apellido_materno}`

                                    );

                                setMostrarLista(false);

                            }}

                        >

                                <strong>

                                    {alumno.nombre} {alumno.apellido_paterno} {alumno.apellido_materno}

                                </strong>

                            <br/>

                            <small>

                                {alumno.grupo}

                            </small>

                        </div>

                    ))

                }

            </div>

        )

    }

</div>
<label>

Fecha

</label>

<input

type="date"

value={datos.fecha}

onChange={(e)=>setDatos({

...datos,

fecha:e.target.value

})}

/>

<label>

Hora

</label>

<input

type="time"

value={datos.hora}

onChange={(e)=>setDatos({

...datos,

hora:e.target.value

})}

/>

<label>

Tipo

</label>

<input

value={datos.tipo}

onChange={(e)=>setDatos({

...datos,

tipo:e.target.value

})}

/>

<label>

Motivo

</label>

<textarea

rows={2}

value={datos.motivo}

onChange={(e)=>setDatos({

...datos,

motivo:e.target.value

})}

/>

<label>

Observaciones

</label>

<textarea

rows={3}

value={datos.observaciones}

onChange={(e)=>setDatos({

...datos,

observaciones:e.target.value

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
type="button"
className="btn-guardar"
onClick={guardar}
>
Guardar
</button>

</div>

</div>

</div>,

document.body

);

}