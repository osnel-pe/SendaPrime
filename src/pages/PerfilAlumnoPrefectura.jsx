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

    FilePlus2,

    ClipboardCheck,

    FileWarning

} from "lucide-react";

import "../Styles/AppLayout.css";
import "../Styles/Psicologia.css";
import "../Styles/PerfilAlumnoPsico.css";
import "../Styles/Reportes.css";

import fondoPsicologia from "../assets/fondo-psicologia.jpg";

import ModalSeguimiento from "../components/Psicologia/ModalSeguimientoGrupo";
import ModalNEE from "../components/ModalNEE";
import ModalNota from "../components/Psicologia/ModalNota";
import ModalCita from "../components/Psicologia/ModalCita";
import VistaDetalleNota from "../components/Psicologia/VistaDetalleNota";
import VistaDetalleCita from "../components/Psicologia/VistaDetalleCita";
import VistaDetalleNEE from "../components/Psicologia/VistaDetalleNEE";
import TarjetaAsistenciaAlumno from "../components/Prefectura/TarjetaAsistenciaAlumno";
import ModalReporte from "../components/Prefectura/ModalReporte";
import VistaDetalleReporte from "../components/Prefectura/VistaDetalleReporte";

import { supabase } from "../services/supabase";

export default function PerfilAlumnoPrefectura({

    alumno,

    students,

    setStudents,

    setAlumnoSeleccionado,

    cambiarPantalla,

    embebido=false,

    citaActiva,

    setCitaActiva,

    moduloInicial

}){

const [datosAlumno,setDatosAlumno]=useState(alumno);

const [modulo,setModulo]=useState(moduloInicial || "archivos");

const inputArchivo=useRef(null);

const [archivos, setArchivos] = useState([]);
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

const [reportes,setReportes]=useState([]);

const [modalReporte,setModalReporte]=useState(false);

const [reporteEditar,setReporteEditar]=useState(null);

const [reporteVista,setReporteVista]=useState(null);

const [modalSeguimiento,setModalSeguimiento]=useState(false);

const [seguimientoEditar,setSeguimientoEditar]=useState(null);

const [notaVista,setNotaVista]=useState(null);

const [seguimientoVista,setSeguimientoVista]=useState(null);

const [neeVista,setNeeVista]=useState(null);

    useEffect(()=>{

        setDatosAlumno(alumno);

    },[alumno]);

    useEffect(()=>{

        if(!alumno) return;

        cargarArchivos();

        cargarNotas();

        cargarNEE();

        cargarSeguimientos();

        cargarHistorial();

        cargarReportes();

    },[alumno]);

    useEffect(()=>{

        setNees(datosAlumno?.nee || []);

    },[datosAlumno]);

    useEffect(()=>{

    if(!citaActiva) return;

    setSeguimientoEditar(citaActiva);

    setModalSeguimiento(true);

},[citaActiva]);

useEffect(()=>{

    setModulo(moduloInicial || "archivos");

},[alumno,moduloInicial]);

async function cargarReportes(){

    const {data,error}=await supabase

    .from("reportes_prefectura")

    .select("*")

    .eq("alumno_id",datosAlumno.id)

    .order("fecha",{

        ascending:false

    })

    .order("created_at",{

        ascending:false

    });

    if(error){

        console.log(error);

        return;

    }

    setReportes(data || []);

}

async function guardarReporte(){

    setModalReporte(false);

    setReporteEditar(null);

    await cargarReportes();

}

function editarReporte(reporte){

    setReporteEditar(reporte);

    setModalReporte(true);

}

async function eliminarReporte(id){

    if(

        !window.confirm(

            "¿Eliminar reporte?"

        )

    ) return;

    const {error}=await supabase

    .from("reportes_prefectura")

    .delete()

    .eq("id",id);

    if(error){

        alert(error.message);

        return;

    }

    cargarReportes();

}

    async function cargarArchivos(){

        const carpeta=

    `${datosAlumno.grupo}/${datosAlumno.id}`;

        const {data,error}=await supabase.storage

            .from("archivos-prefectura")

            .list(carpeta);

        if(error){

            console.log(error);

            return;

        }

        setArchivos(data || []);

    }

    async function cargarNotas(){

        const {data,error}=await supabase

        .from("notas_prefectura")

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

    // Si viene de una cita programada
    if(seguimientoEditar?.alumno_id && !seguimientoEditar?.intervencion){

        await supabase
        .from("citas_programadas")
        .update({
            fecha:datos.fecha,
            hora:datos.hora,
            tipo:datos.tipo
        })
        .eq("id",seguimientoEditar.id);

    }

    // Si viene del historial
    else{

        await supabase
        .from("historial_psicologia")
        .update({
            fecha:datos.fecha,
            hora:datos.hora,
            tipo:datos.tipo,
            motivo:datos.motivo,
            intervencion:datos.intervencion,
            acuerdos:datos.acuerdos
        })
        .eq("id",seguimientoEditar.id);

    }

    setSeguimientoEditar(null);
    setModalSeguimiento(false);

    if(setCitaActiva){
        setCitaActiva(null);
    }

    cargarSeguimientos();
    cargarHistorial();
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

async function abrirArchivo(nombre){

    const ruta =
`${datosAlumno.grupo}/${datosAlumno.id}/${nombre}`;

    const { data, error } = await supabase.storage
        .from("archivos-prefectura")
        .createSignedUrl(ruta,300);

    if(error){
        alert(error.message);
        return;
    }

    window.open(data.signedUrl,"_blank");
}

    async function subirArchivo(e){

    const archivo=e.target.files?.[0];

    if(!archivo) return;

    const ruta=

`${datosAlumno.grupo}/${datosAlumno.id}/${archivo.name}`;

    const {error}=await supabase.storage

        .from("archivos-prefectura")

        .upload(

            ruta,

            archivo,

            {

                upsert:true

            }

        );

    if(error){

        alert(error.message);

        return;

    }

    cargarArchivos();

}

    async function eliminarArchivo(nombre){

    if(

        !window.confirm(

            "¿Eliminar documento?"

        )

    ) return;

    const ruta=

`${datosAlumno.grupo}/${datosAlumno.id}/${nombre}`;

    const {error}=await supabase.storage

        .from("archivos-prefectura")

        .remove([ruta]);

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

        .from("notas_prefectura")

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

        .from("notas_prefectura")

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

        .from("notas_prefectura")

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

    .from("notas_prefectura")

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

function colorReporte(tipo){

    switch(tipo){

        case "Aviso":
            return "reporte-aviso";

        case "Aviso de conducta":
            return "reporte-aviso-conducta";

        case "Nota de conducta":
            return "reporte-nota-conducta";

        case "Reporte de conducta":
            return "reporte-reporte-conducta";

        case "Suspensión":
            return "reporte-suspension";

        default:
            return "";
    }

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

            onClick={()=>cambiarPantalla("grupoPrefectura")}

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

            modulo==="asistencia"

            ?

            "pa-tool activo"

            :

            "pa-tool"

        }

        onClick={()=>setModulo("asistencia")}

    >

        <ClipboardCheck size={22}/>

    </button>

    <button
        className={
            modulo==="reportes"
            ?
            "pa-tool activo"
            :
            "pa-tool"
        }
        onClick={()=>setModulo("reportes")}
    >
        <FileWarning size={22}/>
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

                        modulo==="asistencia"

                        ?

                        "Asistencia"

                        :

                        modulo==="reportes"

                        ?

                        "Reportes"

                        :

                        "Notas"

                    }

                </h3>

            </div>

            {
                modulo!=="asistencia" && (

                    <button

                        className="pa-add-btn"

                        onClick={()=>{

                            switch(modulo){

                                case "archivos":
                                    inputArchivo.current.click();
                                    break;

                                case "reportes":

                                    setReporteEditar(null);

                                    setModalReporte(true);

                                break;

                                case "notas":
                                    setNotaEditar(null);
                                    setModalNota(true);
                                    break;

                            }

                        }}

                    >

                        <FilePlus2 size={18}/>

                    </button>

                )
            }

        </div>
                {/*=========================================
        CONTENIDO DEL MÓDULO
        =========================================*/}

        <div className="pa-module-body">

            {

                modulo==="archivos"

                &&                
        
                <>
                    {
                        archivos.length===0
                        ?
                        <div className="pa-empty">
                            No existen documentos.
                        </div>
                        :
                        archivos.map((archivo)=>(

                            <div
                                key={archivo.name}
                                className="pa-card"
                            >

                                <div className="pa-card-left">

                                    <div className="pa-card-icon">
                                        <FileText size={20}/>
                                    </div>

                                    <div className="pa-card-text">
                                        <h4>{archivo.name}</h4>
                                    </div>

                                </div>

                                <div className="pa-card-actions">

                                    <button
                                        className="pa-circle-btn"
                                        onClick={()=>abrirArchivo(archivo.name)}
                                    >
                                        <Eye size={16}/>
                                    </button>

                                    <button
                                        className="pa-circle-btn pa-delete"
                                        onClick={()=>eliminarArchivo(archivo.name)}
                                    >
                                        <Trash2 size={16}/>
                                    </button>

                                </div>

                            </div>

                        ))
                    }

                    <input
                        ref={inputArchivo}
                        hidden
                        type="file"
                        onChange={subirArchivo}
                    />
                </>

                

            }

            {
                modulo==="asistencia"

                &&

                <TarjetaAsistenciaAlumno
                    key={datosAlumno.id}
                    alumnoId={datosAlumno.id}
                />

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
                modulo==="reportes"

                &&

                <>

                {

                reportes.length===0

                ?

                <div className="pa-empty">

                No existen reportes registrados.

                </div>

                :

                reportes.map(reporte=>(

                <div
                className={`pa-card reporte-card ${colorReporte(reporte.tipo)}`}
                onClick={(e)=>{

                if(e.target.closest(".pa-card-actions")) return;

                setReporteVista(reporte);

                }}
                >

                <div

                className="pa-card-left"

                >

                <div className="pa-card-icon reporte-icon">
                    <FileWarning size={20}/>
                </div>

                <div className="pa-card-text">

                    <h4>{reporte.tipo}</h4>

                    <span>
                        {reporte.motivo}
                    </span>

                    <small>
                        {reporte.fecha}
                    </small>

                </div>

                </div>

                <div className="pa-card-actions">

                <button

                className="pa-circle-btn"

                onClick={()=>editarReporte(reporte)}

                >

                <Pencil size={16}/>

                </button>

                <button

                className="pa-circle-btn pa-delete"

                onClick={()=>eliminarReporte(reporte.id)}

                >

                <Trash2 size={16}/>

                </button>

                </div>

                </div>

                ))

                }

                <ModalReporte

                    abierto={modalReporte}

                    cerrar={()=>{

                        setReporteEditar(null);

                        setModalReporte(false);

                    }}

                    guardar={guardarReporte}

                    reporteActual={reporteEditar}

                    alumno={datosAlumno}

                />

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

            <VistaDetalleReporte
                abierta={reporteVista!==null}
                reporte={reporteVista}
                cerrar={()=>setReporteVista(null)}
                editar={(rep)=>{

                    setReporteVista(null);

                    setReporteEditar(rep);

                    setModalReporte(true);

                }}
            />

        </>

    );

}