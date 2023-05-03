import {Entity, belongsTo, hasMany, model, property} from '@loopback/repository';
import {Inmueble} from './inmueble.model';
import {Solicitud} from './solicitud.model';

@model({
  settings: {
    foreignKeys: {
      fk_asesor_idInmueble: {
        name: 'fk_asesor_idInmueble',
        entity: 'Inmueble',
        entityKey: 'id',
        foreignKey: 'inmuebleId',
      },
    }
  }
})
export class Asesor extends Entity {
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
  primerNombre: string;

  @property({
    type: 'string',
  })
  segundoNombre?: string;

  @property({
    type: 'string',
    required: true,
  })
  primerApellido: string;

  @property({
    type: 'string',
  })
  segundoApellido?: string;

  @property({
    type: 'string',
    required: true,
  })
  cedula: string;

  @property({
    type: 'string',
    required: true,
  })
  correo: string;

  @property({
    type: 'string',
    required: true,
  })
  telefono: string;

  @property({
    type: 'string',
    required: true,
  })
  direccion: string;

  @hasMany(() => Solicitud)
  solicitudes: Solicitud[];

  @belongsTo(() => Inmueble)
  inmuebleId: number;

  constructor(data?: Partial<Asesor>) {
    super(data);
  }
}

export interface AsesorRelations {
  // describe navigational properties here
}

export type AsesorWithRelations = Asesor & AsesorRelations;
