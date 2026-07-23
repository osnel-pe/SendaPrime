export function log(

    titulo:string,

    datos?:any

){

    console.log(

        "🧠 NEURI:",

        titulo

    );

    if(datos){

        console.log(

            JSON.stringify(

                datos,

                null,

                2

            )

        );

    }

}