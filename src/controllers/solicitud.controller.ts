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
import {Solicitud} from '../models';
import {AsesorRepository, ClienteRepository, InmuebleRepository, SolicitudRepository} from '../repositories';
import {NotificacionService} from '../services';

export class SolicitudController {
  constructor(
    @repository(SolicitudRepository)
    public solicitudRepository: SolicitudRepository,
    @repository(InmuebleRepository)
    public inmuebleRepositorio: InmuebleRepository,
    @repository(ClienteRepository)
    public clienteRepositorio: ClienteRepository,
    @repository(AsesorRepository)
    public asesorRepositorio: AsesorRepository,
    @service(NotificacionService)
    private servicioNotificaciones: NotificacionService,
  ) { }

  @post('/solicitud')
  @response(200, {
    description: 'Solicitud model instance',
    content: {'application/json': {schema: getModelSchemaRef(Solicitud)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Solicitud, {
            title: 'NewSolicitud',
            exclude: ['id'],
          }),
        },
      },
    })
    solicitud: Omit<Solicitud, 'id'>,
  ): Promise<Solicitud> {

    // Notificar al cliente y al asesor de una nueva solicitud
    let inmueble = await this.inmuebleRepositorio.findOne({
      where: {id: solicitud.inmuebleId}
    });
    if (inmueble) {
      let asesor = await this.asesorRepositorio.findOne({
        where: {id: solicitud.asesorId},
      });
      if (asesor) {
        let cliente = await this.clienteRepositorio.findOne({
          where: {id: solicitud.clienteId}
        });
        if (cliente) {

          // Hacer el metodo para notificar
          try {
            // Notificar al cliente
            let asunto = "Solicitud realizada"

            let mensaje = `<br>Estimado/a ${cliente.primerNombre}, su solicitud se realizo exitosamente,
            en este momento se encuentra en estado enviado, para más informacion, puede revisar en nuestra
            pagina web.<br/>

           <br> Hasta pronto,<br/>
            Equipo Técnico,
            `;

            let datosCliente = {
              correoDestino: cliente.correo,
              nombreDestino: cliente.primerNombre,
              asuntoCorreo: asunto,
              contenidoCorreo: mensaje
            };

            let enviado = this.servicioNotificaciones.enviarNotificaciones(datosCliente, ConfiguracionNotificaciones.urlNotificaciones2fa);
            console.log(enviado);

            // notificar al usuario via sms
            let datosSMS = {
              numeroDestino: cliente.telefono,
              contenidoMensaje: `Hola ${cliente.primerNombre}, la solicitud ${solicitud.tipoSolicitudId}que acaba de realizar
              con nuestra inmobiliaria fue exitosa, actualmente se encuentra en estado enviado!`,
            };
            const url = ConfiguracionNotificaciones.urlNotificacionesSms;
            this.servicioNotificaciones.enviarNotificaciones(datosSMS, url);

            // Notificar al asesor
            let asunto2 = "Nueva solicitud"
            let mensaje2 = `<br>Estimado/a ${asesor.primerNombre}, se acaba de realizar una nueva solicitud
            para el inmueble ${inmueble.id}, que se encuentra en ${inmueble.direccion}, que se encuentra
            bajo su cargo.<br/>

           <br> Hasta pronto,<br/>
            Equipo Técnico,
            `;
            let datosAsesor = {
              correoDestino: asesor.correo,
              nombreDestino: asesor.primerNombre,
              asuntoCorreo: asunto2,
              contenidoCorreo: mensaje2
            };
            let enviado2 = this.servicioNotificaciones.enviarNotificaciones(datosAsesor, ConfiguracionNotificaciones.urlNotificaciones2fa);
            console.log(enviado2);
          } catch {
            throw new HttpErrors[500]("Error de servidor para enviar mensaje")
          }
        }
      }
    }

    return this.solicitudRepository.create(solicitud);
  }

  @get('/solicitud/count')
  @response(200, {
    description: 'Solicitud model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Solicitud) where?: Where<Solicitud>,
  ): Promise<Count> {
    return this.solicitudRepository.count(where);
  }

  @get('/solicitud')
  @response(200, {
    description: 'Array of Solicitud model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Solicitud, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Solicitud) filter?: Filter<Solicitud>,
  ): Promise<Solicitud[]> {
    return this.solicitudRepository.find(filter);
  }

  @patch('/solicitud')
  @response(200, {
    description: 'Solicitud PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Solicitud, {partial: true}),
        },
      },
    })
    solicitud: Solicitud,
    @param.where(Solicitud) where?: Where<Solicitud>,
  ): Promise<Count> {
    return this.solicitudRepository.updateAll(solicitud, where);
  }

  @get('/solicitud/{id}')
  @response(200, {
    description: 'Solicitud model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Solicitud, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Solicitud, {exclude: 'where'}) filter?: FilterExcludingWhere<Solicitud>
  ): Promise<Solicitud> {
    return this.solicitudRepository.findById(id, filter);
  }

  @patch('/solicitud/{id}')
  @response(204, {
    description: 'Solicitud PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Solicitud, {partial: true}),
        },
      },
    })
    solicitud: Solicitud,
  ): Promise<void> {
    await this.solicitudRepository.updateById(id, solicitud);
  }

  @put('/solicitud/{id}')
  @response(204, {
    description: 'Solicitud PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() solicitud: Solicitud,
  ): Promise<void> {
    await this.solicitudRepository.replaceById(id, solicitud);
  }

  @del('/solicitud/{id}')
  @response(204, {
    description: 'Solicitud DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.solicitudRepository.deleteById(id);
  }
}
