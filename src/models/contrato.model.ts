import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Cliente} from './cliente.model';
import {Estado} from './estado.model';

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
  @belongsTo(() => Cliente)
  clienteId: number;

  @belongsTo(() => Estado)
  estadoId: number;

  constructor(data?: Partial<Contrato>) {
    super(data);
  }
}

export interface ContratoRelations {
  // describe navigational properties here
}

export type ContratoWithRelations = Contrato & ContratoRelations;
