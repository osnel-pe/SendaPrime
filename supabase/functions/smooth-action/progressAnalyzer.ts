export function analizarProgreso(contexto:any){

    const notas=contexto.notas ?? [];

    if(notas.length<2){

        return{

            estado:"Sin información"

        };

    }

    return{

        estado:

        "En seguimiento",

        sesiones:

        notas.length,

        ultimaSesion:

        notas[0]?.created_at

    };

}