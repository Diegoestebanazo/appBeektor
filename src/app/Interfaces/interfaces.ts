export interface Hive {
    _id: string | null;
    nombre: string;
    observacion: string;
    produccion: string;
    estado: boolean;
    fecha: Date;
    solicitud: boolean;
}

export interface HiveSensor {
    colmena: string;
    humedad: string;
    temperatura: string;
    __v: number;
    _id: string;
}