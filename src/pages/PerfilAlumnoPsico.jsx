import "../Styles/AppLayout.css";
import "../Styles/Psicologia.css";
import "../Styles/PerfilAlumnoPsico.css";

import {

    ArrowLeft,
    House,
    UserRound,
    FolderOpen,
    FileText,
    Upload,
    Trash2,
    Eye

} from "lucide-react";

import { useRef, useState, useEffect } from "react";

import ExpedienteCard from "../components/Psicologia/ExpedienteCard";

import { supabase } from "../services/supabase";

import fondoPsicologia from "../assets/fondo-psicologia.jpg";

import NEECard from "../components/Psicologia/NEECard";

import ModalNEE from "../components/ModalNEE";

import CitasCard from "../components/Psicologia/CitasCard";

import ModalCita from "../components/Psicologia/ModalCita";

export default function PerfilAlumnoPsico({

    alumno,

    cambiarPantalla,

    students,

    setStudents,

    setAlumnoSeleccionado

}) {

    const inputArchivo = useRef(null);

    const [confirmandoEliminar, setConfirmandoEliminar] = useState(false);

    const [datosAlumno, setDatosAlumno] = useState(alumno);

    const [cargando, setCargando] = useState(false);

    const [modalNEE,setModalNEE]=useState(false);

    const [indiceNEE, setIndiceNEE] = useState(null);
    
    const [mostrarEliminarNEE, setMostrarEliminarNEE] = useState(false);

    const [indiceEliminarNEE, setIndiceEliminarNEE] = useState(null);
   
    const [modalCita,setModalCita]=useState(false);

    const [indiceCita,setIndiceCita]=useState(null);

    const [mostrarEliminarCita,setMostrarEliminarCita]=useState(false);

    const [indiceEliminarCita,setIndiceEliminarCita]=useState(null);

    //==============================
    // CARGAR ALUMNO DESDE SUPABASE
    //==============================

    const cargarAlumno = async () => {

        if (!alumno) return;

        const { data, error } = await supabase

            .from("alumnos")

            .select("*")

            .eq("id", alumno.id)

            .single();

        if (error) {

            console.error(error);

            return;

        }

        setDatosAlumno(data);

        setAlumnoSeleccionado(data);

        if (students && setStudents) {

            setStudents(

                students.map((a) =>

                    a.id === data.id

                        ? data

                        : a

                )

            );

        }

    };

    useEffect(() => {

        cargarAlumno();

    }, []);

    if (!datosAlumno) return null;

    //==============================
    // ABRIR SELECTOR
    //==============================

    const abrirSelector = () => {

    inputArchivo.current.click();

};

    //==============================
    // SUBIR PDF
    //==============================

    const subirExpediente = async (e) => {

        const archivo = e.target.files[0];

        if (!archivo) return;

        setCargando(true);

        try {

            //==============================
            // ELIMINAR EXPEDIENTE ANTERIOR
            //==============================

            if (datosAlumno.expediente_pdf) {

                const { error } = await supabase.storage

                    .from("expedientes")

                    .remove([datosAlumno.expediente_pdf]);

                if (error) {

                    console.error(error);

                }

            }

            const nombreArchivo =

            `${datosAlumno.grupo}/${datosAlumno.id}/FichaGeneral.pdf`;

            //---------------------------------------
            // SUBIR AL STORAGE
            //---------------------------------------

            const {

                error: errorStorage

            } = await supabase.storage

                .from("expedientes")

                .upload(nombreArchivo, archivo);

            if (errorStorage) {

                alert(errorStorage.message);

                setCargando(false);

                return;

            }

            //---------------------------------------
            // ACTUALIZAR TABLA ALUMNOS
            //---------------------------------------

            const {

                data,

                error

            } = await supabase

                .from("alumnos")

                .update({

                    expediente_pdf: nombreArchivo

                })

                .eq("id", datosAlumno.id)

                .select()

                .single();

            if (error) {

                alert(error.message);

                setCargando(false);

                return;

            }

            //---------------------------------------
            // ACTUALIZAR ESTADOS
            //---------------------------------------

            setDatosAlumno(data);

            setAlumnoSeleccionado(data);

            if (students && setStudents) {

                setStudents(

                    students.map((a) =>

                        a.id === data.id

                            ? data

                            : a

                    )

                );

            }

            alert("Expediente guardado correctamente.");

        }

        catch (err) {

            console.error(err);

            alert("Ocurrió un error.");

        }

        finally {

            setCargando(false);

        }

    };

    //==============================
    // ELIMINAR PDF
    //==============================

    const eliminarExpediente = async () => {

        console.log("Eliminar presionado");
        if (!datosAlumno.expediente_pdf) return;
    
        const confirmar = window.confirm(

        `¿Deseas eliminar la ficha general de

        ${datosAlumno.nombre}

        ${datosAlumno.apellido_paterno}?

        Esta acción no se puede deshacer.`

        );

        if (!confirmar) return;
    
        // 1. Eliminar del Storage
        const { error: errorStorage } = await supabase.storage
            .from("expedientes")
            .remove([datosAlumno.expediente_pdf]);
    
        console.log("Eliminar Storage:", errorStorage);
    
        if (errorStorage) {
            alert(errorStorage.message);
            return;
        }
    
        // 2. Eliminar referencia en la tabla alumnos
        const { data, error: errorBD } = await supabase
            .from("alumnos")
            .update({
                expediente_pdf: null
            })
            .eq("id", datosAlumno.id)
            .select();
    
        console.log("UPDATE:", data);
        console.log("ERROR UPDATE:", errorBD);
    
        if (errorBD) {
            alert(errorBD.message);
            return;
        }
    
        // 3. Actualizar la interfaz
        const actualizado = {
            ...datosAlumno,
            expediente_pdf: null
        };
    
        setDatosAlumno(actualizado);
        setAlumnoSeleccionado(actualizado);
    
        setStudents(
            students.map(a =>
                a.id === actualizado.id
                    ? actualizado
                    : a
            )
        );
    
        alert("Documento eliminado.");

        setConfirmandoEliminar(false);
    
    };

    //==============================
    // VER PDF
    //==============================

    const verPDF = () => {

    if (!datosAlumno.expediente_pdf) return;

    const { data } = supabase.storage
        .from("expedientes")
        .getPublicUrl(datosAlumno.expediente_pdf);

    const enlace = document.createElement("a");
    enlace.href = data.publicUrl;
    enlace.target = "_blank";
    enlace.rel = "noopener noreferrer";
    enlace.click();
};

const guardarNEE = async (datos)=>{

    const lista = [...(datosAlumno.nee || [])];

    if(indiceNEE===null){

        lista.push(datos);

    }else{

        lista[indiceNEE]=datos;

    }

    const {error}=await supabase

        .from("alumnos")

        .update({

            nee:lista

        })

        .eq("id",datosAlumno.id);

    if(error){

        alert(error.message);

        return;

    }

    setDatosAlumno({

        ...datosAlumno,

        nee:lista

    });

    setIndiceNEE(null);

    setModalNEE(false);

};

const guardarCita = async(datos)=>{

    const lista=[...(datosAlumno.citas || [])];

    if(indiceCita===null){

        lista.unshift(datos);

    }else{

        lista[indiceCita]=datos;

    }

    const {error}=await supabase

        .from("alumnos")

        .update({

            citas:lista

        })

        .eq("id",datosAlumno.id);

    if(error){

        alert(error.message);

        return;

    }

    setDatosAlumno({

        ...datosAlumno,

        citas:lista

    });

    setIndiceCita(null);

    setModalCita(false);

};

const eliminarNEE = async(index)=>{

    console.log("Índice:", index);

    console.log("NEE:", datosAlumno.nee);

    const lista=[...(datosAlumno.nee || [])];

    lista.splice(index,1);
    console.log("Lista después:", lista);

    const {error}=await supabase

        .from("alumnos")

        .update({

            nee:lista

        })
        .eq("id", datosAlumno.id);

        console.log(error);

    if(error){

        alert(error.message);

        return;

    }

    setDatosAlumno({

        ...datosAlumno,

        nee:lista

    });

};

const eliminarCita = async(index)=>{

    const lista=[...(datosAlumno.citas || [])];

    lista.splice(index,1);

    const {error}=await supabase

        .from("alumnos")

        .update({

            citas:lista

        })

        .eq("id",datosAlumno.id);

    if(error){

        alert(error.message);

        return;

    }

    setDatosAlumno({

        ...datosAlumno,

        citas:lista

    });

};
    //=====================================
// GUARDAR PDF GENERADO POR EL ESCÁNER
//=====================================

    return (

        <>

            <div
                className="app-background"
                style={{
                    backgroundImage: `url(${fondoPsicologia})`
                }}
            />

            <div className="ps-app">

                <div className="ps-container">

                    <div className="sticky-header">

                        <div className="page-top">

                            <button
                                className="back-btn"
                                onClick={() => cambiarPantalla("grupoPsicologia")}
                            >
                                <ArrowLeft size={22} />
                            </button>

                            <h1>
                                Perfil
                            </h1>

                            <button
                                className="home-btn"
                                onClick={() => cambiarPantalla("psicologia")}
                            >
                                <House size={20} />
                            </button>

                        </div>

                    </div>

                    <div className="perfil-scroll">

                        <div className="perfil-resumen">

                            <div className="perfil-avatar">
                                <UserRound size={24}/>
                            </div>

                            <div className="perfil-datos">

                                <h2>

                                    <span className="nombre">

                                        {datosAlumno.nombre}

                                    </span>

                                    <span className="apellidos">

                                        {datosAlumno.apellido_paterno}

                                        {" "}

                                        {datosAlumno.apellido_materno}

                                    </span>

                                </h2>

                                <p>

                                    {datosAlumno.grupo} • {datosAlumno.sexo === "M"
                                        ? "Masculino"
                                        : "Femenino"}

                                </p>

                            </div>

                        </div>
                        

                        <ExpedienteCard

                            tieneExpediente={!!datosAlumno.expediente_pdf}

                            onOpen={verPDF}

                            onUpload={abrirSelector}

                            onDelete={eliminarExpediente}

                        />

                            <NEECard
                                nee={datosAlumno.nee}
                                onAgregar={() => setModalNEE(true)}
                                onEditar={(index)=>{

                                    setIndiceNEE(index);

                                    setModalNEE(true);

                                }}
                                onEliminar={(index)=>{

                                    setIndiceEliminarNEE(index);

                                    setMostrarEliminarNEE(true);

                                }}
                            />

                            <CitasCard

                                citas={datosAlumno.citas}

                                onAgregar={()=>{

                                    setIndiceCita(null);

                                    setModalCita(true);

                                }}

                                onEditar={(index)=>{

                                    setIndiceCita(index);

                                    setModalCita(true);

                                }}

                                onEliminar={(index)=>{

                                    setIndiceEliminarCita(index);

                                    setMostrarEliminarCita(true);

                                }}

                            />

                    </div>

                </div>

            </div>
            {
        
        }
            <input
                type="file"
                accept="application/pdf"
                ref={inputArchivo}
                style={{ display: "none" }}
                onChange={subirExpediente}
            />

            <ModalNEE

                abierto={modalNEE}

                cerrar={()=>{

                    setIndiceNEE(null);

                    setModalNEE(false);

                }}

                neeActual={

                    indiceNEE !== null

                        ? datosAlumno.nee[indiceNEE]

                        : null

                }

                guardar={guardarNEE}

            />

            <ModalCita

                abierto={modalCita}

                cerrar={()=>{

                    setIndiceCita(null);

                    setModalCita(false);

                }}

                guardar={guardarCita}

                citaActual={

                    indiceCita!==null

                    ? datosAlumno.citas[indiceCita]

                    : null

                }

            />

            {

                mostrarEliminarNEE && (

                <div className="modal-opciones">
               
               <div className="modal-contenido eliminar-modal">

                    <div className="eliminar-icono">

                        <Trash2 size={34}/>

                    </div>

                    <h2>

                        Eliminar NEE

                    </h2>

                    <p>

                        Esta acción eliminará permanentemente esta necesidad educativa.

                    </p>

                    <div className="eliminar-botones">

                        <button

                            className="btn-cancelar"

                            onClick={()=>setMostrarEliminarNEE(false)}

                        >

                            Cancelar

                        </button>

                        <button

                            className="btn-eliminar"

                            onClick={()=>{

                                eliminarNEE(indiceEliminarNEE);

                                setMostrarEliminarNEE(false);

                            }}

                        >

                            Eliminar

                        </button>

                    </div>

                </div>

                </div>

                )

                }
                {
                    mostrarEliminarCita && (

                        <div className="modal-opciones">

                            <div className="modal-contenido eliminar-modal">

                                <div className="eliminar-icono">

                                    <Trash2 size={34}/>

                                </div>

                                <h2>

                                    Eliminar seguimiento

                                </h2>

                                <p>

                                    Esta acción eliminará permanentemente este seguimiento.

                                </p>

                                <div className="eliminar-botones">

                                    <button

                                        className="btn-cancelar"

                                        onClick={()=>setMostrarEliminarCita(false)}

                                    >

                                        Cancelar

                                    </button>

                                    <button

                                        className="btn-eliminar"

                                        onClick={()=>{

                                            eliminarCita(indiceEliminarCita);

                                            setMostrarEliminarCita(false);

                                        }}

                                    >

                                        Eliminar

                                    </button>

                                </div>

                            </div>

                        </div>

                    )
                }
        </>

    );

}
