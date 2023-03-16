import {Entity, model, property} from '@loopback/repository';

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
  })
  casa?: string;

  @property({
    type: 'string',
  })
  apartamento?: string;

  @property({
    type: 'string',
  })
  finca?: string;


  constructor(data?: Partial<TipoInmueble>) {
    super(data);
  }
}

export interface TipoInmuebleRelations {
  // describe navigational properties here
}

export type TipoInmuebleWithRelations = TipoInmueble & TipoInmuebleRelations;
