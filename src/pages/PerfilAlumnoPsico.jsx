import { useState,useEffect,useRef } from "react";

import {

    ArrowLeft,

    UserRound,

    FolderOpen,

    Upload,

    FileText,

    Eye,

    Trash2,

    Brain,

    ClipboardList,

    Pencil,

    Plus,

    FilePlus2

} from "lucide-react";

import "../Styles/AppLayout.css";
import "../Styles/Psicologia.css";
import "../Styles/PerfilAlumnoPsico.css";

import fondoPsicologia from "../assets/fondo-psicologia.jpg";

import ModalSeguimiento from "../components/Psicologia/ModalSeguimientoGrupo";
import ModalNEE from "../components/ModalNEE";
import ModalNota from "../components/Psicologia/ModalNota";
import ModalCita from "../components/Psicologia/ModalCita";
import VistaDetalleNota from "../components/Psicologia/VistaDetalleNota";
import VistaDetalleCita from "../components/Psicologia/VistaDetalleCita";
import VistaDetalleNEE from "../components/Psicologia/VistaDetalleNEE";

import { supabase } from "../services/supabase";

export default function PerfilAlumnoPsico({

    alumno,

    students,

    setStudents,

    setAlumnoSeleccionado,

    cambiarPantalla,

    embebido=false,

    citaActiva,

    setCitaActiva

}){

const [datosAlumno,setDatosAlumno]=useState(alumno);

const [modulo,setModulo]=useState("archivos");

const inputArchivo=useRef(null);

const documentoExtra=useRef(null);

/*=========================================
ARCHIVOS
=========================================*/

const [archivos,setArchivos]=useState([]);

const [archivosExtra,setArchivosExtra]=useState([]);

/*=========================================
NEE
=========================================*/

const [nees,setNees]=useState([]);

const [modalNEE,setModalNEE]=useState(false);

const [neeEditar,setNeeEditar]=useState(null);

/*=========================================
NOTAS
=========================================*/

const [notas,setNotas]=useState([]);

const [modalNota,setModalNota]=useState(false);

const [notaEditar,setNotaEditar]=useState(null);

/*=========================================
SEGUIMIENTO
=========================================*/

const [seguimientos,setSeguimientos]=useState([]);

const [historial,setHistorial]=useState([]);

const [modalSeguimiento,setModalSeguimiento]=useState(false);

const [seguimientoEditar,setSeguimientoEditar]=useState(null);

const [notaVista,setNotaVista]=useState(null);

const [seguimientoVista,setSeguimientoVista]=useState(null);

const [neeVista,setNeeVista]=useState(null);

    useEffect(()=>{

        setDatosAlumno(alumno);

    },[alumno]);

        useEffect(()=>{

        if(!datosAlumno) return;

        cargarArchivos();
        cargarArchivosExtra();
        cargarNotas();
        cargarNEE();
        cargarSeguimientos();
        cargarHistorial();

    },[datosAlumno]);

    useEffect(()=>{

        setNees(datosAlumno?.nee || []);

    },[datosAlumno]);

    useEffect(()=>{

    if(!citaActiva) return;

    setSeguimientoEditar(citaActiva);

    setModalSeguimiento(true);

},[citaActiva]);

    async function cargarArchivos(){

        const {data,error}=await supabase

        .from("archivos_alumno")

        .select("*")

        .eq("alumno_id",alumno.id)

        .order("created_at",{

            ascending:false

        });

        if(error){

            console.log(error);

            return;

        }

        setArchivos(data || []);

    }

    async function cargarNotas(){

        const {data,error}=await supabase

        .from("notas_psicologia")

        .select("*")

        .eq("alumno_id",alumno.id)

        .order("fijada",{

            ascending:false

        })

        .order("created_at",{

            ascending:false

        });

        if(error){

            console.log(error);

            return;

        }

        setNotas(data || []);

    }

    function cargarNEE(){

        setNees(

            datosAlumno?.nee || []

        );

    }

    async function guardarSeguimiento(datos){

    // ==========================================
    // 1. VIENE DE UNA CITA PROGRAMADA
    // ==========================================

    if(citaActiva?.id){

        const registro = {

            alumno_id: datosAlumno.id,

            cita_programada_id: citaActiva.id,

            fecha: datos.fecha,

            hora: datos.hora,

            tipo: datos.tipo,

            motivo: datos.motivo,

            intervencion: datos.intervencion,

            acuerdos: datos.acuerdos

        };

        const { error: errorHistorial } = await supabase
            .from("historial_psicologia")
            .insert(registro);

        if(errorHistorial){

            console.log(
                "ERROR GUARDANDO HISTORIAL:",
                errorHistorial
            );

            alert(errorHistorial.message);

            return;
        }


        // Eliminar la cita programada
        // porque ya fue atendida

        const { error: errorCita } = await supabase
            .from("citas_programadas")
            .delete()
            .eq("id", citaActiva.id);

        if(errorCita){

            console.log(
                "ERROR ELIMINANDO CITA:",
                errorCita
            );

            alert(errorCita.message);

            return;
        }


        setCitaActiva(null);

    }

    // ==========================================
    // 2. EDITAR SEGUIMIENTO EXISTENTE
    // ==========================================

    else if(seguimientoEditar){

        const { error } = await supabase
            .from("historial_psicologia")
            .update({

                fecha: datos.fecha,

                hora: datos.hora,

                tipo: datos.tipo,

                motivo: datos.motivo,

                intervencion: datos.intervencion,

                acuerdos: datos.acuerdos

            })
            .eq("id", seguimientoEditar.id);


        if(error){

            console.log(
                "ERROR ACTUALIZANDO SEGUIMIENTO:",
                error
            );

            alert(error.message);

            return;
        }

    }

    // ==========================================
    // 3. NUEVO SEGUIMIENTO DESDE EL PERFIL
    // ==========================================

    else{

        const { error } = await supabase
            .from("historial_psicologia")
            .insert({

                alumno_id: datosAlumno.id,

                fecha: datos.fecha,

                hora: datos.hora,

                tipo: datos.tipo,

                motivo: datos.motivo,

                intervencion: datos.intervencion,

                acuerdos: datos.acuerdos

            });


        if(error){

            console.log(
                "ERROR CREANDO SEGUIMIENTO:",
                error
            );

            alert(error.message);

            return;
        }

    }


    // ==========================================
    // LIMPIAR
    // ==========================================

    setSeguimientoEditar(null);

    setModalSeguimiento(false);

    if(setCitaActiva){
        setCitaActiva(null);
    }


    // Recargar información

    await cargarHistorial();

    await cargarSeguimientos();

}

async function cargarHistorial(){

    const {data,error}=await supabase

    .from("historial_psicologia")

    .select("*")

    .eq("alumno_id",datosAlumno.id)

    .order("fecha",{

        ascending:false

    })

    .order("hora",{

        ascending:false

    });

    if(error){

        console.log(error);

        return;

    }

    setHistorial(data || []);

}

async function cargarSeguimientos(){

    const {data,error}=await supabase

    .from("citas_programadas")

    .select("*")

    .eq("alumno_id",datosAlumno.id)

    .order("fecha",{

        ascending:true

    })

    .order("hora",{

        ascending:true

    });

    if(error){

        console.log(error);

        return;

    }

    setSeguimientos(data || []);

}

function editarSeguimiento(registro){

    setSeguimientoEditar(registro);

    setModalSeguimiento(true);

}

async function eliminarSeguimiento(id){

    if(
        !window.confirm("¿Eliminar esta cita?")
    ) return;

    const {error}=await supabase

    .from("citas_programadas")

    .delete()

    .eq("id",id);

    if(error){

        alert(error.message);

        return;

    }

    cargarSeguimientos();

}

    async function subirExpediente(e){

    const archivo=e.target.files?.[0];

    if(!archivo) return;

    const ruta=

        `${datosAlumno.grupo}/${datosAlumno.id}/FichaGeneral.pdf`;

    const {error:storageError}=

        await supabase.storage

        .from("expedientes")

        .upload(

            ruta,

            archivo,

            {

                upsert:true

            }

        );

    if(storageError){

        alert(storageError.message);

        return;

    }

    const {error}=await supabase

        .from("alumnos")

        .update({

            expediente_pdf:ruta

        })

        .eq("id",datosAlumno.id);

    if(error){

        alert(error.message);

        return;

    }

    setDatosAlumno({

        ...datosAlumno,

        expediente_pdf:ruta

    });

}

    async function verExpediente(){

    if(

        !datosAlumno?.expediente_pdf

    ) return;

    const {data,error}=

        await supabase.storage

        .from("expedientes")

        .createSignedUrl(

            datosAlumno.expediente_pdf,

            300

        );

    if(error){

        alert(error.message);

        return;

    }

    window.open(

        data.signedUrl,

        "_blank"

    );

}

async function eliminarExpediente(){

    if(

        !window.confirm(

            "¿Eliminar expediente?"

        )

    ) return;

    if(

        datosAlumno.expediente_pdf

    ){

        await supabase.storage

            .from("expedientes")

            .remove([

                datosAlumno.expediente_pdf

            ]);

    }

    await supabase

        .from("alumnos")

        .update({

            expediente_pdf:null

        })

        .eq("id",datosAlumno.id);

    setDatosAlumno({

        ...datosAlumno,

        expediente_pdf:null

    });

}

async function subirDocumentoExtra(e){

    const archivo=e.target.files?.[0];

    if(!archivo) return;

    const ruta=

    `${datosAlumno.grupo}/${datosAlumno.id}/archivos/${Date.now()}-${archivo.name}`;

    const {error}=await supabase.storage

    .from("expedientes")

    .upload(

        ruta,

        archivo

    );

    if(error){

        alert(error.message);

        return;

    }

    cargarArchivosExtra();

}

async function verDocumentoExtra(nombre){

    const ruta=

    `${datosAlumno.grupo}/${datosAlumno.id}/archivos/${nombre}`;

    const{

        data,
        error

    }=await supabase.storage

    .from("expedientes")

    .createSignedUrl(

        ruta,

        300

    );

    if(error){

        alert(error.message);

        return;

    }

    window.open(

        data.signedUrl,

        "_blank"

    );

}

async function eliminarDocumentoExtra(nombre){

    if(

        !window.confirm(

            "¿Eliminar documento?"

        )

    ) return;

    const ruta=

    `${datosAlumno.grupo}/${datosAlumno.id}/archivos/${nombre}`;

    const {error}=await supabase.storage

    .from("expedientes")

    .remove([

        ruta

    ]);

    if(error){

        alert(error.message);

        return;

    }

    cargarArchivosExtra();

}

    async function subirArchivo(e){

        const archivo=e.target.files?.[0];

        if(!archivo) return;

        const nombre=

            `${Date.now()}-${archivo.name}`;

        const {error:storageError}=

            await supabase.storage

            .from("archivos-psicologia")

            .upload(nombre,archivo);

        if(storageError){

            alert(storageError.message);

            return;

        }

        const {

            data:{publicUrl}

        }=supabase.storage

        .from("archivos-psicologia")

        .getPublicUrl(nombre);

        const {error}=await supabase

        .from("archivos_alumno")

        .insert({

            alumno_id:datosAlumno.id,

            nombre:archivo.name,

            url:publicUrl,

            tipo:archivo.type

        });

        if(error){

            alert(error.message);

            return;

        }

        cargarArchivos();

    }

    function abrirArchivo(url){

        window.open(url,"_blank");

    }

    async function eliminarArchivo(id){

        if(

            !window.confirm(

                "¿Eliminar este archivo?"

            )

        ) return;

        const {error}=await supabase

        .from("archivos_alumno")

        .delete()

        .eq("id",id);

        if(error){

            alert(error.message);

            return;

        }

        cargarArchivos();

    }

    async function eliminarNota(id){

        if(

            !window.confirm(

                "¿Eliminar esta nota?"

            )

        ) return;

        await supabase

        .from("notas_psicologia")

        .delete()

        .eq("id",id);

        cargarNotas();

    }

        /*==================================================
    NOTAS
    ==================================================*/

    async function guardarNota(datos){

    if(notaEditar){

        const {error}=await supabase

        .from("notas_psicologia")

        .update({

            titulo:datos.titulo,

            nota:datos.nota,

            color:datos.color,

            fijada:datos.fijada

        })

        .eq("id",notaEditar.id);

        if(error){

            alert(error.message);

            return;

        }

    }else{

        const {error}=await supabase

        .from("notas_psicologia")

        .insert({

            alumno_id:datosAlumno.id,

            grupo:datosAlumno.grupo,

            titulo:datos.titulo,

            nota:datos.nota,

            color:datos.color,

            fijada:false

        });

        if(error){

            alert(error.message);

            return;

        }

    }

    await cargarNotas();

    setModalNota(false);

    setNotaEditar(null);

}

    async function eliminarNota(id){

    if(

        !window.confirm(

            "¿Eliminar esta nota?"

        )

    ) return;

    const {error}=await supabase

    .from("notas_psicologia")

    .delete()

    .eq("id",id);

    if(error){

        alert(error.message);

        return;

    }

    cargarNotas();

}

     function nuevaNota(){

        setNotaEditar(null);

        setModalNota(true);

    }

    function editarNota(nota){

        setNotaEditar(nota);

        setModalNota(true);

    }

    /*==================================================
    NEE
    ==================================================*/

    function editarNEE(indice){

        setNeeEditar(

            datosAlumno.nee[indice]

        );

        setModalNEE(true);

    }

    function nuevaNEE(){

        setNeeEditar(null);

        setModalNEE(true);

    }

    async function eliminarNEE(indice){

    if(

        !window.confirm(

            "¿Eliminar esta NEE?"

        )

    ) return;

    const nuevasNEE=[

        ...(datosAlumno.nee || [])

    ];

    nuevasNEE.splice(

        indice,

        1

    );

    const {error}=await supabase

            .from("alumnos")

            .update({

                nee:nuevasNEE

            })

            .eq("id",datosAlumno.id);

        if(error){

            alert(error.message);

            return;

        }

        setDatosAlumno({

            ...datosAlumno,

            nee:nuevasNEE

        });

        const alumnoActualizado={

            ...datosAlumno,

            nee:nuevasNEE

        };

        setDatosAlumno(alumnoActualizado);

        setAlumnoSeleccionado(alumnoActualizado);

        const nuevos=[...students];

        const pos=nuevos.findIndex(

            a=>a.id===datosAlumno.id

        );

        if(pos!==-1){

            nuevos[pos]=alumnoActualizado;

            setStudents(nuevos);

        }

        const indiceAlumno = nuevos.findIndex(

            a => a.id === datosAlumno.id

        );

        if(indiceAlumno !== -1){

            nuevos[indiceAlumno] = {

                ...nuevos[indiceAlumno],

                nee: nuevasNEE

            };

            setStudents(nuevos);

        }

    }

    async function guardarNEE(datos){

    let lista=[

        ...(datosAlumno.nee || [])

    ];

    if(neeEditar){

        const indice=lista.findIndex(

            n=>

            n.diagnostico===neeEditar.diagnostico &&

            n.observaciones===neeEditar.observaciones

        );

        if(indice!=-1){

            lista[indice]=datos;

        }

    }else{

        lista.unshift(datos);

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

    const alumnoActualizado = {

        ...datosAlumno,

        nee:lista

    };

    setAlumnoSeleccionado(alumnoActualizado);

    const nuevos=[...students];

    const pos=nuevos.findIndex(

        a=>a.id===datosAlumno.id

    );

    if(pos!==-1){

        nuevos[pos]=alumnoActualizado;

        setStudents(nuevos);

    }

    setDatosAlumno(alumnoActualizado);

    setNees(lista);

    setNeeEditar(null);

    setModalNEE(false);

}

    /*==================================================
    EXPEDIENTE
    ==================================================*/

    function visualizarArchivo(url){

        abrirArchivo(url);

    }

    async function cargarArchivosExtra(){

        const carpeta = `${datosAlumno.grupo}/${datosAlumno.id}`;

        const { data, error } = await supabase.storage
            .from("expedientes")
            .list(carpeta);

        if(error){

            console.log(error);

            return;

        }

        const lista=(data || []).filter(

            archivo=>archivo.name!=="FichaGeneral.pdf"

        );

        setArchivosExtra(lista);

    }

    async function subirDocumentoExtra(e){

        const archivo=e.target.files[0];

        if(!archivo)return;

        const ruta=

            `${datosAlumno.grupo}/${datosAlumno.id}/${archivo.name}`;

        const {error}=await supabase.storage

            .from("expedientes")

            .upload(

                ruta,

                archivo,

                {

                    upsert:true

                }

            );

        if(error){

            console.log(error);

            return;

        }

        await cargarArchivosExtra();

    }

    async function verDocumentoExtra(nombre){

        const ruta=

            `${datosAlumno.grupo}/${datosAlumno.id}/${nombre}`;

        const {data}=supabase.storage

            .from("expedientes")

            .getPublicUrl(ruta);

        window.open(

            data.publicUrl,

            "_blank"

        );

    }

    async function eliminarDocumentoExtra(nombre){

        const ruta=

            `${datosAlumno.grupo}/${datosAlumno.id}/${nombre}`;

        const {error}=await supabase.storage

            .from("expedientes")

            .remove([ruta]);

        if(error){

            console.log(error);

            return;

        }

        await cargarArchivosExtra();

    }

    async function finalizarCita(datos){

    const registro={

        alumno_id:datosAlumno.id,

        cita_programada_id:citaActiva.id,

        fecha:citaActiva.fecha,

        hora:citaActiva.hora,

        tipo:citaActiva.tipo,

        motivo:citaActiva.motivo,

        intervencion:datos.intervencion,

        acuerdos:datos.acuerdos,

        observaciones:datos.observaciones

    };

    const {error}=await supabase

        .from("historial_psicologia")

        .insert(registro);

    if(error){

        alert(error.message);

        return;

    }

    await supabase

        .from("citas_programadas")

        .delete()

        .eq("id",citaActiva.id);

    setCitaActiva(null);

    cambiarPantalla("grupoPsicologia");

}   

    /*==================================================
    JSX
    ==================================================*/

    const contenido=(

<div className="perfil-wrapper">

    {/*=========================================
    HEADER
    =========================================*/}

    <div className="perfil-header">

        <button

            className="back-btn"

            onClick={()=>cambiarPantalla("grupoPsicologia")}

        >

            <ArrowLeft size={20}/>

        </button>

        <div className="perfil-header-title">

            <h2>

                Perfil

            </h2>

        </div>

    </div>

    {/*=========================================
    SCROLL
    =========================================*/}

    <div className="perfil-scroll">

        {/*=========================================
        TARJETA DEL ALUMNO
        =========================================*/}

        <div className="pa-card-alumno">

            <div className="pa-avatar">

                <UserRound size={34}/>

            </div>

            <div className="pa-card-info">

                <h2>

                    {datosAlumno?.nombre}{" "}

                    {datosAlumno?.apellido_paterno}{" "}

                    {datosAlumno?.apellido_materno}

                </h2>

                <div className="pa-card-extra">

                    <span>

                        {datosAlumno?.grupo}

                    </span>

                    <div className="pa-separador"/>

                    <span>

                        {

                            datosAlumno?.sexo==="M"

                            ?

                            "Masculino"

                            :

                            "Femenino"

                        }

                    </span>

                </div>

            </div>

        </div>

        {/*=========================================
        MENÚ DE MÓDULOS
        =========================================*/}

        <div className="pa-toolbar">

            <button

                className={

                    modulo==="archivos"

                    ?

                    "pa-tool activo"

                    :

                    "pa-tool"

                }

                onClick={()=>setModulo("archivos")}

            >

                <FolderOpen size={22}/>

            </button>

            <button

                className={

                    modulo==="nee"

                    ?

                    "pa-tool activo"

                    :

                    "pa-tool"

                }

                onClick={()=>setModulo("nee")}

            >

                <Brain size={22}/>

            </button>

            <button

                className={

                    modulo==="notas"

                    ?

                    "pa-tool activo"

                    :

                    "pa-tool"

                }

                onClick={()=>setModulo("notas")}

            >

                <FileText size={22}/>

            </button>

            <button

                className={

                    modulo==="seguimiento"

                    ?

                    "pa-tool activo"

                    :

                    "pa-tool"

                }

                onClick={()=>setModulo("seguimiento")}

            >

                <ClipboardList size={22}/>

            </button>

        </div>

        {/*=========================================
        CABECERA DEL MÓDULO
        =========================================*/}

        <div className="pa-module">

            <div>

                <h3>

                    {

                        modulo==="archivos"

                        ?

                        "Archivos"

                        :

                        modulo==="nee"

                        ?

                        "NEE"

                        :

                        modulo==="notas"

                        ?

                        "Notas"

                        :

                        "Seguimiento"

                    }

                </h3>

            </div>

            <button

                className="pa-add-btn"

                onClick={()=>{

                    switch(modulo){

                        case "archivos":

                            documentoExtra.current.click();

                            break;

                        case "nee":

                            setNeeEditar(null);

                            setModalNEE(true);

                            break;

                        case "notas":

                            setNotaEditar(null);

                            setModalNota(true);

                            break;

                        case "seguimiento":

                            setSeguimientoEditar(null);

                            setModalSeguimiento(true);

                            break;

                        default:

                            break;

                    }

                }}

            >

                <FilePlus2 size={18}/>

            </button>

        </div>
                {/*=========================================
        CONTENIDO DEL MÓDULO
        =========================================*/}

        <div className="pa-module-body">

            {

                modulo==="archivos"

                &&

                <>
                        {/*=========================================
                FICHA GENERAL
                =========================================*/}

                <div className="pa-card">

                    <div className="pa-card-left">

                        <div className="pa-card-icon">

                            <FolderOpen size={20}/>

                        </div>

                        <div className="pa-card-text">

                            <h4>

                                Ficha General

                            </h4>

                        </div>

                    </div>

                    <div className="pa-card-actions">

                        {

                            datosAlumno?.expediente_pdf

                            ?

                            <>

                                <button

                                    className="pa-circle-btn"

                                    onClick={verExpediente}

                                >

                                    <Eye size={16}/>

                                </button>

                                <button

                                    className="pa-circle-btn pa-delete"

                                    onClick={eliminarExpediente}

                                >

                                    <Trash2 size={16}/>

                                </button>

                            </>

                            :

                            <button

                                className="pa-circle-btn"

                                onClick={()=>inputArchivo.current.click()}

                            >

                                <Plus size={16}/>

                            </button>

                        }

                    </div>

                </div>

                <input

                    hidden

                    ref={inputArchivo}

                    type="file"

                    onChange={subirExpediente}

                />

                {/*=========================================
                DOCUMENTOS ADICIONALES
                =========================================*/}

                {

                    archivosExtra.length===0

                    ?

                    <div className="pa-empty">

                        No existen documentos adicionales.

                    </div>

                    :
                    
                    
                        archivosExtra.map((archivo)=>(

                            <div
                                key={archivo.name}
                                className="pa-card"
                            >

                                <div className="pa-card-left">

                                    <div className="pa-card-icon">

                                        <FileText size={22}/>

                                    </div>

                                    <div className="pa-card-text">

                                        <h4>

                                            {archivo.name}

                                        </h4>

                                    </div>

                                </div>

                                <div className="pa-card-actions">

                                    <button

                                        className="pa-circle-btn"

                                        onClick={()=>

                                            verDocumentoExtra(

                                                archivo.name

                                            )

                                        }

                                    >

                                        <Eye size={17}/>

                                    </button>

                                    <button

                                        className="pa-circle-btn pa-delete"

                                        onClick={()=>

                                            eliminarDocumentoExtra(

                                                archivo.name

                                            )

                                        }

                                    >

                                        <Trash2 size={17}/>

                                    </button>

                                </div>

                            </div>

                        ))
                    }

                <input

                    ref={documentoExtra}

                    hidden

                    type="file"

                    onChange={subirDocumentoExtra}

                />

                </>

            }

                        {

                modulo==="nee"

                &&

                <>

                    {

                        nees.length===0

                        ?

                        <div className="pa-empty">

                            No existen necesidades educativas especiales registradas.

                        </div>

                        :

                        nees.map((nee,index)=>(

                            <div
                                key={index}
                                className="pa-card"
                                onClick={(e)=>{

                                    if(e.target.closest(".pa-card-actions")){

                                        return;

                                    }

                                    setNeeVista(nee);

                                }}
                            >

                                <div className="pa-card-left">

                                    <div className="pa-card-icon">

                                        <Brain size={20}/>

                                    </div>

                                    <div className="pa-card-text">

                                        <h4>

                                            {nee.diagnostico}

                                        </h4>

                                        <span>

                                            {nee.nivel}

                                        </span>

                                        {

                                            nee.observaciones

                                            &&

                                            <p>

                                                {nee.observaciones}

                                            </p>

                                        }

                                    </div>

                                </div>

                                <div className="pa-card-actions">

                                    <button

                                        className="pa-circle-btn"

                                        onClick={()=>editarNEE(index)}

                                    >

                                        <Pencil size={16}/>

                                    </button>

                                    <button

                                        className="pa-circle-btn pa-delete"

                                        onClick={()=>eliminarNEE(index)}

                                    >

                                        <Trash2 size={16}/>

                                    </button>

                                </div>

                            </div>

                        ))

                    }

                </>

            }

                        {

                modulo==="notas"

                &&

                <>

                    {

                        notas.length===0

                        ?

                        <div className="pa-empty">

                            No existen notas registradas.

                        </div>

                        :

                        notas.map((nota,index)=>(

                            <div
                                key={nota.id}
                                className={`pa-card pa-note ${nota.color || "verde"}`}
                                onClick={(e)=>{

                                    if(e.target.closest(".pa-card-actions")){

                                        return;

                                    }

                                    setNotaVista(nota);

                                }}
                            >

                                <div className="pa-card-left">

                                    <div className="pa-card-icon">

                                        <FileText size={20}/>

                                    </div>

                                    <div className="pa-card-text">

                                        <h4>

                                            {nota.titulo}

                                        </h4>

                                        <p>

                                            {nota.nota}

                                        </p>

                                        {

                                            nota.created_at &&

                                            <small>

                                                {

                                                    new Date(

                                                        nota.created_at

                                                    ).toLocaleDateString()

                                                }

                                            </small>

                                        }

                                    </div>

                                </div>

                                <div className="pa-card-actions">

                                    <button

                                        className="pa-circle-btn"

                                        onClick={()=>editarNota(nota)}

                                    >

                                        <Pencil size={16}/>

                                    </button>

                                    <button

                                        className="pa-circle-btn pa-delete"

                                        onClick={()=>eliminarNota(nota.id)}

                                    >

                                        <Trash2 size={16}/>

                                    </button>

                                </div>

                            </div>

                        ))

                    }

                </>

            }                        

            {
                modulo==="seguimiento"

                &&

                <>

                    {

                        historial.length===0

                        ?

                        <div className="pa-empty">

                            No existen seguimientos registrados.

                        </div>

                        :

                        historial.map((seguimiento)=>(

                            <div

                                key={seguimiento.id}

                                className="pa-card"

                            >

                                <div
                                    className="pa-card-left"
                                    onClick={()=>setSeguimientoVista(seguimiento)}
                                >

                                    <div className="pa-card-icon">

                                        <ClipboardList size={20}/>

                                    </div>

                                    <div className="pa-card-text">

                                        <h4>

                                            {seguimiento.tipo}

                                        </h4>

                                        <span>

                                            {seguimiento.fecha}

                                            {

                                                seguimiento.hora

                                                ?

                                                ` • ${seguimiento.hora}`

                                                :

                                                ""

                                            }

                                        </span>

                                    </div>

                                </div>

                                <div className="pa-card-actions">

                                    <button
                                        className="pa-circle-btn"
                                        onClick={()=>editarSeguimiento(seguimiento)}
                                    >
                                        <Pencil size={16}/>
                                    </button>

                                    <button

                                        className="pa-circle-btn pa-delete"

                                        onClick={()=>eliminarSeguimiento(seguimiento.id)}

                                    >

                                        <Trash2 size={16}/>

                                    </button>

                                </div>

                            </div>

                        ))

                    }

                </>

            }

        </div>

    </div>

</div>

);

    return(

        <>

            {

                !embebido && (

                    <div

                        className="app-background"

                        style={{

                            backgroundImage:

                            `url(${fondoPsicologia})`

                        }}

                    />

                )

            }

            {

                embebido

                ?

                contenido

                :

                <div className="ps-app">

                    <div className="ps-container">

                        {contenido}

                    </div>

                </div>

            }

            <ModalCita

                abierto={modalSeguimiento}

                cerrar={()=>{

                    setSeguimientoEditar(null);

                    setModalSeguimiento(false);

                }}

                guardar={guardarSeguimiento}

                citaActual={seguimientoEditar}

            />

            <ModalNEE

                abierto={modalNEE}

                cerrar={()=>{

                    setNeeEditar(null);

                    setModalNEE(false);

                }}

                guardar={guardarNEE}

                nee={neeEditar}

            />

            <ModalNota

                abierto={modalNota}

                cerrar={()=>setModalNota(false)}

                guardar={guardarNota}

                notaActual={notaEditar}

                students={students}

                ocultarAlumno={true}

                soloIndividual={true}

                soloPerfil={true}

            />

            <VistaDetalleNota

                abierta={notaVista!==null}

                nota={notaVista}

                students={students}

                cerrar={()=>setNotaVista(null)}

                editar={(nota)=>{

                    setNotaVista(null);

                    editarNota(nota);

                }}

            />

            <VistaDetalleNEE

                abierta={neeVista!==null}

                nee={neeVista}

                cerrar={()=>setNeeVista(null)}

                editar={(nee)=>{

                    setNeeVista(null);

                    setNeeEditar(nee);

                    setModalNEE(true);

                }}

            />

            <VistaDetalleCita

                abierta={seguimientoVista!==null}

                cita={seguimientoVista}

                students={students}

                cerrar={()=>setSeguimientoVista(null)}

                editar={(cita)=>{

                    setSeguimientoVista(null);

                    setSeguimientoEditar(cita);

                    setModalSeguimiento(true);

                }}

            />

        </>

    );

}