import {Entity, model, property} from '@loopback/repository';

@model()
export class SolicitudesCliente extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  correoCliente: string;


  constructor(data?: Partial<SolicitudesCliente>) {
    super(data);
  }
}

export interface SolicitudesClienteRelations {
  // describe navigational properties here
}

export type SolicitudesClienteWithRelations = SolicitudesCliente & SolicitudesClienteRelations;
