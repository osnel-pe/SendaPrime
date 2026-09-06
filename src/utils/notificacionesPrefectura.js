import { supabase }
from "../services/supabase";


/*==================================================
OBTENER MES Y AÑO
==================================================*/

function obtenerMesAnio(fecha) {

    if (!fecha) {

        return null;

    }


    const texto =
        String(fecha)
            .slice(0, 10);


    const [
        anio,
        mes
    ] =
        texto
            .split("-")
            .map(Number);


    if (
        !anio
        ||
        !mes
    ) {

        return null;

    }


    return {

        anio,

        mes

    };

}


/*==================================================
AGRUPAR ALUMNOS POR MES
==================================================*/

function agruparPorAlumnoYMes(
    registros
) {

    const mapa = {};


    (registros || []).forEach(
        registro => {

            if (
                !registro.alumno_id
                ||
                !registro.fecha
            ) {

                return;

            }


            const periodo =
                obtenerMesAnio(
                    registro.fecha
                );


            if (!periodo) {

                return;

            }


            const clave =
                `${registro.alumno_id}:${periodo.anio}-${periodo.mes}`;


            if (!mapa[clave]) {

                mapa[clave] = {

                    alumnoId:
                        registro.alumno_id,

                    anio:
                        periodo.anio,

                    mes:
                        periodo.mes,

                    registros:
                        []

                };

            }


            mapa[clave]
                .registros
                .push(
                    registro
                );

        }
    );


    return Object.values(
        mapa
    );

}


/*==================================================
AGRUPAR MAESTROS POR MES
==================================================*/

function agruparPorMaestroYMes(
    registros
) {

    const mapa = {};


    (registros || []).forEach(
        registro => {

            if (
                !registro.maestro_id
                ||
                !registro.fecha
            ) {

                return;

            }


            const periodo =
                obtenerMesAnio(
                    registro.fecha
                );


            if (!periodo) {

                return;

            }


            const clave =
                `${registro.maestro_id}:${periodo.anio}-${periodo.mes}`;


            if (!mapa[clave]) {

                mapa[clave] = {

                    maestroId:
                        registro.maestro_id,

                    anio:
                        periodo.anio,

                    mes:
                        periodo.mes,

                    registros:
                        []

                };

            }


            mapa[clave]
                .registros
                .push(
                    registro
                );

        }
    );


    return Object.values(
        mapa
    );

}


/*==================================================
ORDENAR REGISTROS POR FECHA
==================================================*/

function ordenarPorFecha(
    registros
) {

    return [
        ...registros
    ].sort(
        (
            a,
            b
        ) => {

            const fechaA =
                `${a.fecha || ""} ${a.created_at || ""}`;

            const fechaB =
                `${b.fecha || ""} ${b.created_at || ""}`;


            return fechaA
                .localeCompare(
                    fechaB
                );

        }
    );

}


/*==================================================
NOMBRE DEL ALUMNO / MAESTRO

Solo se utiliza para hacer más clara
la notificación del teléfono.
==================================================*/

async function obtenerNombrePersona(
    alerta
) {

    try {

        /*==============================================
        ALUMNO
        ==============================================*/

        if (
            alerta.entidad_tipo
            === "alumno"
            &&
            alerta.alumno_id
        ) {

            const {
                data,
                error
            } = await supabase

                .from("alumnos")

                .select(`
                    nombre,
                    apellido_paterno,
                    apellido_materno,
                    grupo
                `)

                .eq(
                    "id",
                    alerta.alumno_id
                )

                .maybeSingle();


            if (
                error
                ||
                !data
            ) {

                return {

                    nombre:
                        "Alumno",

                    detalle:
                        ""

                };

            }


            return {

                nombre:
                    [
                        data.nombre,
                        data.apellido_paterno,
                        data.apellido_materno
                    ]
                        .filter(Boolean)
                        .join(" "),

                detalle:
                    data.grupo || ""

            };

        }


        /*==============================================
        MAESTRO
        ==============================================*/

        if (
            alerta.entidad_tipo
            === "maestro"
            &&
            alerta.maestro_id
        ) {

            const {
                data,
                error
            } = await supabase

                .from("maestros")

                .select("*")

                .eq(
                    "id",
                    alerta.maestro_id
                )

                .maybeSingle();


            if (
                error
                ||
                !data
            ) {

                return {

                    nombre:
                        "Maestro",

                    detalle:
                        ""

                };

            }


            return {

                nombre:
                    [
                        data.nombre,
                        data.apellido_paterno,
                        data.apellido_materno
                    ]
                        .filter(Boolean)
                        .join(" "),

                detalle:
                    data.grupo || ""

            };

        }

    }

    catch (error) {

        console.log(
            "Error obteniendo nombre para push:",
            error
        );

    }


    return {

        nombre:
            alerta.entidad_tipo === "maestro"
                ?
                "Maestro"
                :
                "Alumno",

        detalle:
            ""

    };

}


