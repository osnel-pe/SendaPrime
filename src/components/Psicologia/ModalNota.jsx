import { useEffect,useState } from "react";

import "../../Styles/ModalNEE.css";

const inicial={

    alumno_id:null,

    grupo:null,

    titulo:"",

    nota:"",

    color:"verde",

    fijada:false

};

export default function ModalNota({

    abierto,

    cerrar,

    guardar,

    students=[],

    notaActual=null,

    ocultarAlumno=false,

    soloIndividual=false,

    soloPerfil=false

}){

    const [datos,setDatos]=useState(inicial);

    const [tipo,setTipo]=useState("individual");

    const [buscar,setBuscar]=useState("");

    const [mostrarLista,setMostrarLista]=useState(false);

        useEffect(()=>{

        if(!abierto) return;

        if(notaActual){

            setDatos({

                alumno_id:notaActual.alumno_id ?? null,

                grupo:notaActual.grupo ?? null,

                titulo:notaActual.titulo ?? "",

                nota:notaActual.nota ?? "",

                color:notaActual.color ?? "verde",

                fijada:notaActual.fijada ?? false

            });

            setTipo(

                notaActual.grupo

                ?

                "grupo"

                :

                "individual"

            );

            const alumno=students.find(

                a=>a.id===notaActual.alumno_id

            );

            if(alumno){

                setBuscar(

                    `${alumno.nombre} ${alumno.apellido_paterno} ${alumno.apellido_materno}`

                );

            }else{

                setBuscar("");

            }

        }else{

            setDatos(inicial);

            setTipo("individual");

            setBuscar("");

        }

    },[abierto,notaActual,students]);
        if(!abierto) return null;

    const normalizar=(texto="")=>

        texto

        .normalize("NFD")

        .replace(/[\u0300-\u036f]/g,"")

        .toLowerCase();

    const alumnosFiltrados=(students || []).filter((alumno)=>{

        const nombre=normalizar(

            `${alumno.nombre} ${alumno.apellido_paterno} ${alumno.apellido_materno}`

        );

        return nombre.includes(

            normalizar(buscar)

        );

    });

    return(

        <div className="modal-overlay">

            <div className="modal-nee">

                <h2>

                    {

                        notaActual

                        ?

                        "Editar nota"

                        :

                        "Nueva nota"

                    }

                </h2>

                                {

                    !soloPerfil && !soloIndividual && (

                        <>

                            <label>

                                Tipo

                            </label>

                            <select

                                value={tipo}

                                onChange={(e)=>

                                    setTipo(e.target.value)

                                }

                            >

                                <option value="individual">

                                    Alumno

                                </option>

                                <option value="grupo">

                                    Grupo

                                </option>

                            </select>

                        </>

                    )

                }

                                {

                    tipo==="individual"

                    ? (

                        <>

                            {

                                !ocultarAlumno && !soloPerfil && (

                                    <>

                                        <label>

                                            Alumno

                                        </label>

                                        <input

                                            placeholder="Buscar alumno..."

                                            value={buscar}

                                            onFocus={()=>setMostrarLista(true)}

                                            onChange={(e)=>{

                                                setBuscar(e.target.value);

                                                setMostrarLista(true);

                                            }}

                                            onBlur={()=>{

                                                setTimeout(()=>{

                                                    setMostrarLista(false);

                                                },150);

                                            }}

                                        />

                                        {

                                            mostrarLista && (

                                                <div className="lista-alumnos-modal">

                                                    {

                                                        alumnosFiltrados.map(alumno=>(

                                                            <div

                                                                key={alumno.id}

                                                                className="item-alumno-modal"

                                                                onClick={()=>{

                                                                    setBuscar(

                                                                        `${alumno.nombre} ${alumno.apellido_paterno} ${alumno.apellido_materno}`

                                                                    );

                                                                    setDatos({

                                                                        ...datos,

                                                                        alumno_id:alumno.id

                                                                    });

                                                                    setMostrarLista(false);

                                                                }}

                                                            >

                                                                <strong>

                                                                    {alumno.nombre}{" "}

                                                                    {alumno.apellido_paterno}{" "}

                                                                    {alumno.apellido_materno}

                                                                </strong>

                                                                <br/>

                                                                <small>

                                                                    {alumno.grupo}

                                                                </small>

                                                            </div>

                                                        ))

                                                    }

                                                </div>

                                            )

                                        }

                                    </>

                                )

                            }

                        </>

                    )

                    : (

                        <>

                            <label>

                                Grupo

                            </label>

                            <select

                                value={datos.grupo || ""}

                                onChange={(e)=>

                                    setDatos({

                                        ...datos,

                                        grupo:e.target.value,

                                        alumno_id:null

                                    })

                                }

                            >

                                <option value="">

                                    Selecciona un grupo

                                </option>

                                {

                                    [...new Set(

                                        students

                                            .map(a=>a.grupo)

                                            .filter(Boolean)

                                    )]

                                    .sort((a,b)=>

                                        a.localeCompare(

                                            b,

                                            undefined,

                                            {

                                                numeric:true,

                                                sensitivity:"base"

                                            }

                                        )

                                    )

                                    .map(grupo=>(

                                        <option

                                            key={grupo}

                                            value={grupo}

                                        >

                                            {grupo}

                                        </option>

                                    ))

                                }

                            </select>

                        </>

                    )

                }

                                <label>

                    Título

                </label>

                <input

                    value={datos.titulo}

                    placeholder="Ej. Entrevista con padres"

                    onChange={(e)=>

                        setDatos({

                            ...datos,

                            titulo:e.target.value

                        })

                    }

                />

                <label>

                    Nota

                </label>

                <textarea

                    rows={6}

                    value={datos.nota}

                    placeholder="Escribe aquí las observaciones..."

                    onChange={(e)=>

                        setDatos({

                            ...datos,

                            nota:e.target.value

                        })

                    }

                />

                <label>

                    Color

                </label>

                <div className="nota-colores">

                    <button

                        type="button"

                        className={

                            datos.color==="verde"

                            ?

                            "color activo verde"

                            :

                            "color verde"

                        }

                        onClick={()=>

                            setDatos({

                                ...datos,

                                color:"verde"

                            })

                        }

                    />

                    <button

                        type="button"

                        className={

                            datos.color==="amarillo"

                            ?

                            "color activo amarillo"

                            :

                            "color amarillo"

                        }

                        onClick={()=>

                            setDatos({

                                ...datos,

                                color:"amarillo"

                            })

                        }

                    />

                    <button

                        type="button"

                        className={

                            datos.color==="rojo"

                            ?

                            "color activo rojo"

                            :

                            "color rojo"

                        }

                        onClick={()=>

                            setDatos({

                                ...datos,

                                color:"rojo"

                            })

                        }

                    />

                </div>

                <div className="modal-botones">

                    <button

                        type="button"

                        className="btn-cancelar"

                        onClick={cerrar}

                    >

                        Cancelar

                    </button>

                    <button

                        type="button"

                        className="btn-guardar"

                        onClick={()=>{

                            if(!datos.titulo.trim()) return;

                            if(!datos.nota.trim()) return;

                            guardar({

                            ...datos,

                            titulo:datos.titulo.trim(),

                            nota:datos.nota.trim(),

                            grupo:

                                tipo==="grupo"

                                ? datos.grupo

                                : null,

                            alumno_id:

                                tipo==="individual"

                                ? datos.alumno_id

                                : null

                        });
                        }}

                    >

                        Guardar

                    </button>

                </div>

            </div>

        </div>

    );

}