import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Solicitud,
  Estado,
} from '../models';
import {SolicitudRepository} from '../repositories';

export class SolicitudEstadoController {
  constructor(
    @repository(SolicitudRepository)
    public solicitudRepository: SolicitudRepository,
  ) { }

  @get('/solicituds/{id}/estado', {
    responses: {
      '200': {
        description: 'Estado belonging to Solicitud',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Estado)},
          },
        },
      },
    },
  })
  async getEstado(
    @param.path.number('id') id: typeof Solicitud.prototype.id,
  ): Promise<Estado> {
    return this.solicitudRepository.estado(id);
  }
}
