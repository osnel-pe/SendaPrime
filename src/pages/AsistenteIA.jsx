import {
    ArrowLeft,
    Bot,
    Send
} from "lucide-react";

import { useState } from "react";

import "../Styles/AppLayout.css";
import "../Styles/Psicologia.css";
import "../Styles/AsistenteIA.css";

import fondoPsicologia from "../assets/fondo-psicologia.jpg";

export default function AsistenteIA({

    cambiarPantalla

}){

    const [mensaje, setMensaje] = useState("");

    const [mensajes, setMensajes] = useState([

        {

            tipo:"ia",

            texto:

            "Hola. Soy Neuri, tu asistente de apoyo para Psicología Escolar. Puedo ayudarte a analizar la información de tus estudiantes y encontrar estrategias de acompañamiento."

        }

    ]);

    const enviarMensaje = () => {

        if(!mensaje.trim()) return;

        setMensajes([

            ...mensajes,

            {

                tipo:"usuario",

                texto:mensaje

            }

        ]);

        setMensaje("");

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

                            onClick={() =>

                                cambiarPantalla("psicologia")

                            }

                        >

                            <ArrowLeft size={22}/>

                        </button>

                        <div className="chat-header-info">

                            <div className="chat-avatar">

                                <Bot size={22}/>

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

                    </div>


                    <div className="chat-mensajes">

                        {

                            mensajes.map((m,index)=>(

                                <div

                                    key={index}

                                    className={`mensaje ${
                                        m.tipo === "usuario"
                                        ?
                                        "mensaje-usuario"
                                        :
                                        "mensaje-ia"
                                    }`}

                                >

                                    {

                                        m.tipo === "ia" && (

                                            <div className="mensaje-avatar">

                                                <Bot size={17}/>

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

                        <input

                            type="text"

                            placeholder="Escribe un mensaje..."

                            value={mensaje}

                            onChange={(e)=>

                                setMensaje(e.target.value)

                            }

                            onKeyDown={(e)=>{

                                if(e.key === "Enter"){

                                    enviarMensaje();

                                }

                            }}

                        />

                        <button

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