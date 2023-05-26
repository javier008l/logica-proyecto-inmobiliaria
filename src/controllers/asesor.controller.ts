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
import {Asesor, AsesorId, DatosAsignacionInmuebleAsesor, Inmueble, VariablesGeneralesDelSistema} from '../models';
import {AsesorRepository, InmuebleRepository, VariablesGeneralesDelSistemaRepository} from '../repositories';
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
    @repository(VariablesGeneralesDelSistemaRepository)
    private variablesRepository: VariablesGeneralesDelSistemaRepository,
    @repository(InmuebleRepository)
    private inmuebleRepository: InmuebleRepository
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
    datos: Asesor
  ): Promise<Object> {
    try {
      const asesor = this.repositorioAsesor.findOne({
        where: {
          correo: datos.correo
        }
      })
      this.asesorRepository.create({...datos, id: undefined, inmuebleId: undefined});

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
        estadoValidacion: true,
        aceptado: true,
      };
      let datosAsesor = JSON.stringify(datosUsuario);
      console.log(datos);

      const seguridad = this.servicioSeguridad.datosUsuario(datosAsesor, ConfiguracionSeguridad.enlaceMicroservicioSeguridad + "datos-asesor")
      console.log("esto va a: " + seguridad);
      const enviado = this.servicioNotificaciones.enviarNotificaciones(datosContacto, ConfiguracionNotificaciones.urlNotificacionesCredencialesAsesor);
      console.log(enviado);
      return enviado;
    } catch {
      throw new HttpErrors[500]("Error de servidor para enviar mensaje")
    }

  }

  @authenticate({
    strategy: "auth",
    options: [ConfiguracionSeguridad.menuAsesorId, ConfiguracionSeguridad.guardarAccion]
  })
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

  @post('/asignar-inmueble-asesor')
  @response(200, {
    description: 'se notifica al asesor que se le asigno un inmueble y se guarda en base de datos',
    content: {'aplicacion/json': {schema: getModelSchemaRef(DatosAsignacionInmuebleAsesor)}},
  })
  async asignarInmueble(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DatosAsignacionInmuebleAsesor),
        },
      },
    })
    datos: DatosAsignacionInmuebleAsesor,
  ): Promise<Object> {
    try {
      const asesor = await this.repositorioAsesor.findOne({
        where: {
          id: datos.idAsesor
        }
      })
      let idAsesor = await this.repositorioAsesor.findById(datos.idAsesor)
      if (idAsesor.inmuebleId === null) {
        idAsesor.inmuebleId = [];
      }
      if (idAsesor && idAsesor.inmuebleId) {
        idAsesor.inmuebleId.push(datos.idInmueble);
        await this.repositorioAsesor.update(idAsesor);
      } else {
        console.log("no se encontro el asesor");
      }
      if (asesor) {
        const correoAsesor = asesor.correo;
        const nombreAsesor = asesor.primerNombre;
        const asunto = "Asignación de inmuble asesor";
        const mensaje = `Estimado/a ${asesor.primerNombre}, se le ha asigando un inmueble.

        Id del nuevo inmueble:${datos.idInmueble} ,



        Hasta pronto,
        Equipo Técnico,
        `;
        const datosContacto = {
          correoDestino: correoAsesor,
          nombreDestino: nombreAsesor,
          asuntoCorreo: asunto,
          contenidoCorreo: mensaje

        };

        const enviado = this.servicioNotificaciones.enviarNotificaciones(datosContacto, ConfiguracionNotificaciones.urlNotificaciones2fa);
        console.log(enviado);
        return enviado;
      } else {
        console.log("no se contro ninguna asesor con ese id:");
        return datos.idAsesor;
      }
    } catch (err) {
      console.log("El error es: " + err)
      throw new HttpErrors[500]("Error de servidor para enviar mensaje")
    }
  }

  @post('/eliminar-inmueble-asesor')
  @response(200, {
    description: 'se notifica al asesor que se le elimino un inmueble y se guarda en base de datos',
    content: {'aplicacion/json': {schema: getModelSchemaRef(DatosAsignacionInmuebleAsesor)}},
  })
  async EliminarInmueble(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DatosAsignacionInmuebleAsesor),
        },
      },
    })
    datos: DatosAsignacionInmuebleAsesor,
  ): Promise<Object> {
    try {
      const asesor = await this.repositorioAsesor.findOne({
        where: {
          id: datos.idAsesor
        }
      })
      if (asesor) {
        let idDato = asesor.inmuebleId?.indexOf(datos.idInmueble);

        if (idDato !== -1) {
          asesor.inmuebleId?.splice(idDato!, 1);
          await this.repositorioAsesor.update(asesor);
        }

        const correoAsesor = asesor.correo;
        const nombreAsesor = asesor.primerNombre;
        const asunto = "Eliminación de inmuble asesor";
        const mensaje = `Estimado/a ${asesor.primerNombre}, se le ha eliminado un inmueble.

        Id del nuevo inmueble:${datos.idInmueble} ,



        Hasta pronto,
        Equipo Técnico,
        `;
        const datosContacto = {
          correoDestino: correoAsesor,
          nombreDestino: nombreAsesor,
          asuntoCorreo: asunto,
          contenidoCorreo: mensaje
        };

        const enviado = this.servicioNotificaciones.enviarNotificaciones(datosContacto, ConfiguracionNotificaciones.urlNotificaciones2fa);
        console.log(enviado);
        return enviado;
      } else {
        console.log("no se contro ninguna asesor con ese id:");
        return datos.idAsesor;
      }
    } catch (err) {
      console.log("El error es: " + err)
      throw new HttpErrors[500]("Error de servidor para enviar mensaje")
    }

  }

  @post('/crear-inmueble-asesor')
  @response(200, {
    description: 'Envio del mensaje del formulario de contacto',
    content: {'aplicacion/json': {schema: getModelSchemaRef(Inmueble)}},
  })
  async ValidarPermisosDeUsuario(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Inmueble),
        },
      },
    })
    datos: Inmueble,
  ): Promise<boolean> {
    try {
      const variables: VariablesGeneralesDelSistema[] = await this.variablesRepository.find();
      if ((variables).length === 0) {
        throw new HttpErrors[500]("No hay variables del sistema para realizar el proceso");
      }

      let asesor = await this.asesorRepository.findOne({
        where: {
          correo: datos.correoAsesor
        }
      })
      if (asesor) {
        let inmuble = await this.inmuebleRepository.create({...datos, id: undefined});
        console.log("este el inmueble creado " + inmuble.id);

        const correoAdministrador = variables[0].correoContactoAdministrador;
        const nombreAdministrador = variables[0].nombreContactoAdministrador;
        const asunto = "Asesor ha creado un nuevo inmueble";
        const mensaje = `Estimado ${nombreAdministrador}, se ha enviado un
        mensaje desde el sitio web un asesor acabá de crear un nuevo inmueble:
        -----------
        Id de inmueble: ${inmuble.id}, ------------
        Id de Asesor: ${asesor.id}------

      Hasta pronto,
      Equipo Técnico,
      `;

        const datosContacto = {
          correoDestino: correoAdministrador,
          nombreDestino: nombreAdministrador,
          asuntoCorreo: asunto,
          contenidoCorreo: mensaje
        };

        if (inmuble) {
          let idAsesor = await this.repositorioAsesor.findById(asesor.id)
          if (idAsesor.inmuebleId === null) {
            idAsesor.inmuebleId = [];
          }
          if (idAsesor && idAsesor.inmuebleId) {
            idAsesor.inmuebleId.push(inmuble.id!);
            await this.repositorioAsesor.update(idAsesor);
          } else {
            console.log("no se encontro el asesor");
          }
        }

        const enviado = this.servicioNotificaciones.enviarNotificaciones(datosContacto, ConfiguracionNotificaciones.urlNotificacionesFormularioContacto);
        console.log(enviado);
        return enviado;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
      throw new HttpErrors[500]("Error de servidor para enviar mensaje")
    }
  }

  @post('/ver-inmuebles-asesor')
  @response(200, {
    description: 'Inmuebles que tiene asignados un asesor',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Asesor),
        },
      },
    },
  })
  async inmueblesDeAsesor(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AsesorId),
        },
      },
    })
    datos: AsesorId,
  ): Promise<Inmueble[]> {
    let asesor = await this.asesorRepository.findById(datos.idAsesor);

    if (!asesor) {
      throw new HttpErrors.NotFound('No se encuentra el asesor');
    }
    const inmuebles = await this.inmuebleRepository.find({
      where: {
        id: {
          inq: asesor.inmuebleId,
        },
      },
    });

    return inmuebles;

  }

}