/*==================================================
CONSTRUIR MENSAJE PUSH
==================================================*/

async function construirPush(
    alerta
) {

    const persona =
        await obtenerNombrePersona(
            alerta
        );


    const nombre =
        persona.nombre;


    switch (
        alerta.tipo
    ) {

        /*==============================================
        TARDANZAS DE ALUMNOS
        ==============================================*/

        case "alumno_tardanza_2":

            return {

                title:
                    "SendaPrime · Tardanzas",

                body:
                    `${nombre} acumula 2 tardanzas este mes. Debe avisarse al padre o tutor que en la próxima tardanza no podrá ingresar a su salón.`

            };


        case "alumno_tardanza_reincidente":

            return {

                title:
                    "SendaPrime · Alerta",

                body:
                    `${nombre} acumula ${alerta.cantidad} tardanzas este mes. No podrá ingresar a su salón de clases.`

            };


        /*==============================================
        AUSENCIAS DE ALUMNOS
        ==============================================*/

        case "alumno_ausencia_2":

            return {

                title:
                    "SendaPrime · Reincidencia",

                body:
                    `${nombre} acumula 2 ausencias este mes y se considera alumno reincidente.`

            };


        case "alumno_ausencia_reincidente":

            return {

                title:
                    "SendaPrime · Nueva ausencia",

                body:
                    `${nombre}, alumno reincidente, acumula ${alerta.cantidad} ausencias este mes.`

            };


        /*==============================================
        REPORTES DE ALUMNOS REINCIDENTES
        ==============================================*/

        case "alumno_reincidente_reporte":

            return {

                title:
                    "SendaPrime · Nuevo reporte",

                body:
                    `${nombre}, alumno reincidente, recibió un nuevo reporte este mes.`

            };


        /*==============================================
        FALTAS DE MAESTROS
        ==============================================*/

        case "maestro_falta_2":

            return {

                title:
                    "SendaPrime · Maestro reincidente",

                body:
                    `${nombre} acumula 2 faltas este mes. Requiere seguimiento.`

            };


        case "maestro_falta_reincidente":

            return {

                title:
                    "SendaPrime · Nueva falta",

                body:
                    `${nombre} acumula ${alerta.cantidad} faltas este mes.`

            };


        /*==============================================
        GUARDIA DE RECREO
        ==============================================*/

        case "maestro_recreo_2":

            return {

                title:
                    "SendaPrime · Guardia de recreo",

                body:
                    `${nombre} acumula 2 incumplimientos de guardia de recreo este mes.`

            };


        case "maestro_recreo_reincidente":

            return {

                title:
                    "SendaPrime · Guardia de recreo",

                body:
                    `${nombre} acumula ${alerta.cantidad} incumplimientos de guardia de recreo este mes.`

            };


        /*==============================================
        GUARDIA DE SALIDA
        ==============================================*/

        case "maestro_salida_2":

            return {

                title:
                    "SendaPrime · Guardia de salida",

                body:
                    `${nombre} acumula 2 incumplimientos de guardia de salida este mes.`

            };


        case "maestro_salida_reincidente":

            return {

                title:
                    "SendaPrime · Guardia de salida",

                body:
                    `${nombre} acumula ${alerta.cantidad} incumplimientos de guardia de salida este mes.`

            };


        default:

            return {

                title:
                    "SendaPrime · Prefectura",

                body:
                    "Existe una nueva alerta que requiere atención."

            };

    }

}


