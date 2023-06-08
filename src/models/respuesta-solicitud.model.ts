import {Model, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class RespuestaSolicitud extends Model {
  @property({
    type: 'number',
    required: true,
  })
  solicitudId: number;

  @property({
    type: 'number',
    required: true,
  })
  estadoSolicitudId: number;

  @property({
    type: 'string',
    required: false,
  })
  motivoRechazo: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<RespuestaSolicitud>) {
    super(data);
  }
}

export interface RespuestaSolicitudRelations {
  // describe navigational properties here
}

export type RespuestaSolicitudWithRelations = RespuestaSolicitud & RespuestaSolicitudRelations;
