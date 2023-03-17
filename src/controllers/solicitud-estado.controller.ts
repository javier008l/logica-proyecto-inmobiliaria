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
  Solicitud,
  Estado,
} from '../models';
import {SolicitudRepository} from '../repositories';

export class SolicitudEstadoController {
  constructor(
    @repository(SolicitudRepository) protected solicitudRepository: SolicitudRepository,
  ) { }

  @get('/solicituds/{id}/estados', {
    responses: {
      '200': {
        description: 'Array of Solicitud has many Estado',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Estado)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Estado>,
  ): Promise<Estado[]> {
    return this.solicitudRepository.estados(id).find(filter);
  }

  @post('/solicituds/{id}/estados', {
    responses: {
      '200': {
        description: 'Solicitud model instance',
        content: {'application/json': {schema: getModelSchemaRef(Estado)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Solicitud.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Estado, {
            title: 'NewEstadoInSolicitud',
            exclude: ['id'],
            optional: ['solicitudId']
          }),
        },
      },
    }) estado: Omit<Estado, 'id'>,
  ): Promise<Estado> {
    return this.solicitudRepository.estados(id).create(estado);
  }

  @patch('/solicituds/{id}/estados', {
    responses: {
      '200': {
        description: 'Solicitud.Estado PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Estado, {partial: true}),
        },
      },
    })
    estado: Partial<Estado>,
    @param.query.object('where', getWhereSchemaFor(Estado)) where?: Where<Estado>,
  ): Promise<Count> {
    return this.solicitudRepository.estados(id).patch(estado, where);
  }

  @del('/solicituds/{id}/estados', {
    responses: {
      '200': {
        description: 'Solicitud.Estado DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Estado)) where?: Where<Estado>,
  ): Promise<Count> {
    return this.solicitudRepository.estados(id).delete(where);
  }
}
