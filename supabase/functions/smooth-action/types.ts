export type Alumno = {
    id: number;

    nombre: string;

    apellido_paterno?: string | null;

    apellido_materno?: string | null;

    sexo?: string | null;

    grupo?: string | null;

    expediente_pdf?: string | null;

    nee?: unknown;

    nee_observaciones?: string | null;

    citas?: unknown;
};


export type Nota = {
    id?: number;

    alumno_id?: number;

    created_at?: string | null;

    titulo?: string | null;

    contenido?: string | null;

    texto?: string | null;

    tipo?: string | null;

    [key: string]: unknown;
};


export type Cita = {
    id?: number;

    alumno_id?: number;

    fecha?: string | null;

    tipo?: string | null;

    motivo?: string | null;

    observaciones?: string | null;

    [key: string]: unknown;
};


export type ContextoAlumno = {

    alumno: Alumno;

    notas: Nota[];

    citas: Cita[];

    expediente: unknown[];

};


export type Emociones = {

    ansiedad: number;

    tristeza: number;

    enojo: number;

    miedo: number;

    autoestima: number;

    frustracion: number;

    alegria: number;

};