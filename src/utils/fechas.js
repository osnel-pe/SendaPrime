export const formatearFecha = (fecha)=>{

    return new Date(fecha + "T12:00:00")

    .toLocaleDateString(

        "es-MX",

        {

            day:"numeric",

            month:"long",

            year:"numeric"

        }

    );

};