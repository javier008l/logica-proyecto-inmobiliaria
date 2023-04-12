import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Ciudad} from './ciudad.model';
import {TipoInmueble} from './tipo-inmueble.model';

@model({
  settings: {
    foreignKeys: {
      fk_inmueble_tipo_inmueble_idTipoInmueble: {
        name: 'fk_inmueble_tipo_inmueble_idTipoInmueble',
        entity: 'TipoInmueble',
        entityKey: 'id',
        foreignKey: 'tipoInmuebleId',
      },
      fk_inmueble_idCiudad: {
        name: 'fk_inmueble_idCiudad',
        entity: 'Ciudad',
        entityKey: 'id',
        foreignKey: 'ciudadId',
      },
    },
  },
})
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
    type: 'boolean',
    required: false,
    default: false
  })
  paraVenta: boolean;


  @property({
    type: 'boolean',
    required: false,
    default: false
  })
  paraAlquiler: boolean;

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
