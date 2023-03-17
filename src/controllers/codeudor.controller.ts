import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Codeudor} from '../models';
import {CodeudorRepository} from '../repositories';

export class CodeudorController {
  constructor(
    @repository(CodeudorRepository)
    public codeudorRepository : CodeudorRepository,
  ) {}

  @post('/codeudor')
  @response(200, {
    description: 'Codeudor model instance',
    content: {'application/json': {schema: getModelSchemaRef(Codeudor)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Codeudor, {
            title: 'NewCodeudor',
            exclude: ['id'],
          }),
        },
      },
    })
    codeudor: Omit<Codeudor, 'id'>,
  ): Promise<Codeudor> {
    return this.codeudorRepository.create(codeudor);
  }

  @get('/codeudor/count')
  @response(200, {
    description: 'Codeudor model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Codeudor) where?: Where<Codeudor>,
  ): Promise<Count> {
    return this.codeudorRepository.count(where);
  }

  @get('/codeudor')
  @response(200, {
    description: 'Array of Codeudor model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Codeudor, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Codeudor) filter?: Filter<Codeudor>,
  ): Promise<Codeudor[]> {
    return this.codeudorRepository.find(filter);
  }

  @patch('/codeudor')
  @response(200, {
    description: 'Codeudor PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Codeudor, {partial: true}),
        },
      },
    })
    codeudor: Codeudor,
    @param.where(Codeudor) where?: Where<Codeudor>,
  ): Promise<Count> {
    return this.codeudorRepository.updateAll(codeudor, where);
  }

  @get('/codeudor/{id}')
  @response(200, {
    description: 'Codeudor model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Codeudor, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Codeudor, {exclude: 'where'}) filter?: FilterExcludingWhere<Codeudor>
  ): Promise<Codeudor> {
    return this.codeudorRepository.findById(id, filter);
  }

  @patch('/codeudor/{id}')
  @response(204, {
    description: 'Codeudor PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Codeudor, {partial: true}),
        },
      },
    })
    codeudor: Codeudor,
  ): Promise<void> {
    await this.codeudorRepository.updateById(id, codeudor);
  }

  @put('/codeudor/{id}')
  @response(204, {
    description: 'Codeudor PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() codeudor: Codeudor,
  ): Promise<void> {
    await this.codeudorRepository.replaceById(id, codeudor);
  }

  @del('/codeudor/{id}')
  @response(204, {
    description: 'Codeudor DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.codeudorRepository.deleteById(id);
  }
}
