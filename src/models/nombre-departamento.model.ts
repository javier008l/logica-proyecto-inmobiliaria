import {Entity, model, property} from '@loopback/repository';

@model()
export class NombreDepartamento extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  nombreDepartamento: string;


  constructor(data?: Partial<NombreDepartamento>) {
    super(data);
  }
}

export interface NombreDepartamentoRelations {
  // describe navigational properties here
}

export type NombreDepartamentoWithRelations = NombreDepartamento & NombreDepartamentoRelations;
