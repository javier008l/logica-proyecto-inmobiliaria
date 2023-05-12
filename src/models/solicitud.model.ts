import {
  belongsTo,
  Entity,
  model,
  property
} from '@loopback/repository';
import {Asesor} from './asesor.model';
import {Cliente} from './cliente.model';
import {Codeudor} from './codeudor.model';
import {Estado} from './estado.model';
import {Inmueble} from './inmueble.model';
import {TipoInmueble} from './tipo-inmueble.model';
import {TipoSolicitud} from './tipo-solicitud.model';

@model({
  settings: {
    foreignKeys: {
      fk_solicitud_idCliente: {
        name: 'fk_solicitud_idCliente',
        entity: 'Cliente',
        entityKey: 'id',
        foreignKey: 'clienteId',
      },
      fk_solicitud_idAsesor: {
        name: 'fk_solicitud_idAsesor',
        entity: 'Asesor',
        entityKey: 'id',
        foreignKey: 'asesorId',
      },
      fk_solicitud_idCodeudor: {
        name: 'fk_solicitud_idCodeudor',
        entity: 'Codeudor',
        entityKey: 'id',
        foreignKey: 'codeudorId',
      },
      fk_solicitud_tipo_solicitud_idTipoSolicitud: {
        name: 'fk_solicitud_tipo_solicitud_idTipoSolicitud',
        entity: 'TipoSolicitud',
        entityKey: 'id',
        foreignKey: 'tipoSolicitudId',
      },
      fk_solicitud_tipo_inmueble_idTipoInmueble: {
        name: 'fk_solicitud_tipo_inmueble_idTipoInmueble',
        entity: 'TipoInmueble',
        entityKey: 'id',
        foreignKey: 'tipoInmuebleId',
      },
      fk_solicitud_inmueble_idInmueble: {
        name: 'fk_solicitud_inmueble_idInmueble',
        entity: 'Inmueble',
        entityKey: 'id',
        foreignKey: 'inmuebleId',
      },
      fk_solicitud_estado_idEstado: {
        name: 'fk_solicitud_estado_idEstado',
        entity: 'Estado',
        entityKey: 'id',
        foreignKey: 'estadoId',
      },
    },
  },
})
export class Solicitud extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'date',
    required: true,
  })
  fechaSolicitud: string;
  // @hasMany(() => Estado)
  // estados: Estado[];

  @belongsTo(() => Cliente)
  clienteId: number;

  @belongsTo(() => Asesor)
  asesorId: number;

  @belongsTo(() => Codeudor)
  codeudorId: number;

  @belongsTo(() => TipoSolicitud)
  tipoSolicitudId: number;

  @belongsTo(() => Estado)
  estadoId: number;

  @belongsTo(() => TipoInmueble)
  tipoInmuebleId: number;

  @belongsTo(() => Inmueble)
  inmuebleId: number;

  constructor(data?: Partial<Solicitud>) {
    super(data);
  }
}

export interface SolicitudRelations {
  // describe navigational properties here
}

export type SolicitudWithRelations = Solicitud & SolicitudRelations;
