import { jsPDF } from "jspdf";

export async function generarPDF(paginas) {

    const pdf = new jsPDF({

        orientation: "portrait",

        unit: "mm",

        format: "a4"

    });

    for (let i = 0; i < paginas.length; i++) {

        const blob = paginas[i].archivo;

        const imagenURL = URL.createObjectURL(blob);

        const imagen = new Image();

        await new Promise((resolve) => {

            imagen.onload = resolve;

            imagen.src = imagenURL;

        });
        URL.revokeObjectURL(imagenURL);

        const canvas = document.createElement("canvas");

        const ctx = canvas.getContext("2d");

        canvas.width = imagen.width;

        canvas.height = imagen.height;

        ctx.drawImage(imagen,0,0);

        const base64 = canvas.toDataURL(

            "image/jpeg",

            1
        );

        if(i>0){

            pdf.addPage();

        }

        pdf.addImage(

            base64,

            "JPEG",

            0,

            0,

            210,

            297

        );

    }

    return pdf.output("blob");

}