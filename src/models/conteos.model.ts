import {Model, model, property} from '@loopback/repository';

@model()
export class Conteos extends Model {
  @property({
    type: 'string',
    required: true,
  })
  nombre: string;


  constructor(data?: Partial<Conteos>) {
    super(data);
  }
}

export interface ConteosRelations {
  // describe navigational properties here
}

export type ConteosWithRelations = Conteos & ConteosRelations;
