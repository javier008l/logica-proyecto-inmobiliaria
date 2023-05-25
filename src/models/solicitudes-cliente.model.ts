import {Entity, model, property} from '@loopback/repository';

@model()
export class SolicitudesCliente extends Entity {
  @property({
    type: 'number',
    required: true,
  })
  idCliente: number;


  constructor(data?: Partial<SolicitudesCliente>) {
    super(data);
  }
}

export interface SolicitudesClienteRelations {
  // describe navigational properties here
}

export type SolicitudesClienteWithRelations = SolicitudesCliente & SolicitudesClienteRelations;
