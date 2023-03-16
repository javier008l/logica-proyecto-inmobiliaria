import {Entity, model, property} from '@loopback/repository';

@model()
export class Contrato extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  duracion: string;

  @property({
    type: 'string',
  })
  descripcionInmueble?: string;


  constructor(data?: Partial<Contrato>) {
    super(data);
  }
}

export interface ContratoRelations {
  // describe navigational properties here
}

export type ContratoWithRelations = Contrato & ContratoRelations;
