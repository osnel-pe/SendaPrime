import { useRef, useState, useEffect } from "react";

import {
    ScanLine,
    Camera,
    X,
    Trash2,
    Check,
    Plus
} from "lucide-react";

import "../Styles/EscanerDocumento.css";

import { generarPDF } from "../utils/generarPDF";
import MarcoDocumento from "./MarcoDocumento";
import { procesarCaptura } from "../utils/procesarCaptura";
import { recortarDocumento } from "../utils/recortarDocumento";
import { rotarImagen } from "../utils/rotarImagen";
import EditorRecorte from "./EditorRecorte";


export default function EscanerDocumento({

    onCancelar,

    onImagenCapturada

}) {

    const videoRef = useRef(null);

    const canvasRef = useRef(null);

    const streamRef = useRef(null);

    const [paginas, setPaginas] = useState([]);

    const [camaraLista, setCamaraLista] = useState(false);

    const intervaloRef = useRef(null);

    const [modoEscaneo, setModoEscaneo] = useState("documento");

    const [editorAbierto, setEditorAbierto] = useState(false);

    const [paginaEditando, setPaginaEditando] = useState(null);

    //=========================================
    // INICIAR CÁMARA
    //=========================================

    useEffect(() => {

        iniciarCamara();
    
        return () => {
    
            detenerCamara();
    
        };
    
    }, []);

    const iniciarCamara = async () => {

        try {

            const stream = await navigator.mediaDevices.getUserMedia({

                video: {

                    facingMode: "environment",

                    width: { ideal: 1080 },

                    height: { ideal: 1920 }

                },

                audio: false

            });

            streamRef.current = stream;

            if (videoRef.current) {

                videoRef.current.srcObject = stream;

                videoRef.current.onloadedmetadata = () => {

                    setCamaraLista(true);

                };

            }

        }

        catch (error) {

            console.error(error);

            alert("No fue posible abrir la cámara.");

        }

    };

    //=========================================
    // DETENER CÁMARA
    //=========================================

    const detenerCamara = () => {

        if (!streamRef.current) return;

        streamRef.current.getTracks().forEach(track => track.stop());

    };

    //=========================================
    // TOMAR FOTOGRAFÍA
    //=========================================

    const tomarFoto = () => {

        console.log("CLICK");

    console.log("camaraLista:", camaraLista);


        if (!camaraLista) return;
    
        const video = videoRef.current;
        const canvas = canvasRef.current;
    
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
    
        const ctx = canvas.getContext("2d");
    
        ctx.drawImage(video, 0, 0);
    
        canvas.toBlob(async (blob) => {
    
            if (!blob) return;
    
            const blobRecortado = await recortarDocumento(blob);

            const blobMejorado = await procesarCaptura(
                blobRecortado,
                modoEscaneo
            );
    
            const archivo = new File(
                [blobMejorado],
                `pagina-${Date.now()}.jpg`,
                {
                    type: "image/jpeg"
                }
            );
    
            const url = URL.createObjectURL(blobMejorado);
    
            setPaginas(prev => [

                ...prev,
            
                {
            
                    id: crypto.randomUUID(),
            
                    archivo,
            
                    url,
            
                    rotacion: 0,
            
                    recorte: null,
            
                    procesada: false
            
                }
            
            ]);
    
        }, "image/jpeg", 0.95);
    
    };

    function moverPagina(indice, direccion){

        setPaginas(prev=>{
    
            const nuevas=[...prev];
    
            const destino=indice+direccion;
    
            if(destino<0 || destino>=nuevas.length){
    
                return prev;
    
            }
    
            [nuevas[indice], nuevas[destino]] =
    
            [nuevas[destino], nuevas[indice]];
    
            return nuevas;
    
        });
    
    }

    //=========================================
    // ELIMINAR PÁGINA
    //=========================================

    const eliminarPagina = (indice) => {

        setPaginas(prev =>

            prev.filter((_, i) => i !== indice)

        );

    };

    //=========================================
    // FINALIZAR
    //=========================================

    return (

        <div className="escaner-overlay">
    
            <div className="escaner-panel">
    
                {/*==========================
                    ENCABEZADO
                ==========================*/}

            {
                editorAbierto && (

                    <EditorRecorte

                        imagen={paginaEditando.url}

                        onCancelar={() => {

                            setEditorAbierto(false);

                            setPaginaEditando(null);

                        }}

                        onGuardar={(puntos) => {

                            console.log("Puntos seleccionados");

                            console.log(puntos);

                            setEditorAbierto(false);

                            setPaginaEditando(null);

                        }}

                    />

                )
            }
    
                <div className="escaner-header">
    
                    
    
                    <h2>Escanear documento</h2>
    
                    <p>
    
                        Coloca la hoja dentro del recuadro 
    
                    </p>
    
                </div>
    
                {/*==========================
                    CÁMARA
                ==========================*/}
    
                    <div
                    className="escaner-preview"
                    style={{
                        width: "100%",
                        maxWidth: "430px",
                        aspectRatio: "210 / 297",
                        margin: "0 auto",
                        background: "#000",
                        borderRadius: "18px",
                        overflow: "hidden",
                        border: "3px solid rgba(255,255,255,.15)",
                        position: "relative"
                    }}
                >

                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover"
                        }}
                    />

                    <canvas
                        ref={canvasRef}
                        style={{ display: "none" }}
                    />

                     <MarcoDocumento /> 

                </div>
    
                {/*==========================
                    CONTADOR
                ==========================*/}
    
                <div
                    className="contador-paginas"
                    style={{
                        marginTop: "14px",
                        fontWeight: "600",
                        textAlign: "center"
                    }}
                >

                    {
                        paginas.length===0
                        ? "Aún no hay páginas capturadas."
                        : `${paginas.length} página${paginas.length>1?"s":""} capturada${paginas.length>1?"s":""}`
                    }

                </div>

                <div className="selector-filtro">

                <button
                    className={modoEscaneo==="original" ? "activo" : ""}
                    onClick={()=>setModoEscaneo("original")}
                >
                    Original
                </button>

                <button
                    className={modoEscaneo==="documento" ? "activo" : ""}
                    onClick={()=>setModoEscaneo("documento")}
                >
                    Documento
                </button>

                <button
                    className={modoEscaneo==="color" ? "activo" : ""}
                    onClick={()=>setModoEscaneo("color")}
                >
                    Color
                </button>

                <button
                    className={modoEscaneo==="byn" ? "activo" : ""}
                    onClick={()=>setModoEscaneo("byn")}
                >
                    B/N
                </button>

            </div>
    
                {/*==========================
                    BOTONES
                ==========================*/}
    
                <div className="acciones-escaner">

                <button
                    className="btn-cancelar-scan"
                    onClick={onCancelar}
                >
                    Cancelar
                </button>

            <button
                className="btn-camara"
                onClick={tomarFoto}
            >
                <Camera size={32}/>
            </button>

            <button
                className="btn-finalizar"
                onClick={async () => {

                    if (paginas.length === 0) return;
                
                    const pdf = await generarPDF(paginas);

                    console.log(pdf);

                    alert("PDF creado correctamente");

                    onImagenCapturada(pdf);
                
                }}
                disabled={paginas.length===0}
            >
                Finalizar
            </button>

            </div>
    
                {/*==========================
                    MINIATURAS
                ==========================*/}
    
    {
    paginas.length > 0 && (

        <div className="galeria-paginas">

            {

                paginas.map((pagina, index) => (

                    <div
                        key={pagina.id}
                        className="miniatura-pagina"
                    >

                        <img
                            src={pagina.url}
                            alt={`Página ${index + 1}`}
                        />

                        <span>

                            Página {index + 1}

                        </span>

                    <div className="acciones-miniatura">

                    <button
                        className="btn-recortar-miniatura"
                        onClick={() => {

                            setPaginaEditando(pagina);

                            setEditorAbierto(true);

                        }}
                    >
                        ✂️
                    </button>

                    <button
                
                        className="btn-rotar-miniatura"
                
                        onClick={async()=>{
                
                            const nuevaImagen = await rotarImagen(
                
                                pagina.archivo,
                
                                90
                
                            );
                
                            setPaginas(prev=>
                
                                prev.map(p=>
                
                                    p.id===pagina.id
                
                                    ?{
                
                                        ...p,
                
                                        archivo:nuevaImagen.archivo,
                
                                        url:nuevaImagen.url,
                
                                        rotacion:(p.rotacion+90)%360
                
                                    }
                
                                    :p
                
                                )
                
                            );
                
                        }}
                
                    >
                
                        ↻
                
                    </button>

                    <button
                        className="btn-mover-miniatura"
                        onClick={() => moverPagina(index, -1)}
                        disabled={index === 0}
                    >
                        ↑
                    </button>

                    <button
                        className="btn-mover-miniatura"
                        onClick={() => moverPagina(index, 1)}
                        disabled={index === paginas.length - 1}
                    >
                        ↓
                    </button>
                
                    <button
                
                        className="btn-eliminar-miniatura"
                
                        onClick={()=>{
                
                            setPaginas(
                
                                paginas.filter(
                
                                    p=>p.id!==pagina.id
                
                                )
                
                            );
                
                        }}
                
                    >
                
                        <Trash2 size={18}/>
                
                    </button>
                
                </div>
                </div>

                ))

            }

        </div>

    )
}  
    
            </div>
    
        </div>
    
    );
}