import "../../Styles/ZonaEscaneo.css";

import { useRef, useState } from "react";

import { Camera, Image, X } from "lucide-react";

import BottomSheet from "./BottomSheet";

export default function ZonaEscaneo({

    documento,

    setDocumento

}){

    const [abrirMenu, setAbrirMenu] = useState(false);

    const inputCamara = useRef(null);

    const inputGaleria = useRef(null);

    const seleccionarArchivo = (event)=>{

        const archivo = event.target.files[0];

        if(!archivo) return;

        const preview = archivo.type.startsWith("image/")
            ? URL.createObjectURL(archivo)
            : null;

        setDocumento({

            ...documento,

            archivo,

            preview,

            nombre:archivo.name,

            tamaño:archivo.size,

            tipo:archivo.type,

            estado:"Documento seleccionado",

            progreso:0

        });

        setAbrirMenu(false);

    };

    return(

        <>

        <input

            ref={inputCamara}

            type="file"

            accept="image/*"

            capture="environment"

            style={{display:"none"}}

            onChange={seleccionarArchivo}

        />

        <input

            ref={inputGaleria}

            type="file"

            accept="image/*,.pdf"

            style={{display:"none"}}

            onChange={seleccionarArchivo}

        />

        <div className="zona-scan">

            <button

                className="scan-principal"

                onClick={()=>setAbrirMenu(true)}

            >

                <Camera size={46}/>

                <h3>

                    Escanear documento

                </h3>

                <p>

                    Tome una fotografía o seleccione un archivo.

                </p>

            </button>

            {

                documento.nombre && (

                    <>

                    <div className="archivo-card">

                        <strong>

                            {documento.nombre}

                        </strong>

                        <small>

                            Documento listo.

                        </small>

                    </div>

                    {

                        documento.preview && (

                            <div className="preview-imagen">

                                <img

                                    src={documento.preview}

                                    alt="preview"

                                />

                            </div>

                        )

                    }

                    </>

                )

            }

        </div>

        <BottomSheet

            abierto={abrirMenu}

            cerrar={()=>setAbrirMenu(false)}

        >

            <div className="sheet-opciones">

                <button

                    className="sheet-btn"

                    onClick={()=>inputCamara.current.click()}

                >

                    <Camera size={24}/>

                    Tomar fotografía

                </button>

                <button

                    className="sheet-btn"

                    onClick={()=>inputGaleria.current.click()}

                >

                    <Image size={24}/>

                    Elegir de la galería

                </button>

                <button

                    className="sheet-btn cancelar"

                    onClick={()=>setAbrirMenu(false)}

                >

                    <X size={24}/>

                    Cancelar

                </button>

            </div>

        </BottomSheet>

        </>

    );

}