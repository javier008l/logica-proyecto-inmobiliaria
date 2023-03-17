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
  TipoInmueble,
} from '../models';
import {SolicitudRepository} from '../repositories';

export class SolicitudTipoInmuebleController {
  constructor(
    @repository(SolicitudRepository)
    public solicitudRepository: SolicitudRepository,
  ) { }

  @get('/solicituds/{id}/tipo-inmueble', {
    responses: {
      '200': {
        description: 'TipoInmueble belonging to Solicitud',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(TipoInmueble)},
          },
        },
      },
    },
  })
  async getTipoInmueble(
    @param.path.number('id') id: typeof Solicitud.prototype.id,
  ): Promise<TipoInmueble> {
    return this.solicitudRepository.tipoInmueble(id);
  }
}
