import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Contrato,
  Estado,
} from '../models';
import {ContratoRepository} from '../repositories';

export class ContratoEstadoController {
  constructor(
    @repository(ContratoRepository)
    public contratoRepository: ContratoRepository,
  ) { }

  @get('/contratoes/{id}/estado', {
    responses: {
      '200': {
        description: 'Estado belonging to Contrato',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Estado)},
          },
        },
      },
    },
  })
  async getEstado(
    @param.path.number('id') id: typeof Contrato.prototype.id,
  ): Promise<Estado> {
    return this.contratoRepository.estado(id);
  }
}
