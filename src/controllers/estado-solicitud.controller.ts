import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Estado,
  Solicitud,
} from '../models';
import {EstadoRepository} from '../repositories';

export class EstadoSolicitudController {
  constructor(
    @repository(EstadoRepository)
    public estadoRepository: EstadoRepository,
  ) { }

  @get('/estados/{id}/solicitud', {
    responses: {
      '200': {
        description: 'Solicitud belonging to Estado',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Solicitud)},
          },
        },
      },
    },
  })
  async getSolicitud(
    @param.path.number('id') id: typeof Estado.prototype.id,
  ): Promise<Solicitud> {
    return this.estadoRepository.solicitud(id);
  }
}
