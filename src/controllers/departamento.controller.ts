import {authenticate} from '@loopback/authentication';
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
  HttpErrors,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {ConfiguracionSeguridad} from '../config/configuracion.seguridad';
import {Departamento, NombreDepartamento} from '../models';
import {DepartamentoRepository} from '../repositories';

export class DepartamentoController {
  constructor(
    @repository(DepartamentoRepository)
    public departamentoRepository: DepartamentoRepository,
  ) { }

  @authenticate({
    strategy: "auth",
    options: [ConfiguracionSeguridad.menuCrearCiudadyDepartamentoId, ConfiguracionSeguridad.guardarAccion]
  })
  @post('/departamento')
  @response(200, {
    description: 'Departamento model instance',
    content: {'application/json': {schema: getModelSchemaRef(Departamento)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Departamento, {
            title: 'NewDepartamento',
            exclude: ['id'],
          }),
        },
      },
    })
    departamento: Omit<Departamento, 'id'>,
  ): Promise<Departamento> {
    return this.departamentoRepository.create(departamento);
  }

  @get('/departamento/count')
  @response(200, {
    description: 'Departamento model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Departamento) where?: Where<Departamento>,
  ): Promise<Count> {
    return this.departamentoRepository.count(where);
  }

  @get('/departamento')
  @response(200, {
    description: 'Array of Departamento model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Departamento, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Departamento) filter?: Filter<Departamento>,
  ): Promise<Departamento[]> {
    return this.departamentoRepository.find(filter);
  }

  @patch('/departamento')
  @response(200, {
    description: 'Departamento PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Departamento, {partial: true}),
        },
      },
    })
    departamento: Departamento,
    @param.where(Departamento) where?: Where<Departamento>,
  ): Promise<Count> {
    return this.departamentoRepository.updateAll(departamento, where);
  }

  @get('/departamento/{id}')
  @response(200, {
    description: 'Departamento model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Departamento, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Departamento, {exclude: 'where'}) filter?: FilterExcludingWhere<Departamento>
  ): Promise<Departamento> {
    return this.departamentoRepository.findById(id, filter);
  }

  @patch('/departamento/{id}')
  @response(204, {
    description: 'Departamento PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Departamento, {partial: true}),
        },
      },
    })
    departamento: Departamento,
  ): Promise<void> {
    await this.departamentoRepository.updateById(id, departamento);
  }

  @put('/departamento/{id}')
  @response(204, {
    description: 'Departamento PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() departamento: Departamento,
  ): Promise<void> {
    await this.departamentoRepository.replaceById(id, departamento);
  }

  @del('/departamento/{id}')
  @response(204, {
    description: 'Departamento DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.departamentoRepository.deleteById(id);
  }

  @post('/nombre-departamento')
  @response(200, {
    description: '',
    content: {'application/json': {schema: getModelSchemaRef(Departamento)}},
  })
  async buscarClienteporCorreo(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NombreDepartamento),
        },
      },
    })
    datos: NombreDepartamento,
  ): Promise<Number> {
    const departamento = await this.departamentoRepository.findOne({
      where: {
        nombre: datos.nombreDepartamento
      }
    });

    if (!departamento) {
      throw new HttpErrors.NotFound('No se encuentra el cliente');
    }
    return departamento.id as number;
  }

}
