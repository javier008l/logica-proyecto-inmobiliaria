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
    type: 'boolean',

  })
  casa?: boolean;

  @property({
    type: 'boolean',
  })
  apartamento?: boolean;

  @property({
    type: 'boolean',
  })
  finca?: boolean;

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
