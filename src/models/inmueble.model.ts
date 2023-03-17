import {Entity, model, property, belongsTo} from '@loopback/repository';
import {TipoInmueble} from './tipo-inmueble.model';
import {Ciudad} from './ciudad.model';

@model()
export class Inmueble extends Entity {
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
  direccion: string;

  @property({
    type: 'number',
    required: true,
  })
  costo: number;

  @property({
    type: 'string',
  })
  foto?: string;
  @belongsTo(() => TipoInmueble)
  tipoInmuebleId: number;

  @belongsTo(() => Ciudad)
  ciudadId: number;

  constructor(data?: Partial<Inmueble>) {
    super(data);
  }
}

export interface InmuebleRelations {
  // describe navigational properties here
}

export type InmuebleWithRelations = Inmueble & InmuebleRelations;
