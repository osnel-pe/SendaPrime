/**
 * Extrae un posible nombre de alumno
 * desde el mensaje del usuario.
 */
export function detectarPosibleNombreAlumno(
    mensaje
) {

    if (
        !mensaje ||
        typeof mensaje !== "string"
    ) {

        return null;

    }

    const texto =
        mensaje.trim();

    // Elimina signos de puntuación
    const limpio =
        texto.replace(

            /[¿?¡!.,;:()[\]{}]/g,

            " "

        );

    const palabras =
        limpio
            .split(/\s+/)
            .filter(Boolean);

    // Palabras que normalmente no son nombres
    const palabrasIgnoradas = new Set([

        "que",
        "qué",
        "como",
        "cómo",
        "esta",
        "está",
        "sobre",
        "del",
        "de",
        "el",
        "la",
        "los",
        "las",
        "un",
        "una",
        "alumno",
        "alumna",
        "estudiante",
        "sabes",
        "tienes",
        "informacion",
        "información",
        "dime",
        "hablame",
        "háblame",
        "puedes",
        "analizar",
        "caso",
        "por",
        "favor"
    ]);

    const posibles =
        palabras.filter(

            palabra =>

                palabra.length >= 2 &&

                !palabrasIgnoradas.has(

                    palabra.toLowerCase()

                )

        );

    if (
        posibles.length === 0
    ) {

        return null;

    }

    // Tomamos como máximo dos palabras
    return posibles
        .slice(0, 2)
        .join(" ");

}