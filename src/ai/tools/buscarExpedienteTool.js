import { supabase } from "../../services/supabase";

const BUCKET = "expedientes";

export async function buscarExpediente({

    grupo,

    alumnoId

} = {}) {

    if (!grupo || !alumnoId) {

        return {

            encontrado: false,

            archivos: [],

            mensaje:
                "No se proporcionó grupo o alumno."

        };

    }

    try {

        const ruta = `${grupo}/${alumnoId}`;

        const {

            data,

            error

        } = await supabase.storage

            .from(BUCKET)

            .list(ruta, {

                limit: 100,

                sortBy: {

                    column: "name",

                    order: "asc"

                }

            });

        if (error) {

            console.error(
                "Error consultando expediente:",
                error
            );

            throw error;

        }

        const archivos = (data || [])

            .filter(

                archivo =>

                    archivo.name
                        .toLowerCase()
                        .endsWith(".pdf")

            )

            .map(

                archivo => ({

                    nombre: archivo.name,

                    ruta: `${ruta}/${archivo.name}`

                })

            );

        return {

            encontrado:
                archivos.length > 0,

            archivos

        };

    }

    catch (error) {

        console.error(
            "buscarExpediente:",
            error
        );

        return {

            encontrado: false,

            archivos: [],

            error:
                "No se pudo consultar el expediente."

        };

    }

}