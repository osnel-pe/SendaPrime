import "../Styles/AppLayout.css";
import "../Styles/Psicologia.css";
import "../Styles/Notas.css";

import { useEffect, useState } from "react";

import {
    Search,
    Plus,
    Pencil,
    Trash2,
    Pin,
    User,
    Users
} from "lucide-react";

import fondoPsicologia from "../assets/fondo-psicologia.jpg";

import { supabase } from "../services/supabase";

import ModalNota from "../components/Psicologia/ModalNota";

import VistaDetalleNota from "../components/Psicologia/VistaDetalleNota";


export default function Notas({

    students = [],

    cambiarPantalla,

    embebido = false

}){


    /* ==========================================
       ESTADOS
    ========================================== */

    const [buscar,setBuscar] = useState("");

    const [modal,setModal] = useState(false);

    const [notas,setNotas] = useState([]);

    const [notaEditar,setNotaEditar] = useState(null);

    const [notaEliminar,setNotaEliminar] = useState(null);

    const [notaVista,setNotaVista] = useState(null);
    console.log("NOTA VISTA:", notaVista);

    /* ==========================================
       CARGAR NOTAS
    ========================================== */

    const cargarNotas = async () => {

        const { data, error } = await supabase

            .from("notas_psicologia")

            .select("*")

            .order("fijada",{ ascending:false })

            .order("created_at",{ ascending:false });


        if(error){

            console.error(

                "Error cargando notas:",

                error

            );

            return;

        }


        setNotas(data || []);

    };


    /* ==========================================
       CARGAR AL INICIAR
    ========================================== */

    useEffect(()=>{

        cargarNotas();

    },[]);


    /* ==========================================
       GUARDAR / EDITAR NOTA
    ========================================== */

    const guardarNota = async (datos) => {


        if(notaEditar){

            const { error } = await supabase

                .from("notas_psicologia")

                .update({

                    titulo: datos.titulo,

                    nota: datos.nota,

                    alumno_id: datos.alumno_id || null,

                    grupo: datos.grupo || null,

                    color: datos.color

                })

                .eq("id",notaEditar.id);


            if(error){

                console.error(

                    "Error actualizando nota:",

                    error

                );

                alert(error.message);

                return;

            }

        }


        else{

            const { error } = await supabase

                .from("notas_psicologia")

                .insert({

                    alumno_id: datos.alumno_id || null,

                    grupo: datos.grupo || null,

                    titulo: datos.titulo,

                    nota: datos.nota,

                    color: datos.color,

                    fijada: false

                });


            if(error){

                console.error(

                    "Error creando nota:",

                    error

                );

                alert(error.message);

                return;

            }

        }


        setModal(false);

        setNotaEditar(null);

        await cargarNotas();

    };


    /* ==========================================
       ELIMINAR NOTA
    ========================================== */

    const eliminarNota = async () => {


        if(!notaEliminar){

            return;

        }


        const { error } = await supabase

            .from("notas_psicologia")

            .delete()

            .eq("id",notaEliminar.id);


        if(error){

            console.error(

                "Error eliminando nota:",

                error

            );

            alert(error.message);

            return;

        }


        setNotaEliminar(null);

        await cargarNotas();

    };


    /* ==========================================
       FIJAR / DESFIJAR NOTA
    ========================================== */

    const fijarNota = async (nota) => {


        const { error } = await supabase

            .from("notas_psicologia")

            .update({

                fijada: !nota.fijada

            })

            .eq("id",nota.id);


        if(error){

            console.error(

                "Error fijando nota:",

                error

            );

            alert(error.message);

            return;

        }


        await cargarNotas();

    };


    /* ==========================================
       NORMALIZAR TEXTO
    ========================================== */

    const normalizar = (texto = "") => {

        return texto

            .normalize("NFD")

            .replace(/[\u0300-\u036f]/g,"")

            .toLowerCase();

    };


    /* ==========================================
       FILTRAR NOTAS
    ========================================== */

    const lista = notas.filter((nota) => {


        const alumno = students.find(

            (student) =>

                student.id === nota.alumno_id

        );


        const texto = normalizar(`

            ${nota.titulo || ""}

            ${nota.nota || ""}

            ${nota.grupo || ""}

            ${alumno?.nombre || ""}

            ${alumno?.apellido_paterno || ""}

            ${alumno?.apellido_materno || ""}

            ${alumno?.grupo || ""}

        `);


        return texto.includes(

            normalizar(buscar)

        );

    });


    /* ==========================================
       CONTENIDO PRINCIPAL
    ========================================== */

    const contenido = (

        <div className="notas-pantalla-completa">

            {/* ================================
               BUSCADOR
            ================================= */}

            <div className="nota-search-box">


                <Search size={18}/>


                <input

                    className="nota-search-input"

                    placeholder="Buscar nota, alumno o grupo..."

                    value={buscar}

                    onChange={(e)=>{

                        setBuscar(e.target.value);

                    }}

                />


            </div>


            {/* ================================
               BOTÓN NUEVA NOTA
            ================================= */}

            <div className="nota-toolbar">


                <button

                    className="nota-add"

                    onClick={()=>{

                        setNotaEditar(null);

                        setModal(true);

                    }}

                >

                    <Plus size={18}/>

                    Nueva nota


                </button>


            </div>


            {/* ================================
               LISTA
            ================================= */}

            <div className="notas-scroll">


                <div className="notas-lista">


                    {

                        lista.length === 0

                        ?

                        (

                            <div className="agenda-vacia">

                                No existen notas registradas.

                            </div>

                        )

                        :

                        (

                            lista.map((nota)=>{


                                const alumno = students.find(

                                    (student) =>

                                        student.id === nota.alumno_id

                                );


                                return (


                                    <div

                                        key={nota.id}

                                        className={

                                            `nota-card ${

                                                nota.color || "verde"

                                            }`

                                        }

                                        onClick={(e)=>{


                                            if(

                                                e.target.closest(

                                                    ".nota-acciones"

                                                )

                                            ){

                                                return;

                                            }


                                            setNotaVista(nota);


                                        }}

                                    >


                                        {/* ==========================
                                           CABECERA DE LA NOTA
                                        ========================== */}

                                        <div className="nota-header">


                                            <div className="nota-icono">

                                                {

                                                    nota.grupo

                                                    ?

                                                    <Users size={18}/>

                                                    :

                                                    <User size={18}/>

                                                }

                                            </div>


                                            <div className="nota-header-info">


                                                <h3>

                                                    {nota.titulo}

                                                </h3>


                                                <p>


                                                    {

                                                        nota.grupo

                                                        ?

                                                        `Grupo ${nota.grupo}`

                                                        :

                                                        `${

                                                            alumno?.nombre || ""

                                                        }

                                                        ${

                                                            alumno?.apellido_paterno || ""

                                                        }

                                                        ${

                                                            alumno?.apellido_materno || ""

                                                        }`

                                                    }


                                                </p>


                                            </div>


                                            <button

                                                className={

                                                    nota.fijada

                                                    ?

                                                    "nota-pin activo"

                                                    :

                                                    "nota-pin"

                                                }

                                                onClick={(e)=>{


                                                    e.stopPropagation();


                                                    fijarNota(nota);


                                                }}

                                            >

                                                <Pin size={15}/>


                                            </button>


                                        </div>


                                        {/* ==========================
                                           TEXTO
                                        ========================== */}

                                        <div className="nota-texto">


                                            {

                                                (nota.nota || "")

                                                    .split(" ")

                                                    .slice(0,6)

                                                    .join(" ")

                                            }


                                            {

                                                (nota.nota || "")

                                                    .split(" ")

                                                    .length > 6

                                                    ?

                                                    "..."

                                                    :

                                                    ""

                                            }


                                        </div>


                                        {/* ==========================
                                           FECHA
                                        ========================== */}

                                        <div className="nota-fecha">


                                            {

                                                nota.created_at

                                                ?

                                                new Date(

                                                    nota.created_at

                                                ).toLocaleDateString(

                                                    "es-MX"

                                                )

                                                :

                                                ""

                                            }


                                        </div>


                                        {/* ==========================
                                           ACCIONES
                                        ========================== */}

                                        <div className="nota-acciones">


                                            <button

                                                className="agenda-icon editar"

                                                onClick={(e)=>{


                                                    e.stopPropagation();


                                                    setNotaEditar(nota);


                                                    setModal(true);


                                                }}

                                            >

                                                <Pencil size={15}/>


                                            </button>


                                            <button

                                                className="agenda-icon eliminar"

                                                onClick={(e)=>{

                                                    e.stopPropagation();

                                                    console.log("Eliminar", nota);

                                                    setNotaEliminar(nota);

                                                }}

                                            >

                                                <Trash2 size={15}/>


                                            </button>


                                        </div>


                                    </div>


                                );

                            })

                        )

                    }


                </div>


            </div>


            {/* =================================
               MODAL CREAR / EDITAR
            ================================== */}

            <ModalNota

                abierto={modal}

                cerrar={()=>{

                    setModal(false);

                    setNotaEditar(null);

                }}

                guardar={guardarNota}

                students={students}

                notaActual={notaEditar}

            />

            {/* =================================
               MODAL ELIMINAR
            ================================== */}

            {

                notaEliminar && (


                    <div className="modal-opciones">


                        <div className="modal-contenido eliminar-modal">


                            <h2>

                                Eliminar nota

                            </h2>


                            <p>

                                ¿Deseas eliminar esta nota?

                            </p>


                            <div className="eliminar-botones">


                                <button

                                    className="btn-cancelar"

                                    onClick={()=>{

                                        setNotaEliminar(null);

                                    }}

                                >

                                    Cancelar


                                </button>


                                <button

                                    className="btn-eliminar"

                                    onClick={eliminarNota}

                                >

                                    Eliminar


                                </button>


                            </div>


                        </div>


                    </div>


                )

            }

            <VistaDetalleNota

                abierta={notaVista!==null}

                nota={notaVista}

                students={students}

                cerrar={()=>setNotaVista(null)}

                editar={(nota)=>{

                    setNotaVista(null);

                    setNotaEditar(nota);

                    setModal(true);

                }}

            />


        </div>

    );


    /* ==========================================
       RENDERIZADO
    ========================================== */

    return (

        embebido

        ?

        contenido

        :

        <>


            <div

                className="app-background"

                style={{

                    backgroundImage:

                        `url(${fondoPsicologia})`

                }}

            />


            <div className="ps-app">


                <div className="ps-container">


                    {contenido}


                </div>

            </div>

        </>

    );

}