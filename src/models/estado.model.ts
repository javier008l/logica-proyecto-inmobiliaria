import {
  Entity,
  hasMany,
  model,
  property
} from '@loopback/repository';
import {Contrato} from './contrato.model';

@model(
  //   {
  //   settings: {
  //     foreignKeys: {
  //       fk_estado_idSolicitud: {
  //         name: 'fk_estado_idSolicitud',
  //         entity: 'Solicitud',
  //         entityKey: 'id',
  //         foreignKey: 'solicitudId',
  //       },
  //     },
  //   },
  // }
)
export class Estado extends Entity {
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
  nombre: string;

  // @property({
  //   type: 'boolean',
  //   required: true,
  // })
  // enviado: boolean;

  // @property({
  //   type: 'boolean',
  //   required: true,
  // })
  // esEstudio: boolean;

  // @property({
  //   type: 'boolean',
  //   required: true,
  // })
  // aceptado: boolean;

  // @property({
  //   type: 'boolean',
  //   required: true,
  // })
  // aceptadoConCodeudor: boolean;

  // @property({
  //   type: 'boolean',
  //   required: true,
  // })
  // rechazado: boolean;
  @hasMany(() => Contrato)
  contratos: Contrato[];

  // @belongsTo(() => Solicitud)
  // solicitudId: number;

  constructor(data?: Partial<Estado>) {
    super(data);
  }
}

export interface EstadoRelations {
  // describe navigational properties here
}

export type EstadoWithRelations = Estado & EstadoRelations;
