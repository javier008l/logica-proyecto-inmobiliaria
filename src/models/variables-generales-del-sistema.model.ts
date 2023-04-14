import {Entity, model, property} from '@loopback/repository';

@model()
export class VariablesGeneralesDelSistema extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
    required: true,
  })
  porcentajeGanacia: number;

  @property({
    type: 'string',
    required: true,
  })
  nombreInmobiliaria: string;

  @property({
    type: 'string',
    required: true,
  })
  correoContactoAdministrador: string;

  @property({
    type: 'string',
    required: true,
  })
  nombreContactoAdministrador: string;


  constructor(data?: Partial<VariablesGeneralesDelSistema>) {
    super(data);
  }
}

export interface VariablesGeneralesDelSistemaRelations {
  // describe navigational properties here
}

export type VariablesGeneralesDelSistemaWithRelations = VariablesGeneralesDelSistema & VariablesGeneralesDelSistemaRelations;
