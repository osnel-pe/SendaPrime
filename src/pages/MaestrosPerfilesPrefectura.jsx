import {
    useEffect,
    useState
} from "react";

import {
    ArrowLeft,
    Search,
    UserRound,
    ChevronRight
} from "lucide-react";

import { supabase }
from "../services/supabase";

import "../Styles/MaestrosPerfilesPrefectura.css";


export default function MaestrosPerfilesPrefectura({

    seleccionarMaestro,
    cambiarPantalla

}) {

    const [maestros, setMaestros] =
        useState([]);

    const [busqueda, setBusqueda] =
        useState("");

    const [cargando, setCargando] =
        useState(true);


    useEffect(() => {

        cargarMaestros();

    }, []);


    async function cargarMaestros() {

        setCargando(true);

        const {
            data,
            error
        } = await supabase

            .from("maestros")

            .select("*")

            .eq("activo", true)

            .order(
                "apellido_paterno",
                {
                    ascending: true
                }
            );


        if (error) {

            console.log(
                "Error cargando maestros:",
                error
            );

            setCargando(false);

            return;

        }


        setMaestros(
            data || []
        );

        setCargando(false);

    }


    function normalizar(texto = "") {

        return texto

            .normalize("NFD")

            .replace(
                /[\u0300-\u036f]/g,
                ""
            )

            .toLowerCase();

    }


    const listaFiltrada =
        maestros.filter(
            maestro => {

                const nombreCompleto =

                    `${maestro.nombre || ""} ${
                        maestro.apellido_paterno || ""
                    } ${
                        maestro.apellido_materno || ""
                    }`;


                return normalizar(
                    nombreCompleto
                ).includes(
                    normalizar(busqueda)
                );

            }
        );


    return (

        <div className="mpp-container">


            {/* HEADER */}

            <div className="perfil-header">

                <button
                    className="back-btn"
                    onClick={() =>
                        cambiarPantalla("perfiles")
                    }
                >

                    <ArrowLeft size={20}/>

                </button>


                <div className="perfil-header-title">

                    <h2>
                        Maestros
                    </h2>

                </div>

            </div>


            {/* BUSCADOR */}

            <div className="mpp-buscador">

                <Search size={18}/>

                <input
                    placeholder="Buscar maestro..."
                    value={busqueda}
                    onChange={
                        e =>
                        setBusqueda(
                            e.target.value
                        )
                    }
                />

            </div>


            {/* LISTA */}

            <div className="mpp-lista">

                {

                    cargando

                    ?

                    <div className="mpp-vacio">

                        Cargando maestros...

                    </div>

                    :

                    listaFiltrada.length === 0

                    ?

                    <div className="mpp-vacio">

                        No existen maestros.

                    </div>

                    :

                    listaFiltrada.map(
                        maestro => (

                            <button

                                key={maestro.id}

                                className="mpp-card"

                                onClick={() => {

                                    seleccionarMaestro(
                                        maestro
                                    );

                                    cambiarPantalla(
                                        "perfilMaestroPrefectura"
                                    );

                                }}

                            >

                                <div className="mpp-avatar">

                                    <UserRound
                                        size={22}
                                    />

                                </div>


                                <div className="mpp-info">

                                    <strong>

                                        {
                                            maestro.nombre
                                        }{" "}

                                        {
                                            maestro.apellido_paterno
                                        }{" "}

                                        {
                                            maestro.apellido_materno
                                        }

                                    </strong>

                                    <span>

                                        {
                                            maestro.grupo
                                            ||
                                            "Sin grupo asignado"
                                        }

                                    </span>

                                </div>


                                <ChevronRight
                                    size={20}
                                    className="mpp-arrow"
                                />

                            </button>

                        )
                    )

                }

            </div>


        </div>

    );

}