import {Entity , model, property} from '@loopback/repository';

@model()
export class FormularioContacto extends Entity {

  @property({
    type: 'string',
    required: true,
  })
  asunto: string;

  @property({
    type: 'string',
    required: true,
  })
  correo: string;

  @property({
    type: 'string',
    required: true,
  })
  tipo: string;

  @property({
    type: 'string',
    required: true,
  })
  contenido: string;

  @property({
    type: 'string',
    required: true,
  })
  direccion: string;

  @property({
    type: 'string',
  })
  ventaAlquiler?: string;

  constructor(data?: Partial<FormularioContacto>) {
    super(data);
  }
}

export interface FormularioContactoRelations {
  // describe navigational properties here
}

export type FormularioContactoWithRelations = FormularioContacto & FormularioContactoRelations;
