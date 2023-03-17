import {Entity, model, property, hasMany, belongsTo} from '@loopback/repository';
import {Contrato} from './contrato.model';
import {Solicitud} from './solicitud.model';

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
  @hasMany(() => Contrato)
  contratos: Contrato[];

  @belongsTo(() => Solicitud)
  solicitudId: number;

  constructor(data?: Partial<Estado>) {
    super(data);
  }
}

export interface EstadoRelations {
  // describe navigational properties here
}

export type EstadoWithRelations = Estado & EstadoRelations;
