import {Model, model, property} from '@loopback/repository';

@model()
export class DatosAsignacionInmuebleAsesor extends Model {
  @property({
    type: 'number',
    required: true,
  })
  idAsesor: number;

  @property({
    type: 'number',
    required: true,
  })
  idInmueble: number;


  constructor(data?: Partial<DatosAsignacionInmuebleAsesor>) {
    super(data);
  }
}

export interface DatosAsignacionInmuebleAsesorRelations {
  // describe navigational properties here
}

export type DatosAsignacionInmuebleAsesorWithRelations = DatosAsignacionInmuebleAsesor & DatosAsignacionInmuebleAsesorRelations;
