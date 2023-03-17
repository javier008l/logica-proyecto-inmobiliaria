import {Entity, model, property, hasMany, belongsTo} from '@loopback/repository';
import {Inmueble} from './inmueble.model';
import {Departamento} from './departamento.model';

@model()
export class Ciudad extends Entity {
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
  @hasMany(() => Inmueble)
  inmuebles: Inmueble[];

  @belongsTo(() => Departamento)
  departamentoId: number;

  constructor(data?: Partial<Ciudad>) {
    super(data);
  }
}

export interface CiudadRelations {
  // describe navigational properties here
}

export type CiudadWithRelations = Ciudad & CiudadRelations;
