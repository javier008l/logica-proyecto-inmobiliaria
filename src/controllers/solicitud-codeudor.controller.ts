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
  Codeudor,
} from '../models';
import {SolicitudRepository} from '../repositories';

export class SolicitudCodeudorController {
  constructor(
    @repository(SolicitudRepository)
    public solicitudRepository: SolicitudRepository,
  ) { }

  @get('/solicituds/{id}/codeudor', {
    responses: {
      '200': {
        description: 'Codeudor belonging to Solicitud',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Codeudor)},
          },
        },
      },
    },
  })
  async getCodeudor(
    @param.path.number('id') id: typeof Solicitud.prototype.id,
  ): Promise<Codeudor> {
    return this.solicitudRepository.codeudor(id);
  }
}
