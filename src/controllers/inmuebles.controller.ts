import {authenticate} from '@loopback/authentication';
import {inject, service} from '@loopback/core';
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
import {Asesor, Inmueble} from '../models';
import {AsesorRepository, InmuebleRepository} from '../repositories';
import {NotificacionService} from '../services';

export class InmueblesController {
  constructor(
    @repository(InmuebleRepository)
    public inmuebleRepository: InmuebleRepository,
    @service(NotificacionService)
    private servicioNotificaciones: NotificacionService,
    @repository(AsesorRepository)
    private asesorRepository: AsesorRepository,

  ) { }

  // @authenticate({
  //   strategy: 'auth',
  //   options: [ConfiguracionSeguridad.menuInmuebleId, ConfiguracionSeguridad.guardarAccion]
  // })


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
    inmueble: Omit<Inmueble, 'id'>
  ): Promise<Inmueble> {
    let asesor = await this.asesorRepository.findOne({
      where: {
        correo: inmueble.correoAsesor
      }
    })

    if (!asesor) {
      throw new Error('No se encontró ningún asesor con ese correo electrónico.');
    }
    if (!asesor.inmuebleId) {
      asesor.inmuebleId = [];
    }
    const createdInmueble = await this.inmuebleRepository.create(inmueble);
    const inmuebleId = createdInmueble.id;

    let idAsesor = await this.asesorRepository.findById(asesor.id)
    if (idAsesor.inmuebleId === null) {
      idAsesor.inmuebleId = [];
    }

    if (inmuebleId !== undefined) {
      asesor.inmuebleId.push(inmuebleId);
      await this.asesorRepository.update(asesor);
    } else {
      console.log('No se generó un ID válido para el inmueble.');
    }

    return createdInmueble;
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

  @authenticate({
    strategy: 'auth',
    options: [ConfiguracionSeguridad.menuInmuebleId, ConfiguracionSeguridad.listarAccion]
  })
  @get('/inmueble-paginado')
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
  async findPaginacion(
    @param.filter(Inmueble) filter?: Filter<Inmueble>,

  ): Promise<object> {
    let total: number = (await this.inmuebleRepository.count()).count;
    let registros: Inmueble[] = await this.inmuebleRepository.find(filter);
    let repuesta = {
      registros: registros,
      totalRegistros: total,
    };
    return repuesta;
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


  @get('/listar-inmuebles')
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
  async findByTipoInmueble(
    @param.query.string('tipo') tipo: string,
    @param.query.number('tipoInmuebleId') tipoInmuebleId: number,
    @param.query.number('limit') limit?: number
  ): Promise<Inmueble[]> {
    const filter: Filter<Inmueble> = {
      where: {},
      limit: limit || undefined,
    };

    if (tipo === 'paraVenta') {
      filter.where = {
        ...filter.where,
        paraVenta: true,
      };
    } else if (tipo === 'paraAlquiler') {
      filter.where = {
        ...filter.where,
        paraAlquiler: true,
      };
    }

    if (tipoInmuebleId) {
      filter.where = {
        ...filter.where,
        tipoInmuebleId: tipoInmuebleId,
      };
    }

    return this.inmuebleRepository.find(filter);
  }

}
