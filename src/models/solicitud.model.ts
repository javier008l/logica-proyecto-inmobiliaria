import {Entity, model, property, hasMany, belongsTo} from '@loopback/repository';
import {Estado} from './estado.model';
import {Cliente} from './cliente.model';
import {Asesor} from './asesor.model';
import {Codeudor} from './codeudor.model';
import {TipoSolicitud} from './tipo-solicitud.model';
import {TipoInmueble} from './tipo-inmueble.model';

@model()
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
  @hasMany(() => Estado)
  estados: Estado[];

  @belongsTo(() => Cliente)
  clienteId: number;

  @belongsTo(() => Asesor)
  asesorId: number;

  @belongsTo(() => Codeudor)
  codeudorId: number;

  @belongsTo(() => TipoSolicitud)
  tipoSolicitudId: number;

  @belongsTo(() => TipoInmueble)
  tipoInmuebleId: number;

  constructor(data?: Partial<Solicitud>) {
    super(data);
  }
}

export interface SolicitudRelations {
  // describe navigational properties here
}

export type SolicitudWithRelations = Solicitud & SolicitudRelations;
