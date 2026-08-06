import { useEffect, useState } from "react";

import {

    ShieldAlert,
    FileWarning,
    ClipboardList,
    AlertTriangle,
    Ban

} from "lucide-react";

import { supabase } from "../../services/supabase";

import "../../Styles/ModalReporte.css";

export default function ModalReporte({

    abierto,
    cerrar,
    guardar,
    reporteActual=null,
    alumno,
    students=[]

}){

    const [tipo,setTipo]=useState("Aviso");

    const [motivo,setMotivo]=useState("Uniforme");

    const [descripcion,setDescripcion]=useState("");

    const [dias,setDias]=useState(1);

    const [alumnoSeleccionado,setAlumnoSeleccionado]=useState(
        alumno || null
    );

    const [busqueda,setBusqueda]=useState("");

    const [moduloPerfil,setModuloPerfil]=useState("archivos");

    useEffect(()=>{

        if(!abierto) return;

        setAlumnoSeleccionado(alumno || null);

        setBusqueda(
            alumno
                ? `${alumno.nombre} ${alumno.apellido_paterno}`
                : ""
        );

        if(reporteActual){

            setTipo(reporteActual.tipo);

            setMotivo(reporteActual.motivo || "Uniforme");

            setDescripcion(reporteActual.descripcion || "");

            setDias(reporteActual.dias_suspension || 1);

        }

        else{

            setTipo("Aviso");

            setMotivo("Uniforme");

            setDescripcion("");

            setDias(1);

        }

    },[abierto,reporteActual]);

    if(!abierto) return null;

    async function enviar(){

        if(!alumnoSeleccionado){

            alert("Seleccione un alumno.");

            return;

        }

        const hoy = new Date();

        const fecha =
        `${hoy.getFullYear()}-${
        String(hoy.getMonth() + 1).padStart(2,"0")
        }-${
        String(hoy.getDate()).padStart(2,"0")
        }`;

        const datos={

            alumno_id:alumnoSeleccionado.id,

            grupo:alumnoSeleccionado.grupo,

            fecha,

            tipo,

            motivo,

            descripcion,

            dias_suspension:
                tipo==="Suspensión"
                ? dias
                : 0

        };

        if(reporteActual){

            await supabase

            .from("reportes_prefectura")

            .update(datos)

            .eq("id",reporteActual.id);

        }

        else{

            await supabase

            .from("reportes_prefectura")

            .insert(datos);

        }

        guardar();

    }

    function icono(){

        switch(tipo){

            case "Aviso":

                return <ShieldAlert size={22}/>;

            case "Aviso de conducta":

                return <AlertTriangle size={22}/>;

            case "Nota de conducta":

                return <ClipboardList size={22}/>;

            case "Reporte de conducta":

                return <FileWarning size={22}/>;

            default:

                return <Ban size={22}/>;

        }

    }

    const alumnosFiltrados = students.filter(al => {

        const texto = (
            `${al.nombre} ${al.apellido_paterno} ${al.apellido_materno} ${al.grupo}`
        ).toLowerCase();

        return texto.includes(busqueda.toLowerCase());

    }).slice(0,8);

    return(

        <div className="mr-overlay">

            <div className="mr-modal">

                <div className="mr-header">

                    <div className="mr-titulo">

                        {icono()}

                        <h2>

                            {

                                reporteActual

                                ?

                                "Editar reporte"

                                :

                                "Nuevo reporte"

                            }

                        </h2>

                    </div>

                </div>

                <div className="mr-alumno">

                    {alumnoSeleccionado?.nombre}{" "}
                    {alumnoSeleccionado?.apellido_paterno}

                </div>

                {

                !alumno &&

                <>

                <label>

                Alumno

                </label>

                <div className="mr-buscador">

                    <input

                        type="text"

                        placeholder="Buscar alumno..."

                        value={busqueda}

                        onChange={(e)=>{

                            setBusqueda(e.target.value);

                            setAlumnoSeleccionado(null);

                        }}

                    />

                    {

                        busqueda!=="" && !alumnoSeleccionado && (

                            <div className="mr-resultados">

                                {

                                    alumnosFiltrados.length===0

                                    ?

                                    <div className="mr-sin">

                                        Sin resultados

                                    </div>

                                    :

                                    alumnosFiltrados.map(al=>(

                                        <div

                                            key={al.id}

                                            className="mr-item"

                                            onClick={()=>{

                                                setAlumnoSeleccionado(al);

                                                setBusqueda(

                                                    `${al.nombre} ${al.apellido_paterno} ${al.apellido_materno}`

                                                );

                                            }}

                                        >

                                            <strong>

                                                {al.nombre} {al.apellido_paterno} {al.apellido_materno}

                                            </strong>

                                            <small>

                                                {al.grupo}

                                            </small>

                                        </div>

                                    ))

                                }

                            </div>

                        )

                    }

                </div>

                </>

                }

                <label>

                    Tipo

                </label>

                <select

                    value={tipo}

                    onChange={

                        e=>setTipo(e.target.value)

                    }

                >

                    <option>

                        Aviso

                    </option>

                    <option>

                        Aviso de conducta

                    </option>

                    <option>

                        Nota de conducta

                    </option>

                    <option>

                        Reporte de conducta

                    </option>

                    <option>

                        Suspensión

                    </option>

                </select>

                <label>

                    Motivo

                </label>

                <select

                    value={motivo}

                    onChange={

                        e=>setMotivo(e.target.value)

                    }

                >

                    <option>

                        Uniforme

                    </option>

                    <option>

                        Cabello

                    </option>

                    <option>

                        Uñas

                    </option>

                    <option>

                        Celular

                    </option>

                    <option>

                        Lenguaje

                    </option>

                    <option>

                        Respeto

                    </option>

                    <option>

                        Agresión

                    </option>

                    <option>

                        Daños

                    </option>

                    <option>

                        Incumplimiento

                    </option>

                    <option>

                        Otro

                    </option>

                </select>

                {

                    tipo==="Suspensión"

                    &&

                    <>

                        <label>

                            Días

                        </label>

                        <input

                            type="number"

                            min="1"

                            value={dias}

                            onChange={

                                e=>setDias(

                                    Number(e.target.value)

                                )

                            }

                        />

                    </>

                }

                <label>

                    Descripción

                </label>

                <textarea

                    rows={5}

                    value={descripcion}

                    onChange={

                        e=>setDescripcion(

                            e.target.value

                        )

                    }

                />

                <div className="mr-footer">

                    <button

                        className="mr-cancelar"

                        onClick={cerrar}

                    >

                        Cancelar

                    </button>

                    <button

                        className="mr-guardar"

                        onClick={enviar}

                    >

                        Guardar

                    </button>

                </div>

            </div>

        </div>

    );

}