import {Model, model, property} from '@loopback/repository';

@model()
export class FormularioContacto extends Model {
  @property({
    type: 'string',
    required: true,
  })
  mensaje: string;

  @property({
    type: 'string',
    required: true,
  })
  tipoMensaje: string;

  @property({
    type: 'string',
    required: true,
  })
  nombreCompleto: string;

  @property({
    type: 'string',
    required: true,
  })
  correo: string;

  @property({
    type: 'string',
  })
  celular?: string;


  constructor(data?: Partial<FormularioContacto>) {
    super(data);
  }
}

export interface FormularioContactoRelations {
  // describe navigational properties here
}

export type FormularioContactoWithRelations = FormularioContacto & FormularioContactoRelations;
