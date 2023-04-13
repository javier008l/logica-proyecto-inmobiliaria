import {Model, model, property} from '@loopback/repository';

@model()
export class MensajeContacto extends Model {
  @property({
    type: 'string',
    required: true,
  })
  mensaje: string;

  @property({
    type: 'string',
    required: true,
  })
  nombre: string;

  @property({
    type: 'string',
    required: true,
  })
  celular: string;

  @property({
    type: 'string',
    required: true,
  })
  correo: string;

  @property({
    type: 'string',
    required: true,
  })
  tipoDeMensaje: string;


  constructor(data?: Partial<MensajeContacto>) {
    super(data);
  }
}

export interface MensajeContactoRelations {
  // describe navigational properties here
}

export type MensajeContactoWithRelations = MensajeContacto & MensajeContactoRelations;
