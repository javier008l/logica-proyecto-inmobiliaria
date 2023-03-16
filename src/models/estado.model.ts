import {Entity, model, property} from '@loopback/repository';

@model()
export class Estado extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'boolean',
    required: true,
  })
  enviado: boolean;

  @property({
    type: 'boolean',
    required: true,
  })
  esEstudio: boolean;

  @property({
    type: 'boolean',
    required: true,
  })
  aceptado: boolean;

  @property({
    type: 'boolean',
    required: true,
  })
  aceptadoConCodeudor: boolean;

  @property({
    type: 'boolean',
    required: true,
  })
  rechazado: boolean;


  constructor(data?: Partial<Estado>) {
    super(data);
  }
}

export interface EstadoRelations {
  // describe navigational properties here
}

export type EstadoWithRelations = Estado & EstadoRelations;
