import {Model, model, property} from '@loopback/repository';

@model()
export class ContactoCliente extends Model {
  @property({
    type: 'string',
    required: true,
  })
  correoCliente: string;

  @property({
    type: 'string',
    required: true,
  })
  correoAsesor: string;

  @property({
    type: 'string',
    required: true,
  })
  asuntoCorreo: string;

  @property({
    type: 'string',
    required: true,
  })
  motivoMensaje: string;


  constructor(data?: Partial<ContactoCliente>) {
    super(data);
  }
}

export interface ContactoClienteRelations {
  // describe navigational properties here
}

export type ContactoClienteWithRelations = ContactoCliente & ContactoClienteRelations;
