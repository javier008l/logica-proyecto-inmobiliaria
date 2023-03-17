import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  TipoInmueble,
  Solicitud,
} from '../models';
import {TipoInmuebleRepository} from '../repositories';

export class TipoInmuebleSolicitudController {
  constructor(
    @repository(TipoInmuebleRepository) protected tipoInmuebleRepository: TipoInmuebleRepository,
  ) { }

  @get('/tipo-inmuebles/{id}/solicituds', {
    responses: {
      '200': {
        description: 'Array of TipoInmueble has many Solicitud',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Solicitud)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Solicitud>,
  ): Promise<Solicitud[]> {
    return this.tipoInmuebleRepository.solicitudes(id).find(filter);
  }

  @post('/tipo-inmuebles/{id}/solicituds', {
    responses: {
      '200': {
        description: 'TipoInmueble model instance',
        content: {'application/json': {schema: getModelSchemaRef(Solicitud)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof TipoInmueble.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Solicitud, {
            title: 'NewSolicitudInTipoInmueble',
            exclude: ['id'],
            optional: ['tipoInmuebleId']
          }),
        },
      },
    }) solicitud: Omit<Solicitud, 'id'>,
  ): Promise<Solicitud> {
    return this.tipoInmuebleRepository.solicitudes(id).create(solicitud);
  }

  @patch('/tipo-inmuebles/{id}/solicituds', {
    responses: {
      '200': {
        description: 'TipoInmueble.Solicitud PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Solicitud, {partial: true}),
        },
      },
    })
    solicitud: Partial<Solicitud>,
    @param.query.object('where', getWhereSchemaFor(Solicitud)) where?: Where<Solicitud>,
  ): Promise<Count> {
    return this.tipoInmuebleRepository.solicitudes(id).patch(solicitud, where);
  }

  @del('/tipo-inmuebles/{id}/solicituds', {
    responses: {
      '200': {
        description: 'TipoInmueble.Solicitud DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Solicitud)) where?: Where<Solicitud>,
  ): Promise<Count> {
    return this.tipoInmuebleRepository.solicitudes(id).delete(where);
  }
}