/*==================================================
ENVIAR PUSH AL TELÉFONO
==================================================*/

async function enviarPush(
    alerta
) {

    try {

        const mensaje =
            await construirPush(
                alerta
            );


        const respuesta =
            await fetch(
                "/api/send-push",
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            title:
                                mensaje.title,

                            body:
                                mensaje.body,

                            /*
                            Por ahora abrimos la PWA.

                            Después podemos hacer que
                            abra directamente Notificaciones.
                            */

                            url:
                                "/",

                            tag:
                                alerta.clave

                        })

                }
            );


        if (
            !respuesta.ok
        ) {

            const texto =
                await respuesta.text();


            console.log(
                "Error respuesta Push:",
                respuesta.status,
                texto
            );


            return false;

        }


        const resultado =
            await respuesta.json();


        console.log(
            "Push enviado:",
            resultado
        );


        return true;

    }

    catch (error) {

        /*
        IMPORTANTE:

        Un fallo del Push NO debe impedir
        que la alerta quede guardada dentro
        de SendaPrime.
        */

        console.log(
            "No se pudo enviar Push:",
            error
        );


        return false;

    }

}


/*==================================================
SINCRONIZAR NOTIFICACIONES

historico = true
→ reconstruye las alertas anteriores
→ NO manda push al teléfono.

historico = false
→ revisa el mes actual
→ las alertas nuevas SÍ mandan Push.
==================================================*/

