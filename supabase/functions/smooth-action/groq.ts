import { AI } from "./constants.ts";

export async function preguntarGroq(

    prompt:string

){

    const apiKey=

    Deno.env.get("GROQ_API_KEY");

    if(!apiKey){

        throw new Error(

            "Falta GROQ_API_KEY"

        );

    }

    const response=

    await fetch(

        "https://api.groq.com/openai/v1/chat/completions",

        {

            method:"POST",

            headers:{

                Authorization:

                `Bearer ${apiKey}`,

                "Content-Type":

                "application/json"

            },

            body:JSON.stringify({

                model:AI.MODEL,

                temperature:AI.TEMPERATURE,

                max_tokens:AI.MAX_TOKENS,

                messages:[

                    {

                        role:"system",

                        content:

                        "Eres Neuri, especialista en Psicología Escolar."

                    },

                    {

                        role:"user",

                        content:prompt

                    }

                ]

            })

        }

    );

    const json=

    await response.json();

    if(!response.ok){

        throw new Error(

            json?.error?.message ||

            "Groq Error"

        );

    }

    return json

    .choices[0]

    .message

    .content;

}