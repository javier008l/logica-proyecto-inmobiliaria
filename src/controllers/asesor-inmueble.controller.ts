import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Asesor,
  Inmueble,
} from '../models';
import {AsesorRepository} from '../repositories';

export class AsesorInmuebleController {
  constructor(
    @repository(AsesorRepository)
    public asesorRepository: AsesorRepository,
  ) { }

  @get('/asesors/{id}/inmueble', {
    responses: {
      '200': {
        description: 'Inmueble belonging to Asesor',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Inmueble)},
          },
        },
      },
    },
  })
  async getInmueble(
    @param.path.number('id') id: typeof Asesor.prototype.id,
  ): Promise<Inmueble> {
    return this.asesorRepository.inmueble(id);
  }
}
