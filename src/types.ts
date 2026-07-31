export type NEE = {

    nivel?: string | null;

    diagnostico?: string | null;

    observaciones?: string | null;

};

export type Cita = {

    id?: number;

    alumno_id?: number;

    fecha?: string |null;

    tipo?: string | null;

    motivo?: string | null;

    acuerdos?: string | null;

    intervencion?: string | null;

    observaciones?: string | null;

};

export type Alumno = {

    id:number;

    nombre:string;

    apellido_paterno?:string|null;

    apellido_materno?:string|null;

    sexo?:string|null;

    grupo?:string|null;

    saldo?:number|null;

    expediente_pdf?:string|null;

    nee?:NEE[]|null;

    citas?:Cita[]|null;

};

export type Nota={

    id?:number;

    alumno_id?:number;

    titulo?:string|null;

    contenido?:string|null;

};

export type ContextoAlumno={

    alumno:Alumno;

    notas:Nota[];

    citas:Cita[];

};