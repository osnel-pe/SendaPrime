export const corsHeaders={

    "Access-Control-Allow-Origin":"*",

    "Access-Control-Allow-Headers":

    "authorization,x-client-info,apikey,content-type",

    "Access-Control-Allow-Methods":

    "POST,OPTIONS"

};

export function ok(data:any){

    return new Response(

        JSON.stringify(data),

        {

            status:200,

            headers:{

                ...corsHeaders,

                "Content-Type":"application/json"

            }

        }

    );

}

export function fail(

    message:string,

    status=500

){

    return new Response(

        JSON.stringify({

            error:message

        }),

        {

            status,

            headers:{

                ...corsHeaders,

                "Content-Type":"application/json"

            }

        }

    );

}