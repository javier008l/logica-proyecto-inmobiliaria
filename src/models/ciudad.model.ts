import {
  belongsTo,
  Entity,
  hasMany,
  model,
  property,
} from '@loopback/repository';
import {Departamento} from './departamento.model';
import {Inmueble} from './inmueble.model';

@model({
  settings: {
    foreignKeys: {
      fk_ciudad_idDepartamento: {
        name: 'fk_ciudad_idDepartamento',
        entity: 'Departamento',
        entityKey: 'id',
        foreignKey: 'departamentoId',
      },
    },
  },
})
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
