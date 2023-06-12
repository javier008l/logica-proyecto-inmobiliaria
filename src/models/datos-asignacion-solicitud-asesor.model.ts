import {Entity, model, property} from '@loopback/repository';

@model()
export class DatosAsignacionSolicitudAsesor extends Entity {
  @property({
    type: 'number',
    required: true,
  })
  solicitudId: number;

  @property({
    type: 'number',
    required: true,
  })
  asesorActualId: number;

  @property({
    type: 'number',
    required: true,
  })
  asesorNuevoId: number;


  constructor(data?: Partial<DatosAsignacionSolicitudAsesor>) {
    super(data);
  }
}

export interface DatosAsignacionSolicitudAsesorRelations {
  // describe navigational properties here
}

export type DatosAsignacionSolicitudAsesorWithRelations = DatosAsignacionSolicitudAsesor & DatosAsignacionSolicitudAsesorRelations;
