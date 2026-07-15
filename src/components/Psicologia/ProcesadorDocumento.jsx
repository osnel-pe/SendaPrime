import { leerDocumento } from "../../services/OCRService";
import { generarWord } from "../../services/WordService";
import { guardarDocumento } from "../../services/StorageService";
import { actualizarPerfil } from "../../services/PerfilService";

export async function procesarDocumento(

    documento,

    setDocumento

){

    if(!documento.archivo){

        return;

    }

    try{

        // Preparación

        setDocumento(prev => ({

            ...prev,

            estado:"Preparando documento...",

            progreso:5

        }));


        // OCR

        setDocumento(prev => ({

            ...prev,

            estado:"Leyendo documento...",

            progreso:20

        }));

        const resultadoOCR = await leerDocumento(

            documento.archivo

        );


        // IA

        setDocumento(prev => ({

            ...prev,

            estado:"Analizando información...",

            progreso:45

        }));

        const datos = await analizarDocumento(

            resultadoOCR.texto

        );


        // Word

        setDocumento(prev => ({

            ...prev,

            estado:"Generando Word...",

            progreso:70

        }));

        const word = await generarWord(

            datos

        );


        // Supabase

        setDocumento(prev => ({

            ...prev,

            estado:"Guardando expediente...",

            progreso:90

        }));

        const archivoGuardado = await guardarDocumento(

            word

        );


        // Perfil

        await actualizarPerfil(

            datos

        );


        // Final

        setDocumento(prev => ({

            ...prev,

            textoOCR:resultadoOCR.texto,

            datosExtraidos:datos,

            wordGenerado:archivoGuardado,

            estado:"Proceso completado",

            progreso:100

        }));

    }

    catch(error){

        console.error(error);

        setDocumento(prev=>({

            ...prev,

            estado:"Ocurrió un error.",

            progreso:0

        }));

    }

}