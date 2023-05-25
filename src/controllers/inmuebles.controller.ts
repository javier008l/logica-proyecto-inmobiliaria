import {authenticate} from '@loopback/authentication';
import {service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response
} from '@loopback/rest';
import {ConfiguracionSeguridad} from '../config/configuracion.seguridad';
import {Inmueble} from '../models';
import {InmuebleRepository} from '../repositories';
import {NotificacionService} from '../services';

export class InmueblesController {
  constructor(
    @repository(InmuebleRepository)
    public inmuebleRepository: InmuebleRepository,
    @service(NotificacionService)
    private servicioNotificaciones: NotificacionService,

  ) { }

  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.menuInmuebleId, ConfiguracionSeguridad.guardarAccion]
  })
  @post('/inmueble')
  @response(200, {
    description: 'Inmueble model instance',
    content: {'application/json': {schema: getModelSchemaRef(Inmueble)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Inmueble, {
            title: 'NewInmueble',
            exclude: ['id'],
          }),
        },
      },
    })
    inmueble: Omit<Inmueble, 'id'>,
  ): Promise<Inmueble> {
    return this.inmuebleRepository.create(inmueble);
  }

  @get('/inmueble/count')
  @response(200, {
    description: 'Inmueble model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Inmueble) where?: Where<Inmueble>,
  ): Promise<Count> {
    return this.inmuebleRepository.count(where);
  }

  @get('/inmueble')
  @response(200, {
    description: 'Array of Inmueble model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Inmueble, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Inmueble) filter?: Filter<Inmueble>,
  ): Promise<Inmueble[]> {
    return this.inmuebleRepository.find(filter);
  }

  @patch('/inmueble')
  @response(200, {
    description: 'Inmueble PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Inmueble, {partial: true}),
        },
      },
    })
    inmueble: Inmueble,
    @param.where(Inmueble) where?: Where<Inmueble>,
  ): Promise<Count> {
    return this.inmuebleRepository.updateAll(inmueble, where);
  }

  @get('/inmueble/{id}')
  @response(200, {
    description: 'Inmueble model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Inmueble, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Inmueble, {exclude: 'where'}) filter?: FilterExcludingWhere<Inmueble>
  ): Promise<Inmueble> {
    return this.inmuebleRepository.findById(id, filter);
  }

  @patch('/inmueble/{id}')
  @response(204, {
    description: 'Inmueble PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Inmueble, {partial: true}),
        },
      },
    })
    inmueble: Inmueble,
  ): Promise<void> {
    await this.inmuebleRepository.updateById(id, inmueble);
  }

  @put('/inmueble/{id}')
  @response(204, {
    description: 'Inmueble PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() inmueble: Inmueble,
  ): Promise<void> {
    await this.inmuebleRepository.replaceById(id, inmueble);
  }

  @del('/inmueble/{id}')
  @response(204, {
    description: 'Inmueble DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.inmuebleRepository.deleteById(id);
  }
  // Metodo que muestra los inmuebles que estan para la Venta
  @get('/casa-para-venta')
  @response(200, {
    description: 'Array of Inmueble model instances for venta',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Inmueble, {includeRelations: true}),
        },
      },
    },
  })
  async findByVenta(): Promise<Inmueble[]> {
    const filter: Filter<Inmueble> = {
      where: {
        paraVenta: true,
        // tipoInmuebleId: 1,
      },
    };
    return this.inmuebleRepository.find(filter);
  }

  // Metodo que muestra los inmuebles que estan para Alquiler
  @get('/inmueble-para-alquiler')
  @response(200, {
    description: 'Array of Inmueble model instances for alquiler',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Inmueble, {includeRelations: true}),
        },
      },
    },
  })
  async findByAlquiler(): Promise<Inmueble[]> {
    const filter: Filter<Inmueble> = {
      where: {
        paraAlquiler: true,
      },
    };
    return this.inmuebleRepository.find(filter);
  }


}
