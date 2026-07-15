import "../Styles/AppLayout.css";
import "../Styles/Psicologia.css";
import "../Styles/PerfilAlumnoPsico.css";

import {
    ArrowLeft,
    House,
    UserRound,
    FileText,
    ScanLine
} from "lucide-react";

import { useRef, useState, useEffect } from "react";

import { supabase } from "../services/supabase";

import fondoPsicologia from "../assets/fondo-psicologia.jpg";

import EscanerDocumento from "../components/EscanerDocumento";

export default function PerfilAlumnoPsico({

    alumno,

    cambiarPantalla,

    students,

    setStudents,

    setAlumnoSeleccionado

}) {

    const inputArchivo = useRef(null);

    const [mostrarEscaner, setMostrarEscaner] = useState(false);

    const [mostrarMenu, setMostrarMenu] = useState(false);

    const [confirmandoEliminar, setConfirmandoEliminar] = useState(false);

    const [datosAlumno, setDatosAlumno] = useState(alumno);

    const [cargando, setCargando] = useState(false);

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

        setMostrarMenu(true);
    
    };

    //==============================
    // SUBIR PDF
    //==============================

    const subirExpediente = async (e) => {

        const archivo = e.target.files[0];

        if (!archivo) return;

        setCargando(true);

        try {

            const nombreArchivo =

                `${datosAlumno.id}-${Date.now()}.pdf`;

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

        if (!datosAlumno.expediente_pdf) return;
    
        const confirmar = window.confirm(
            "¿Deseas eliminar el expediente?"
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
    
        alert("Expediente eliminado correctamente.");

        setConfirmandoEliminar(false);
    
    };

    //==============================
    // VER PDF
    //==============================

    const verPDF = () => {

        const {

            data

        } = supabase.storage

            .from("expedientes")

            .getPublicUrl(datosAlumno.expediente_pdf);

        window.open(data.publicUrl, "_blank");
    };

    //=====================================
// GUARDAR PDF GENERADO POR EL ESCÁNER
//=====================================

const guardarPDFEscaneado = async (pdfBlob) => {

    setMostrarEscaner(false);

    setCargando(true);

    try {

        const nombreArchivo =
            `${datosAlumno.id}-${Date.now()}.pdf`;

        // Subir al Storage
        const { error: errorStorage } =
            await supabase.storage
                .from("expedientes")
                .upload(nombreArchivo, pdfBlob);

        if (errorStorage) {

            alert(errorStorage.message);

            setCargando(false);

            return;

        }

        // Actualizar tabla alumnos
        const { data, error } =
            await supabase
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

        // Actualizar estados

        setDatosAlumno(data);

        setAlumnoSeleccionado(data);

        setStudents(

            students.map(a =>

                a.id === data.id

                    ? data

                    : a

            )

        );

        alert("Expediente guardado correctamente.");

    }

    catch(err){

        console.error(err);

    }

    finally{

        setCargando(false);

    }

};
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
                                Perfil del alumno
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
                                <UserRound size={38}/>
                            </div>

                            <h2>

                                {datosAlumno.nombre} {datosAlumno.apellido_paterno} {datosAlumno.apellido_materno}

                            </h2>

                            <p>

                                {datosAlumno.grupo} • {datosAlumno.sexo==="M"
                                    ? "Masculino"
                                    : "Femenino"}

                            </p>

                        </div>

                        <div className="perfil-alumno-card">

                            <h3 className="section-title">
                                Expediente
                            </h3>

                            <div className="expediente-info-row">

                                <div className="expediente-icon">
                                    <FileText size={42}/>
                                </div>

                                <div className="expediente-info">

                                    <h4>
                                        Ficha General
                                    </h4>

                                    {

                                        datosAlumno.expediente_pdf ? (

                                            <>

                                                <p>

                                                    ✅ Expediente registrado

                                                </p>

                                                <div
                                                    style={{
                                                        display:"flex",
                                                        gap:"10px",
                                                        marginTop:"10px",
                                                        flexWrap:"wrap"
                                                    }}
                                                >

                                                    <button
                                                        className="btn-escanear"
                                                        onClick={verPDF}
                                                    >
                                                        Ver PDF
                                                    </button>

                                                    <button
                                        className="btn-back"
                                        style={{
                                            backgroundColor: confirmandoEliminar ? "#d32f2f" : "",
                                            color: confirmandoEliminar ? "white" : ""
                                        }}
                                        onClick={() => {

                                            if (!confirmandoEliminar) {

                                                setConfirmandoEliminar(true);

                                                return;

                                            }

                                            eliminarExpediente();

                                        }}
                                    >

                                        {

                                            confirmandoEliminar

                                                ? "Confirmar eliminación"

                                                : "Eliminar"

                                        }

                                    </button>

                                                </div>

                                            </>

                                        ) : (

                                            <p>

                                                No existe un expediente registrado.

                                            </p>

                                        )

                                    }

                                </div>

                            </div>

                            <button

                                className="btn-escanear"
                                onClick={abrirSelector}

                                disabled={cargando}

                            >

                                <ScanLine size={28}/>

                                <span>

                                    {

                                        cargando

                                            ? "Guardando..."

                                            : "Escanear ficha"

                                    }

                                </span>

                            </button>

                            <input

                                ref={inputArchivo}

                                type="file"

                                accept="application/pdf"

                                style={{display:"none"}}

                                onChange={subirExpediente}

                            />
                            
                           </div>

                        <div className="perfil-alumno-card">

                            <h3>

                                NEE

                            </h3>

                            <p>

                                Sin información registrada.

                            </p>

                        </div>

                        <div className="perfil-alumno-card">

                            <h3>

                                Citas psicológicas

                            </h3>

                            <p>

                                Sin citas registradas.

                            </p>

                        </div>

                    </div>

                </div>

            </div>
            {
                mostrarMenu && (

                <div className="modal-opciones">

                    <div className="modal-contenido">

                        <h3>Ficha General</h3>

                        <button

                            className="btn-escanear"

                            onClick={() => {

                                setMostrarMenu(false);

                                inputArchivo.current.click();

                            }}

                        >

                            Subir PDF

                        </button>

                        <button

                            className="btn-escanear"

                            onClick={() => {

                                setMostrarMenu(false);
                            
                                setMostrarEscaner(true);
                            
                            }}

                        >

                            Escanear documento

                        </button>

                        <button

                            className="btn-back"

                            onClick={() => setMostrarMenu(false)}

                        >

                            Cancelar

                        </button>

                    </div>

                </div>

                )
                }
                {

                    mostrarEscaner && (

                        <EscanerDocumento

                        onCancelar={() =>
                    
                            setMostrarEscaner(false)
                    
                        }
                    
                        onImagenCapturada={guardarPDFEscaneado}
                    
                    />

                    )

                    }
        </>

    );

}