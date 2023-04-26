import {Model, model, property} from '@loopback/repository';

@model()
export class FormularioAsesor extends Model {
  @property({
    type: 'string',
    required: true,
  })
  nombreCompleto: string;

  @property({
    type: 'string',
    required: true,
  })
  apellidoCompleto: string;

  @property({
    type: 'string',
    required: true,
  })
  cedula: string;

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
  direccion: string;


  constructor(data?: Partial<FormularioAsesor>) {
    super(data);
  }
}

export interface FormularioAsesorRelations {
  // describe navigational properties here
}

export type FormularioAsesorWithRelations = FormularioAsesor & FormularioAsesorRelations;