export async function sincronizarNotificacionesPrefectura({

    historico = false

} = {}) {

    const hoy =
        new Date();


    const anioActual =
        hoy.getFullYear();


    const mesActual =
        hoy.getMonth() + 1;


    const inicioActual =
        `${anioActual}-${String(
            mesActual
        ).padStart(2, "0")}-01`;


    /*==================================================
    CONSULTAS
    ==================================================*/

    let consultaAlumnos =
        supabase

            .from(
                "asistencia_prefectura"
            )

            .select(`
                id,
                alumno_id,
                fecha,
                estatus,
                grupo,
                created_at
            `);


    let consultaReportes =
        supabase

            .from(
                "reportes_prefectura"
            )

            .select(`
                id,
                alumno_id,
                fecha,
                tipo,
                motivo,
                created_at
            `);


    let consultaMaestros =
        supabase

            .from(
                "asistencia_maestros"
            )

            .select(`
                id,
                maestro_id,
                fecha,
                estatus,
                suplente,
                created_at
            `);


    let consultaGuardias =
        supabase

            .from(
                "guardias_maestros"
            )

            .select("*");


    /*==================================================
    SI NO ES HISTÓRICO, SOLO MES ACTUAL
    ==================================================*/

    if (!historico) {

        consultaAlumnos =
            consultaAlumnos
                .gte(
                    "fecha",
                    inicioActual
                );


        consultaReportes =
            consultaReportes
                .gte(
                    "fecha",
                    inicioActual
                );


        consultaMaestros =
            consultaMaestros
                .gte(
                    "fecha",
                    inicioActual
                );


        consultaGuardias =
            consultaGuardias
                .gte(
                    "fecha",
                    inicioActual
                );

    }


    const [

        respuestaAlumnos,

        respuestaReportes,

        respuestaMaestros,

        respuestaGuardias

    ] = await Promise.all([

        consultaAlumnos,

        consultaReportes,

        consultaMaestros,

        consultaGuardias

    ]);


    /*==================================================
    ERRORES DE CONSULTA
    ==================================================*/

    if (
        respuestaAlumnos.error
    ) {

        console.log(
            "Error asistencia alumnos:",
            respuestaAlumnos.error
        );

        return {

            creadas: 0,

            existentes: 0,

            errores: 1

        };

    }


    if (
        respuestaReportes.error
    ) {

        console.log(
            "Error reportes alumnos:",
            respuestaReportes.error
        );

        return {

            creadas: 0,

            existentes: 0,

            errores: 1

        };

    }


    if (
        respuestaMaestros.error
    ) {

        console.log(
            "Error asistencia maestros:",
            respuestaMaestros.error
        );

        return {

            creadas: 0,

            existentes: 0,

            errores: 1

        };

    }


    if (
        respuestaGuardias.error
    ) {

        console.log(
            "Error guardias maestros:",
            respuestaGuardias.error
        );

        return {

            creadas: 0,

            existentes: 0,

            errores: 1

        };

    }


    const asistenciaAlumnos =
        respuestaAlumnos.data
        || [];


    const reportesAlumnos =
        respuestaReportes.data
        || [];


    const asistenciaMaestros =
        respuestaMaestros.data
        || [];


    const guardiasMaestros =
        respuestaGuardias.data
        || [];


    const alertas = [];

    const clavesValidas =
    new Set(
        alertas.map(
            alerta => alerta.clave
        )
    );

    /*==================================================
ELIMINAR ALERTAS PENDIENTES QUE YA NO APLICAN
==================================================*/

const {
    data: pendientesActuales,
    error: errorPendientes
} = await supabase

    .from(
        "notificaciones_prefectura"
    )

    .select(`
        id,
        clave,
        mes,
        anio,
        atendida
    `)

    .eq(
        "atendida",
        false
    );


if (errorPendientes) {

    console.log(
        "Error revisando notificaciones pendientes:",
        errorPendientes
    );

}
else {

    const pendientesInvalidas =
        (pendientesActuales || [])
            .filter(
                notificacion => {

                    if (
                        !notificacion.clave
                    ) {

                        return false;

                    }


                    /*
                    Si estamos sincronizando solamente
                    el mes actual, no tocamos otros meses.
                    */

                    if (!historico) {

                        if (
                            Number(notificacion.mes)
                            !== mesActual
                            ||
                            Number(notificacion.anio)
                            !== anioActual
                        ) {

                            return false;

                        }

                    }


                    return !clavesValidas.has(
                        notificacion.clave
                    );

                }
            );


    if (
        pendientesInvalidas.length > 0
    ) {

        const idsEliminar =
            pendientesInvalidas.map(
                n => n.id
            );


        const {
            error: errorEliminar
        } = await supabase

            .from(
                "notificaciones_prefectura"
            )

            .delete()

            .in(
                "id",
                idsEliminar
            );


        if (errorEliminar) {

            console.log(
                "Error eliminando alertas corregidas:",
                errorEliminar
            );

        }
        else {

            console.log(
                "Alertas eliminadas por corrección:",
                pendientesInvalidas.length
            );

        }

    }

}


    /*==================================================
    ALUMNOS - TARDANZAS
    ==================================================*/

    const gruposTardanzas =
        agruparPorAlumnoYMes(

            asistenciaAlumnos.filter(
                registro =>
                    registro.estatus
                    === "tardanza"
            )

        );


    gruposTardanzas.forEach(
        grupo => {

            const registros =
                ordenarPorFecha(
                    grupo.registros
                );


            registros.forEach(
                (
                    registro,
                    indice
                ) => {

                    const numero =
                        indice + 1;


                    /*
                    Primera tardanza no genera alerta.
                    */

                    if (
                        numero < 2
                    ) {

                        return;

                    }


                    alertas.push({

                        clave:
                            `alumno:${grupo.alumnoId}:${grupo.anio}-${String(
                                grupo.mes
                            ).padStart(2, "0")}:tardanza:${numero}`,

                        entidad_tipo:
                            "alumno",

                        alumno_id:
                            grupo.alumnoId,

                        maestro_id:
                            null,

                        tipo:
                            numero === 2
                                ?
                                "alumno_tardanza_2"
                                :
                                "alumno_tardanza_reincidente",

                        tardanzas:
                            numero,

                        cantidad:
                            numero,

                        mes:
                            grupo.mes,

                        anio:
                            grupo.anio,

                        fecha_evento:
                            registro.fecha,

                        referencia_id:
                            registro.id
                                ?
                                String(
                                    registro.id
                                )
                                :
                                null,

                        atendida:
                            false

                    });

                }
            );

        }
    );


    /*==================================================
    ALUMNOS - AUSENCIAS
    ==================================================*/

    const gruposFaltas =
        agruparPorAlumnoYMes(

            asistenciaAlumnos.filter(
                registro =>
                    registro.estatus
                    === "falta"
            )

        );


    /*
    Aquí almacenamos la fecha en la
    que alcanzó su segunda ausencia.
    */

    const reincidenciaPorAlumnoMes =
        {};


    gruposFaltas.forEach(
        grupo => {

            const registros =
                ordenarPorFecha(
                    grupo.registros
                );


            if (
                registros.length >= 2
            ) {

                const clavePeriodo =
                    `${grupo.alumnoId}:${grupo.anio}-${grupo.mes}`;


                reincidenciaPorAlumnoMes[
                    clavePeriodo
                ] =
                    registros[1].fecha;

            }


            registros.forEach(
                (
                    registro,
                    indice
                ) => {

                    const numero =
                        indice + 1;


                    /*
                    Primera falta no genera alerta.
                    */

                    if (
                        numero < 2
                    ) {

                        return;

                    }


                    alertas.push({

                        clave:
                            `alumno:${grupo.alumnoId}:${grupo.anio}-${String(
                                grupo.mes
                            ).padStart(2, "0")}:falta:${numero}`,

                        entidad_tipo:
                            "alumno",

                        alumno_id:
                            grupo.alumnoId,

                        maestro_id:
                            null,

                        tipo:
                            numero === 2
                                ?
                                "alumno_ausencia_2"
                                :
                                "alumno_ausencia_reincidente",

                        tardanzas:
                            null,

                        cantidad:
                            numero,

                        mes:
                            grupo.mes,

                        anio:
                            grupo.anio,

                        fecha_evento:
                            registro.fecha,

                        referencia_id:
                            registro.id
                                ?
                                String(
                                    registro.id
                                )
                                :
                                null,

                        atendida:
                            false

                    });

                }
            );

        }
    );


    /*==================================================
    REPORTES DE ALUMNOS REINCIDENTES

    Si ya llegó a 2 ausencias y posteriormente
    recibe reporte en el mismo mes, alertamos.
    ==================================================*/

    reportesAlumnos.forEach(
        reporte => {

            if (
                !reporte.alumno_id
                ||
                !reporte.fecha
            ) {

                return;

            }


            const periodo =
                obtenerMesAnio(
                    reporte.fecha
                );


            if (!periodo) {

                return;

            }


            const clavePeriodo =
                `${reporte.alumno_id}:${periodo.anio}-${periodo.mes}`;


            const fechaReincidencia =
                reincidenciaPorAlumnoMes[
                    clavePeriodo
                ];


            if (
                !fechaReincidencia
            ) {

                return;

            }


            /*
            Solo reportes posteriores a convertirse
            en reincidente.
            */

            if (
                reporte.fecha
                <
                fechaReincidencia
            ) {

                return;

            }


            alertas.push({

                clave:
                    `alumno:${reporte.alumno_id}:${periodo.anio}-${String(
                        periodo.mes
                    ).padStart(2, "0")}:reporte:${reporte.id}`,

                entidad_tipo:
                    "alumno",

                alumno_id:
                    reporte.alumno_id,

                maestro_id:
                    null,

                tipo:
                    "alumno_reincidente_reporte",

                tardanzas:
                    null,

                cantidad:
                    null,

                mes:
                    periodo.mes,

                anio:
                    periodo.anio,

                fecha_evento:
                    reporte.fecha,

                referencia_id:
                    reporte.id
                        ?
                        String(
                            reporte.id
                        )
                        :
                        null,

                atendida:
                    false

            });

        }
    );


    /*==================================================
    MAESTROS - FALTAS
    ==================================================*/

    const gruposFaltasMaestros =
        agruparPorMaestroYMes(

            asistenciaMaestros.filter(
                registro =>
                    registro.estatus
                    === "falta"
            )

        );


    gruposFaltasMaestros.forEach(
        grupo => {

            const registros =
                ordenarPorFecha(
                    grupo.registros
                );


            registros.forEach(
                (
                    registro,
                    indice
                ) => {

                    const numero =
                        indice + 1;


                    if (
                        numero < 2
                    ) {

                        return;

                    }


                    alertas.push({

                        clave:
                            `maestro:${grupo.maestroId}:${grupo.anio}-${String(
                                grupo.mes
                            ).padStart(2, "0")}:falta:${numero}`,

                        entidad_tipo:
                            "maestro",

                        alumno_id:
                            null,

                        maestro_id:
                            String(
                                grupo.maestroId
                            ),

                        tipo:
                            numero === 2
                                ?
                                "maestro_falta_2"
                                :
                                "maestro_falta_reincidente",

                        tardanzas:
                            null,

                        cantidad:
                            numero,

                        mes:
                            grupo.mes,

                        anio:
                            grupo.anio,

                        fecha_evento:
                            registro.fecha,

                        referencia_id:
                            registro.id
                                ?
                                String(
                                    registro.id
                                )
                                :
                                null,

                        atendida:
                            false

                    });

                }
            );

        }
    );


    /*==================================================
    DÍAS EN QUE EL MAESTRO FALTÓ

    Sirve para que una guardia no cumplida
    NO cuente si ese día estaba ausente.
    ==================================================*/

    const diasFaltaMaestro =
        new Set();


    asistenciaMaestros.forEach(
        registro => {

            if (
                registro.estatus
                !== "falta"
            ) {

                return;

            }


            diasFaltaMaestro.add(

                `${registro.maestro_id}:${registro.fecha}`

            );

        }
    );


    /*==================================================
    GUARDIA DE RECREO
    ==================================================*/

    const faltasRecreo =
        guardiasMaestros.filter(
            guardia => {

                if (
                    guardia.guardia_recreo
                    !== false
                ) {

                    return false;

                }


                /*
                Si el maestro faltó ese día,
                no contabilizamos la guardia.
                */

                return !diasFaltaMaestro.has(

                    `${guardia.maestro_id}:${guardia.fecha}`

                );

            }
        );


    const gruposRecreo =
        agruparPorMaestroYMes(
            faltasRecreo
        );


    gruposRecreo.forEach(
        grupo => {

            const registros =
                ordenarPorFecha(
                    grupo.registros
                );


            registros.forEach(
                (
                    registro,
                    indice
                ) => {

                    const numero =
                        indice + 1;


                    if (
                        numero < 2
                    ) {

                        return;

                    }


                    alertas.push({

                        clave:
                            `maestro:${grupo.maestroId}:${grupo.anio}-${String(
                                grupo.mes
                            ).padStart(2, "0")}:recreo:${numero}`,

                        entidad_tipo:
                            "maestro",

                        alumno_id:
                            null,

                        maestro_id:
                            String(
                                grupo.maestroId
                            ),

                        tipo:
                            numero === 2
                                ?
                                "maestro_recreo_2"
                                :
                                "maestro_recreo_reincidente",

                        tardanzas:
                            null,

                        cantidad:
                            numero,

                        mes:
                            grupo.mes,

                        anio:
                            grupo.anio,

                        fecha_evento:
                            registro.fecha,

                        referencia_id:
                            registro.id
                                ?
                                String(
                                    registro.id
                                )
                                :
                                null,

                        atendida:
                            false

                    });

                }
            );

        }
    );


    /*==================================================
    GUARDIA DE SALIDA
    ==================================================*/

    const faltasSalida =
        guardiasMaestros.filter(
            guardia => {

                if (
                    guardia.guardia_salida
                    !== false
                ) {

                    return false;

                }


                /*
                Si faltó ese día, no se contabiliza.
                */

                return !diasFaltaMaestro.has(

                    `${guardia.maestro_id}:${guardia.fecha}`

                );

            }
        );


    const gruposSalida =
        agruparPorMaestroYMes(
            faltasSalida
        );


    gruposSalida.forEach(
        grupo => {

            const registros =
                ordenarPorFecha(
                    grupo.registros
                );


            registros.forEach(
                (
                    registro,
                    indice
                ) => {

                    const numero =
                        indice + 1;


                    if (
                        numero < 2
                    ) {

                        return;

                    }


                    alertas.push({

                        clave:
                            `maestro:${grupo.maestroId}:${grupo.anio}-${String(
                                grupo.mes
                            ).padStart(2, "0")}:salida:${numero}`,

                        entidad_tipo:
                            "maestro",

                        alumno_id:
                            null,

                        maestro_id:
                            String(
                                grupo.maestroId
                            ),

                        tipo:
                            numero === 2
                                ?
                                "maestro_salida_2"
                                :
                                "maestro_salida_reincidente",

                        tardanzas:
                            null,

                        cantidad:
                            numero,

                        mes:
                            grupo.mes,

                        anio:
                            grupo.anio,

                        fecha_evento:
                            registro.fecha,

                        referencia_id:
                            registro.id
                                ?
                                String(
                                    registro.id
                                )
                                :
                                null,

                        atendida:
                            false

                    });

                }
            );

        }
    );


    /*==================================================
    SIN ALERTAS
    ==================================================*/

    if (
        alertas.length === 0
    ) {

        console.log(
            "No hay alertas para sincronizar."
        );


        return {

            creadas:
                0,

            existentes:
                0,

            errores:
                0

        };

    }


    console.log(
        "Alertas encontradas:",
        alertas.length
    );


    /*==================================================
    GUARDAR UNA POR UNA

    Importante:

    No usamos un upsert masivo.

    Así una alerta problemática no impide
    guardar las demás.
    ==================================================*/

    let creadas = 0;

    let existentes = 0;

    let errores = 0;

    let pushesEnviados = 0;


    for (
        const alerta
        of alertas
    ) {

        /*==============================================
        COMPROBAR SI YA EXISTE
        ==============================================*/

        const {
            data: existente,
            error: errorBuscar
        } = await supabase

            .from(
                "notificaciones_prefectura"
            )

            .select("id")

            .eq(
                "clave",
                alerta.clave
            )

            .maybeSingle();


        if (errorBuscar) {

            console.log(
                "Error buscando alerta:",
                alerta.clave,
                errorBuscar
            );


            errores++;


            continue;

        }


        /*
        Si ya existe NO hacemos nada.

        Esto impide:
        - duplicar historial
        - duplicar badge
        - mandar Push varias veces
        */

        if (existente) {

            existentes++;


            continue;

        }


        /*==============================================
        INSERTAR ALERTA NUEVA
        ==============================================*/

        const {
            data: creada,
            error: errorInsertar
        } = await supabase

            .from(
                "notificaciones_prefectura"
            )

            .insert(
                alerta
            )

            .select("id")

            .single();


        if (errorInsertar) {

            console.log(
                "Error creando alerta:",
                alerta.clave,
                errorInsertar
            );


            errores++;


            continue;

        }


        creadas++;


        console.log(
            "Nueva alerta creada:",
            alerta.clave,
            creada?.id
        );


        /*==============================================
        PUSH

        NO enviamos Push durante reconstrucción histórica.

        De esta forma al activar el sistema por primera vez
        no llegan de golpe las notificaciones antiguas.
        ==============================================*/

        if (!historico) {

            const enviado =
                await enviarPush(
                    alerta
                );


            if (enviado) {

                pushesEnviados++;

            }

        }

    }


    /*==================================================
    RESULTADO
    ==================================================*/

    const resultado = {

        creadas,

        existentes,

        errores,

        pushesEnviados

    };


    console.log(
        "Sincronización terminada:",
        resultado
    );


    return resultado;

}