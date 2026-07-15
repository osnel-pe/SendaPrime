import "../../Styles/TabsPerfil.css";

export default function TabsPerfil({ pestañaActiva, cambiarPestaña }) {

    const pestañas = [

        "Información",
        "Historial",
        "Evaluaciones",
        "Intervenciones",
        "Documentos"

    ];

    return (

        <div className="tabs-perfil">

            {pestañas.map((item) => (

                <button

                    key={item}

                    className={

                        pestañaActiva === item

                        ? "tab-activa"

                        : "tab"

                    }

                    onClick={() => cambiarPestaña(item)}

                >

                    {item}

                </button>

            ))}

        </div>

    );

}