export function obtenerFechaLocal() {

    return new Intl.DateTimeFormat(
        "en-CA",
        {
            timeZone: "America/Hermosillo"
        }
    ).format(new Date());

}