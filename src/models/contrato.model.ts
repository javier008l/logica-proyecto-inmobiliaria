import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Cliente} from './cliente.model';
import {Estado} from './estado.model';

@model({
  settings: {
    foreignKeys: {
      fk_contrato_idCliente: {
        name: 'fk_contrato_idCliente',
        entity: 'Cliente',
        entityKey: 'id',
        foreignKey: 'clienteId',
      },
      fk_contrato_idEstado: {
        name: 'fk_contrato_idEstado',
        entity: 'Estado',
        entityKey: 'id',
        foreignKey: 'estadoId',
      },
    },
  },
})
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
