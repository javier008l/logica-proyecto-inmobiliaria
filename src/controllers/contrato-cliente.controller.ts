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
  Cliente,
} from '../models';
import {ContratoRepository} from '../repositories';

export class ContratoClienteController {
  constructor(
    @repository(ContratoRepository)
    public contratoRepository: ContratoRepository,
  ) { }

  @get('/contratoes/{id}/cliente', {
    responses: {
      '200': {
        description: 'Cliente belonging to Contrato',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Cliente)},
          },
        },
      },
    },
  })
  async getCliente(
    @param.path.number('id') id: typeof Contrato.prototype.id,
  ): Promise<Cliente> {
    return this.contratoRepository.cliente(id);
  }
}
