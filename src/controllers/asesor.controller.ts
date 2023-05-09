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
  HttpErrors,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {ConfiguracionNotificaciones} from '../config/configuracion.notificaciones';
import {ConfiguracionSeguridad} from '../config/configuracion.seguridad';
import {Asesor} from '../models';
import {AsesorRepository} from '../repositories';
import {NotificacionService, SeguridadService} from '../services';

export class AsesorController {
  constructor(
    @repository(AsesorRepository)
    public asesorRepository: AsesorRepository,
    @service(NotificacionService)
    private servicioNotificaciones: NotificacionService,
    @repository(AsesorRepository)
    private repositorioAsesor: AsesorRepository,
    @service(SeguridadService)
    private servicioSeguridad: SeguridadService,
  ) { }

  /**
   * se notifica al asesor que a sido aceptado y se guarda en base de datos
   * @param datos de asesor
   * @returns true, cuando se ha creado y notificado al asesor
   */

  @post('/registro-privado-asesor')
  @response(200, {
    description: 'Envio del mensaje de solicituda para ser asesor',
    content: {'aplicacion/json': {schema: getModelSchemaRef(Asesor)}},
  })
  async aceptarAsesor(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Asesor),
        },
      },
    })
    datos: Asesor,
  ): Promise<Object> {
    try {
      const asesor = this.repositorioAsesor.findOne({
        where: {
          correo: datos.correo
        }
      })
      this.asesorRepository.save(datos);

      const correoNuevoAsesor = datos.correo;
      const nombreAsesor = datos.primerNombre;
      const asunto = "Credenciales asesor";
      const mensaje = `Estimado/a ${datos.primerNombre}, ha sido aceptado/a en nuestra inmobiliaria,
      sus crendeciales de asesor son:

      Correo: ${datos.correo},

      debe ingresar con el correo, debe darle en olvide mi contraseña, el sistema le
      generará una nueva que se le enviará al siguiente número de celular:

      ${datos.telefono}

      Hasta pronto,
      Equipo Técnico,
      `;
      const datosContacto = {
        correoDestino: correoNuevoAsesor,
        nombreDestino: nombreAsesor,
        asuntoCorreo: asunto,
        contenidoCorreo: mensaje
      };

      const datosUsuario = {
        primerNombre: datos.primerNombre,
        segundoNombre: datos.segundoNombre,
        primerApellido: datos.primerApellido,
        segundoApellido: datos.segundoApellido,
        correo: datos.correo,
        celular: datos.telefono,
        cedula: datos.cedula,
        clave: "",
        rolId: ConfiguracionSeguridad.rolAsesorId,
        EstadoValidacion: true,

      };

      const seguridad = this.servicioSeguridad.datosUsuario(datosUsuario, ConfiguracionSeguridad.enlaceSeguridadDatosAsesor)
      console.log(seguridad);
      const enviado = this.servicioNotificaciones.enviarNotificaciones(datosContacto, ConfiguracionNotificaciones.urlNotificaciones2fa);
      console.log(enviado);
      return enviado;
    } catch {
      throw new HttpErrors[500]("Error de servidor para enviar mensaje")
    }

  }

  @post('/asesor')
  @response(200, {
    description: 'Asesor model instance',
    content: {'application/json': {schema: getModelSchemaRef(Asesor)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Asesor, {
            title: 'NewAsesor',
            exclude: ['id'],
          }),
        },
      },
    })
    asesor: Omit<Asesor, 'id'>,
  ): Promise<Asesor> {
    return this.asesorRepository.create(asesor);
  }

  @get('/asesor/count')
  @response(200, {
    description: 'Asesor model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Asesor) where?: Where<Asesor>,
  ): Promise<Count> {
    return this.asesorRepository.count(where);
  }

  @authenticate({
    strategy: "auth",
    options: [ConfiguracionSeguridad.menuAsesorId, ConfiguracionSeguridad.listarAccion]
  })
  @get('/asesor')
  @response(200, {
    description: 'Array of Asesor model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Asesor, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Asesor) filter?: Filter<Asesor>,
  ): Promise<Asesor[]> {
    return this.asesorRepository.find(filter);
  }

  @patch('/asesor')
  @response(200, {
    description: 'Asesor PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Asesor, {partial: true}),
        },
      },
    })
    asesor: Asesor,
    @param.where(Asesor) where?: Where<Asesor>,
  ): Promise<Count> {
    return this.asesorRepository.updateAll(asesor, where);
  }

  @get('/asesor/{id}')
  @response(200, {
    description: 'Asesor model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Asesor, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Asesor, {exclude: 'where'}) filter?: FilterExcludingWhere<Asesor>
  ): Promise<Asesor> {
    return this.asesorRepository.findById(id, filter);
  }

  @patch('/asesor/{id}')
  @response(204, {
    description: 'Asesor PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Asesor, {partial: true}),
        },
      },
    })
    asesor: Asesor,
  ): Promise<void> {
    await this.asesorRepository.updateById(id, asesor);
  }

  @put('/asesor/{id}')
  @response(204, {
    description: 'Asesor PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() asesor: Asesor,
  ): Promise<void> {
    await this.asesorRepository.replaceById(id, asesor);
  }

  @del('/asesor/{id}')
  @response(204, {
    description: 'Asesor DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.asesorRepository.deleteById(id);
  }

}
