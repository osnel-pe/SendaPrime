export async function guardarDocumento(word){

  console.log("Subiendo a Supabase...");

  return new Promise((resolve)=>{

      setTimeout(()=>{

          resolve({

              url:

              "https://supabase/documento.docx"

          });

      },1000);

  });

}