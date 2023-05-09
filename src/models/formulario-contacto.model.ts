import {Entity , model, property} from '@loopback/repository';

@model()
export class FormularioContacto extends Entity {
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
    required: true,
  })
  celular: string;

  @property({
    type: 'string',
    required: true,
  })
  tipoMensaje: string;

  @property({
    type: 'string',
    required: true,
  })
  mensaje: string;

  @property({
    type: 'string',
    required: true,
  })
  direccionInmueble: string;

  @property({
    type: 'number',
    required: true,
  })
  costo: number;

  @property({
    type: 'boolean',
    required: true,
  })
  paraAlquiler: boolean;

  @property({
    type: 'boolean',
    required: true,
  })
  paraVenta: boolean;


  constructor(data?: Partial<FormularioContacto>) {
    super(data);
  }
}

export interface FormularioContactoRelations {
  // describe navigational properties here
}

export type FormularioContactoWithRelations = FormularioContacto & FormularioContactoRelations;
