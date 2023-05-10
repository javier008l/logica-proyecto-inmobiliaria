import {Entity, hasMany, model, property} from '@loopback/repository';
import {Inmueble} from './inmueble.model';
import {Solicitud} from './solicitud.model';

@model()
export class TipoInmueble extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true
  })
  nuevoTipoInmueble: string;

  @hasMany(() => Solicitud)
  solicitudes: Solicitud[];

  @hasMany(() => Inmueble)
  inmuebles: Inmueble[];

  constructor(data?: Partial<TipoInmueble>) {
    super(data);
  }
}

export interface TipoInmuebleRelations {
  // describe navigational properties here
}

export type TipoInmuebleWithRelations = TipoInmueble & TipoInmuebleRelations;
