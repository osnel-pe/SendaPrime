import {

    ArrowLeft,

    Send,

    Plus

} from "lucide-react";

import { useEffect, useRef, useState } from "react";

import "../Styles/AppLayout.css";
import "../Styles/Psicologia.css";
import "../Styles/AsistenteIA.css";

import SelectorAlumno from "../components/SelectorAlumno";
import { preguntarANeuri } from "../ai/neuriService";
import { supabase } from "../services/supabase";
import fondoPsicologia from "../assets/fondo-psicologia.jpg";
import neuriCerebro from "../assets/neuri-cerebro.png";


export default function AsistenteIA({

    cambiarPantalla

}){

    const inputRef = useRef(null);

    useEffect(() => {

        const viewport = window.visualViewport;

        if (!viewport) return;

        const ajustarPantalla = () => {

            const diferencia =
                window.innerHeight - viewport.height;

            document.documentElement.style.setProperty(
                "--teclado-altura",
                `${diferencia}px`
            );

        };

        viewport.addEventListener(
            "resize",
            ajustarPantalla
        );

        viewport.addEventListener(
            "scroll",
            ajustarPantalla
        );

        ajustarPantalla();

        return () => {

            viewport.removeEventListener(
                "resize",
                ajustarPantalla
            );

            viewport.removeEventListener(
                "scroll",
                ajustarPantalla
            );

        };

    }, []);

    const [mensaje, setMensaje] = useState("");

    const [pensando, setPensando] = useState(false);

    const [

        alumnoSeleccionado,

        setAlumnoSeleccionado

    ] = useState(null);

    const [mensajes, setMensajes] = useState([

        {

            id:1,

            tipo:"ia",

            texto:

            "Hola. Soy Neuri. Estoy aquí para ayudarte a analizar la información de tus estudiantes y pensar juntos en estrategias de acompañamiento."

        }

    ]);

    const mensajesRef = useRef(null);


    useEffect(()=>{

        if(mensajesRef.current){

            mensajesRef.current.scrollTop =

                mensajesRef.current.scrollHeight;

        }

    },[mensajes]);


    const enviarMensaje = async () => {

    if (
        !mensaje.trim() ||
        pensando
    ) {

        return;

    }

    const textoUsuario =
        mensaje.trim();

    setMensaje("");

    setPensando(true);

    // ============================================
    // MOSTRAR MENSAJE DEL USUARIO
    // ============================================

    setMensajes(anterior => [

        ...anterior,

        {

            id: Date.now(),

            tipo: "usuario",

            texto: textoUsuario

        }

    ]);

    // ============================================
    // VALIDAR ALUMNO
    // ============================================

    if (!alumnoSeleccionado) {

        setMensajes(anterior => [

            ...anterior,

            {

                id: Date.now() + 1,

                tipo: "ia",

                texto:
                    "Selecciona un alumno antes de hacer una consulta sobre su información."

            }

        ]);

        setPensando(false);

        return;

    }

    try {

        const respuestaNeuri =
            await preguntarANeuri({

                mensaje:
                    textoUsuario,

                alumnoId:
                    alumnoSeleccionado.id

            });

        setMensajes(anterior => [

            ...anterior,

            {

                id: Date.now() + 1,

                tipo: "ia",

                texto:
                    respuestaNeuri

            }

        ]);

    }

    catch (error) {

        console.error(

            "ERROR COMPLETO DE NEURI:",

            error

        );

        setMensajes(anterior => [

            ...anterior,

            {

                id: Date.now() + 1,

                tipo: "ia",

                texto:

                    `Error: ${error.message}`

            }

        ]);

    }

    finally {

        setPensando(false);

    }

};


    const manejarTecla = (e)=>{

        if(e.key === "Enter"){

            e.preventDefault();

            enviarMensaje();

        }

    };


    return(

        <>

            <div

                className="app-background"

                style={{

                    backgroundImage:

                    `url(${fondoPsicologia})`

                }}

            />


            <div className="ps-app">

                <div className="ps-container asistente-container">


                    <div className="chat-header">


                        <button

                            className="chat-back-btn"

                            onClick={()=>{

                                cambiarPantalla("psicologia");

                            }}

                        >

                            <ArrowLeft size={22}/>

                        </button>


                        <div className="chat-header-info">


                            <div className="chat-avatar">

                                <img

                                    src={neuriCerebro}

                                    alt="Neuri"

                                />

                            </div>


                            <div>

                                <h1>

                                    Neuri

                                </h1>

                                <p>

                                    Asistente de Psicología

                                </p>

                            </div>


                        </div>


                        <div className="neuri-online">

                            <span></span>

                            En línea

                        </div>


                    </div>

                    <SelectorAlumno

                        alumnoSeleccionado={
                            alumnoSeleccionado
                        }

                        setAlumnoSeleccionado={
                            setAlumnoSeleccionado
                        }

                    />


                    <div

                        className="chat-mensajes"

                        ref={mensajesRef}

                    >


                        <div className="chat-bienvenida">

                            <div className="bienvenida-avatar">

                                <img

                                    src={neuriCerebro}

                                    alt="Neuri"

                                />

                            </div>


                            <h2>

                                Hola, soy Neuri

                            </h2>


                            <p>

                                Tu asistente de apoyo para Psicología Escolar.

                            </p>


                            <span>

                                Podemos analizar juntos la información de tus estudiantes.

                            </span>

                        </div>


                        {

                            mensajes.map((m)=> (

                                <div

                                    key={m.id}

                                    className={

                                        `mensaje ${

                                            m.tipo === "usuario"

                                            ?

                                            "mensaje-usuario"

                                            :

                                            "mensaje-ia"

                                        }`

                                    }

                                >


                                    {

                                        m.tipo === "ia" && (

                                            <div className="mensaje-avatar">

                                                <img

                                                    src={neuriCerebro}

                                                    alt="Neuri"

                                                />

                                            </div>

                                        )

                                    }


                                    <div className="burbuja">

                                        {m.texto}

                                    </div>


                                </div>

                            ))

                        }


                    </div>


                    <div className="chat-input-container">


                        <button

                            className="chat-plus-btn"

                            type="button"

                        >

                            <Plus size={20}/>

                        </button>


                        <input

                            type="text"

                            inputMode="text"

                            enterKeyHint="send"

                            placeholder="Escribe un mensaje..."

                            value={mensaje}

                            onChange={(e)=>

                                setMensaje(e.target.value)

                            }

                            onKeyDown={manejarTecla}

                        />


                        <button

                            className="chat-send-btn"

                            onClick={enviarMensaje}

                        >

                            <Send size={20}/>

                        </button>


                    </div>


                </div>

            </div>

        </>

    );

}