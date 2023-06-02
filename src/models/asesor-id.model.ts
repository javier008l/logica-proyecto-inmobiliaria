import {Entity, model, property} from '@loopback/repository';

@model()
export class AsesorId extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  correoAsesor: string;


  constructor(data?: Partial<AsesorId>) {
    super(data);
  }
}

export interface AsesorIdRelations {
  // describe navigational properties here
}

export type AsesorIdWithRelations = AsesorId & AsesorIdRelations;
