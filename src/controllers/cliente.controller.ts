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
import {AsesorId, Cliente, PaginadorCliente} from '../models';
import {ClienteRepository} from '../repositories';

export class ClienteController {
  constructor(
    @repository(ClienteRepository)
    public clienteRepository: ClienteRepository,
  ) { }

  @post('/datos-cliente')
  @response(200, {
    description: '',
    content: {'aplicacion/json': {schema: getModelSchemaRef(Cliente)}},
  })
  async guardarDatos(
    @requestBody(({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Cliente),
        },
      },
    }))
    datos: any,
  ): Promise<Cliente> {
    console.log(datos)
    const created = await this.clienteRepository.create(datos);
    console.log(created);
    return created;
  }

  @authenticate({
    strategy: "auth",
    options: [ConfiguracionSeguridad.menuClienteId, ConfiguracionSeguridad.guardarAccion]
  })
  @post('/cliente')
  @response(200, {
    description: 'Cliente model instance',
    content: {'application/json': {schema: getModelSchemaRef(Cliente)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Cliente, {
            title: 'NewCliente',
            exclude: ['id'],
          }),
        },
      },
    })
    cliente: Omit<Cliente, 'id'>,
  ): Promise<Cliente> {
    return this.clienteRepository.create(cliente);
  }

  @get('/cliente/count')
  @response(200, {
    description: 'Cliente model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Cliente) where?: Where<Cliente>,
  ): Promise<Count> {
    return this.clienteRepository.count(where);
  }

  @authenticate({
    strategy: "auth",
    options: [ConfiguracionSeguridad.menuClienteId, ConfiguracionSeguridad.listarAccion]
  })
  @get('/cliente')
  @response(200, {
    description: 'Array of Cliente model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(PaginadorCliente, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Cliente) filter?: Filter<Cliente>,
  ): Promise<object> {
    const total: number = (await this.clienteRepository.count()).count;
    const registros: Cliente[] = await this.clienteRepository.find(filter);
    const repuesta = {
      registros: registros,
      totalRegistros: total,
    };
    return repuesta;
  }

  @patch('/cliente')
  @response(200, {
    description: 'Cliente PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Cliente, {partial: true}),
        },
      },
    })
    cliente: Cliente,
    @param.where(Cliente) where?: Where<Cliente>,
  ): Promise<Count> {
    return this.clienteRepository.updateAll(cliente, where);
  }

  @get('/cliente/{id}')
  @response(200, {
    description: 'Cliente model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Cliente, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Cliente, {exclude: 'where'}) filter?: FilterExcludingWhere<Cliente>
  ): Promise<Cliente> {
    return this.clienteRepository.findById(id, filter);
  }

  @patch('/cliente/{id}')
  @response(204, {
    description: 'Cliente PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Cliente, {partial: true}),
        },
      },
    })
    cliente: Cliente,
  ): Promise<void> {
    await this.clienteRepository.updateById(id, cliente);
  }

  @put('/cliente/{id}')
  @response(204, {
    description: 'Cliente PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() cliente: Cliente,
  ): Promise<void> {
    await this.clienteRepository.replaceById(id, cliente);
  }

  @del('/cliente/{id}')
  @response(204, {
    description: 'Cliente DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.clienteRepository.deleteById(id);
  }

  @post('/cliente-correo')
  @response(200, {
    description: 'Cliente model instance',
    content: {'application/json': {schema: getModelSchemaRef(Cliente)}},
  })
  async buscarClienteporCorreo(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AsesorId),
        },
      },
    })
    datos: AsesorId,
  ): Promise<Number> {
    const cliente = await this.clienteRepository.findOne({
      where: {
        correo: datos.correoAsesor
      }
    });

    if (!cliente) {
      throw new HttpErrors.NotFound('No se encuentra el cliente');
    }
    return cliente.id as number;
  }

  @post('/id-cliente')
  @response(200, {
    description: 'devolver el id del asesor cuando tengo el correo',
    content: {
      'application/json': {
        schema: {
          type: '',
          items: getModelSchemaRef(Cliente),
        },
      },
    },
  })
  async idAsesor(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AsesorId),
        },
      },
    })
    datos: AsesorId,
  ): Promise<number> {
    let cliente = await this.clienteRepository.findOne({
      where: {
        correo: datos.correoAsesor
      }
    });

    if (cliente) {
      let idCliente = cliente.id;
      return idCliente!;
    }
    return null!
  }

}
