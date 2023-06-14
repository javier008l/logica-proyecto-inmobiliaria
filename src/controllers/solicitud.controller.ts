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
import {Solicitud} from '../models';
import {RespuestaSolicitud} from '../models/respuesta-solicitud.model';
import {AsesorRepository, ClienteRepository, EstadoRepository, InmuebleRepository, SolicitudRepository} from '../repositories';
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
    @repository(EstadoRepository)
    public estadoRepositorio: EstadoRepository,
    @service(NotificacionService)
    private servicioNotificaciones: NotificacionService,
    @repository(AsesorRepository)
    private asesorRepository: AsesorRepository,
  ) { }

  // @authenticate({
  //   strategy: "auth",
  //   options: [ConfiguracionSeguridad.menuSolicitudId, ConfiguracionSeguridad.guardarAccion]
  // })
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
    solicitud.estadoId = 1;
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

            let enviado = this.servicioNotificaciones.enviarNotificaciones(datosCliente, ConfiguracionNotificaciones.urlNotificacionesNuevaSolicitudCliente);
            console.log(enviado);

            // notificar al usuario via sms
            let datosSMS = {
              numeroDestino: cliente.telefono,
              contenidoMensaje: `Hola ${cliente.primerNombre}, la solicitud que acaba de realizar con la Inmobiliaria Tu Hogar fue exitosa, actualmente se encuentra en estado enviado!`,
            };
            const url = ConfiguracionNotificaciones.urlNotificacionesSms;
            this.servicioNotificaciones.enviarNotificaciones(datosSMS, url);

            // Notificar al asesor
            let asunto2 = "Nueva solicitud"
            let mensaje2 = `Estimado/a ${asesor.primerNombre}, se acaba de realizar una nueva solicitud
            para el inmueble, que se encuentra en la dirección: ${inmueble.direccion}, el cual se encuentra
            bajo su cargo.<br>

           Hasta pronto,<br>
            Equipo Técnico,
            `;
            let datosAsesor = {
              correoDestino: asesor.correo,
              nombreDestino: asesor.primerNombre,
              asuntoCorreo: asunto2,
              contenidoCorreo: mensaje2
            };
            let enviado2 = this.servicioNotificaciones.enviarNotificaciones(datosAsesor, ConfiguracionNotificaciones.urlNotificacionesNuevaSolicitudAsesor);
            console.log(enviado2);

            let asesor2 = await this.asesorRepository.findOne({
              where: {
                id: solicitud.asesorId
              }
            })

            if (!asesor2) {
              throw new Error('No se encontró ningún asesor con ese correo electrónico.');
            }
            if (!asesor2.solicitudId) {
              asesor2.solicitudId = [];
            }
            const createdSolicitud = await this.solicitudRepository.create(solicitud);
            const solicitudId = createdSolicitud.id;

            let idAsesor = await this.asesorRepository.findById(asesor2.id)
            if (idAsesor.solicitudId === null) {
              idAsesor.solicitudId = [];
            }

            if (solicitudId !== undefined) {
              asesor2.solicitudId.push(solicitudId);
              await this.asesorRepository.update(asesor2);
            } else {
              console.log('No se generó un ID válido para el inmueble.');
            }

            return createdSolicitud;
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

  @authenticate({
    strategy: "auth",
    options: [ConfiguracionSeguridad.menuSolicitudId, ConfiguracionSeguridad.listarAccion]
  })
  @get('/solicitud-paginada')
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
  async findToPaginacion(
    @param.filter(Solicitud) filter?: Filter<Solicitud>,
  ): Promise<object> {
    let total: number = (await this.solicitudRepository.count()).count;
    let registros: Solicitud[] = await this.solicitudRepository.find(filter);
    let repuesta = {
      registros: registros,
      totalRegistros: total,
    };
    return repuesta;
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

      // Eliminar el id de solicitud del campo solicitudid del modelo Asesor
  const asesores = await this.asesorRepository.find(); // Obtener todos los asesores
  for (const asesor of asesores) {
    // Verificar si el id de la solicitud está presente en el campo solicitudid del asesor
    if (asesor.solicitudId!.includes(id)) {
      // Eliminar el id de la solicitud del campo solicitudid del asesor
      const index = asesor.solicitudId!.indexOf(id);
      asesor.solicitudId!.splice(index, 1);
      await this.asesorRepository.update(asesor); // Guardar los cambios en el asesor
    }
  }
  }

  // Notficar el estado de la solicitud y si alguna es aceptada que se rechace automaticamente
  @post('/notificacion-estado-solicitud')
  @response(200, {
    description: 'Notificar el estado de una solicitud',
    content: {'application/json': {schema: getModelSchemaRef(Solicitud)}},
  })
  async estadoSolicitud(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RespuestaSolicitud),
        },
      },
    })
    datos: RespuestaSolicitud,
  ): Promise<Solicitud | null> {

    let solicitud = await this.solicitudRepository.findOne({
      where: {id: datos.solicitudId},
    });

    if (solicitud) {
      solicitud.estadoId = datos.estadoSolicitudId;
      await this.solicitudRepository.updateById(datos.solicitudId, solicitud);

      // Si el estado es Aceptada o Aceptada con codeudor
      if (solicitud.estadoId === 4 || solicitud.estadoId === 3) {
        let inmueble = await this.inmuebleRepositorio.findOne({
          where: {id: solicitud.inmuebleId},
        });
        // let inmueble = await this.inmuebleRepositorio.findOne({
        //   where: {id: solicitud.inmuebleId},
        // });

        if (inmueble) {
          // Establecer los atributos paraAlquiler y paraCompra como false
          inmueble.paraAlquiler = false;
          inmueble.paraVenta = false;
          await this.inmuebleRepositorio.updateById(solicitud.inmuebleId, inmueble);
          // Buscar las demás solicitudes asociadas al inmueble (excluyendo la solicitud actual)
          let otrasSolicitudes = await this.solicitudRepository.find({
            where: {
              inmuebleId: solicitud.inmuebleId,
              // Excluir todas las demas solicitudes excepto la que  este en estado aceptado o aceptado con codeudor
              estadoId: {nin: [3, 4]},
            },
          });

          for (let otraSolicitud of otrasSolicitudes) {
            // Se pasan a estado rechazado
            otraSolicitud.estadoId = 5;
            await this.solicitudRepository.updateById(otraSolicitud.id, otraSolicitud);
            // Notificar al cliente de la solicitud rechazada
            let clienteRechazado = await this.clienteRepositorio.findOne({
              where: {id: otraSolicitud.clienteId},
            });

            if (clienteRechazado) {
              try {
                // Construir el mensaje de notificación


                const asuntoRechazo = "Rechazo de su solicitud";
                const mensajeRechazo = `Estimado/a ${clienteRechazado.primerNombre}, su solicitud ha sido rechazada,
                  porque el inmueble ya fue tomado por otro cliente, para más información, puede revisar en nuestra página web.

                  Hasta pronto,
                  Equipo Técnico`;

                const datosClienteRechazado = {
                  correoDestino: clienteRechazado.correo,
                  nombreDestino: clienteRechazado.primerNombre,
                  asuntoCorreo: asuntoRechazo,
                  contenidoCorreo: mensajeRechazo,
                };

                // Enviar la notificación al cliente de que su solicitud fue rechazada
                await this.servicioNotificaciones.enviarNotificaciones(
                  datosClienteRechazado,
                  ConfiguracionNotificaciones.urlNotificacionesRechazoSolicitud
                );

                // notificar via Mensaje de texto
                let datosSMS = {
                  numeroDestino: clienteRechazado.telefono,
                  contenidoMensaje: `Hola ${clienteRechazado.primerNombre}, la solicitud que realizo con la Inmobiliaria Tu Hogar ha sido rechazada, porque el inmueble ya fue tomado por otro cliente`,
                };
                const url = ConfiguracionNotificaciones.urlNotificacionesSms;
                this.servicioNotificaciones.enviarNotificaciones(datosSMS, url);

              } catch (error) {
                throw new HttpErrors[500]("Error de servidor al enviar el mensaje");
              }
            }
          }
        }
      }
      let cliente = await this.clienteRepositorio.findOne({
        where: {id: solicitud.clienteId},
      });

      if (cliente) {
        let estado = await this.estadoRepositorio.findOne({
          where: {id: solicitud.estadoId},
        });

        if (estado) {
          try {
            // Notificar al cliente
            let asunto = "Cambio de estado en su solicitud"

            let mensaje = `<br>Estimado/a ${cliente.primerNombre}, el estado de su solicitud actualmente es:
            ${estado.nombre}, ${datos.motivoRechazo}, para más información, puede revisar en nuestra pagina web.<br/>


            <br> Hasta pronto,<br/>
            Equipo Técnico,
            `;

            let datosCliente = {
              correoDestino: cliente.correo,
              nombreDestino: cliente.primerNombre,
              asuntoCorreo: asunto,
              contenidoCorreo: mensaje
            };

            solicitud.motivoRechazo = datos.motivoRechazo;
            await this.solicitudRepository.updateById(datos.solicitudId, solicitud);

            let enviado = this.servicioNotificaciones.enviarNotificaciones(datosCliente, ConfiguracionNotificaciones.urlNotificacionesCambioEstadoSolicitud);
            console.log(enviado);

            // Notificar via Mensaje de texto
            let datosSMS = {
              numeroDestino: cliente.telefono,
              contenidoMensaje: `Hola ${cliente.primerNombre}, la solicitud que acaba de realizar
              con la Inmobiliaria Tu Hogar acaba de pasar a estado: ${estado.nombre}`,
            };
            const url = ConfiguracionNotificaciones.urlNotificacionesSms;
            this.servicioNotificaciones.enviarNotificaciones(datosSMS, url);

          } catch (error) {
            throw new HttpErrors[500]("Error de servidor para enviar mensaje")
          }
        }
      }
      return solicitud;
    }
    return null;
  }



}

