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
  Estado,
  Contrato,
} from '../models';
import {EstadoRepository} from '../repositories';

export class EstadoContratoController {
  constructor(
    @repository(EstadoRepository) protected estadoRepository: EstadoRepository,
  ) { }

  @get('/estados/{id}/contratoes', {
    responses: {
      '200': {
        description: 'Array of Estado has many Contrato',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Contrato)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Contrato>,
  ): Promise<Contrato[]> {
    return this.estadoRepository.contratos(id).find(filter);
  }

  @post('/estados/{id}/contratoes', {
    responses: {
      '200': {
        description: 'Estado model instance',
        content: {'application/json': {schema: getModelSchemaRef(Contrato)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Estado.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Contrato, {
            title: 'NewContratoInEstado',
            exclude: ['id'],
            optional: ['estadoId']
          }),
        },
      },
    }) contrato: Omit<Contrato, 'id'>,
  ): Promise<Contrato> {
    return this.estadoRepository.contratos(id).create(contrato);
  }

  @patch('/estados/{id}/contratoes', {
    responses: {
      '200': {
        description: 'Estado.Contrato PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Contrato, {partial: true}),
        },
      },
    })
    contrato: Partial<Contrato>,
    @param.query.object('where', getWhereSchemaFor(Contrato)) where?: Where<Contrato>,
  ): Promise<Count> {
    return this.estadoRepository.contratos(id).patch(contrato, where);
  }

  @del('/estados/{id}/contratoes', {
    responses: {
      '200': {
        description: 'Estado.Contrato DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Contrato)) where?: Where<Contrato>,
  ): Promise<Count> {
    return this.estadoRepository.contratos(id).delete(where);
  }
}
