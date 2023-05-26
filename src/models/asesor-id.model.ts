import {Entity, model, property} from '@loopback/repository';

@model()
export class AsesorId extends Entity {
  @property({
    type: 'number',
    required: true,
  })
  idAsesor: number;


  constructor(data?: Partial<AsesorId>) {
    super(data);
  }
}

export interface AsesorIdRelations {
  // describe navigational properties here
}

export type AsesorIdWithRelations = AsesorId & AsesorIdRelations;
