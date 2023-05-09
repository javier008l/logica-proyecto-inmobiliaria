// Uncomment these imports to begin using these cool features!

import {service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors, getModelSchemaRef, post, requestBody, response} from '@loopback/rest';
import {ConfiguracionNotificaciones} from '../config/configuracion.notificaciones';
import {FormularioAsesor, FormularioContacto, VariablesGeneralesDelSistema} from '../models';
import {AsesorRepository, VariablesGeneralesDelSistemaRepository} from '../repositories';
import {NotificacionService, SeguridadService} from '../services';

// import {inject} from '@loopback/core';


export class SitioWebController {
  constructor(
    @repository(VariablesGeneralesDelSistemaRepository)
    private variablesRepository: VariablesGeneralesDelSistemaRepository,
    @service(NotificacionService)
    private servicioNotificaciones: NotificacionService,
    @service(SeguridadService)
    private servicioSeguridad: SeguridadService,
    @repository(AsesorRepository)
    private respositorioAsesor: AsesorRepository
  ) {
  }

  @post('/enviar-mensaje-FormularioContacto')
  @response(200, {
    description: 'Envio del mensaje del formulario de contacto',
    content: {'aplicacion/json': {schema: getModelSchemaRef(FormularioContacto)}},
  })
  async ValidarPermisosDeUsuario(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FormularioContacto),
        },
      },
    })
    datos: FormularioContacto,
  ): Promise<boolean> {
    try {
      const variables: VariablesGeneralesDelSistema[] = await this.variablesRepository.find();
      if ((variables).length == 0) {
        throw new HttpErrors[500]("No hay variables del sistema para realizar el proceso");
      }
      const correoAdministrador = variables[0].correoContactoAdministrador;
      const nombreAdministrador = variables[0].nombreContactoAdministrador;
      const asunto = "Contacto desde sitio web";
      const mensaje = `Estimado ${nombreAdministrador}, se ha enviad un mensaje desde el sitio web con la siguiente información:

      Nombre: ${datos.nombreCompleto}
      Correo: ${datos.correo}
      Celular: ${datos.celular}
      Tipo de Mensaje: ${datos.tipoMensaje}

      Texto del mensaje: ${datos.mensaje}

      Hasta pronto,
      Equipo Técnico,
      `;

      const datosContacto = {
        correoDestino: correoAdministrador,
        nombreDestino: nombreAdministrador,
        asuntoCorreo: asunto,
        contenidoCorreo: mensaje
      };


      const enviado = this.servicioNotificaciones.enviarNotificaciones(datosContacto, ConfiguracionNotificaciones.urlNotificaciones2fa);
      console.log(enviado);
      return enviado;
    } catch {
      throw new HttpErrors[500]("Error de servidor para enviar mensaje")
    }
  }


  @post('/registro-publico-asesor')
  @response(200, {
    description: 'Envio del mensaje de solicituda para ser asesor',
    content: {'aplicacion/json': {schema: getModelSchemaRef(FormularioAsesor)}},
  })
  async ValidarPermisosDeAsesor(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FormularioAsesor),
        },
      },
    })
    datos: FormularioAsesor,
  ): Promise<boolean> {
    try {
      const variables: VariablesGeneralesDelSistema[] = await this.variablesRepository.find();
      if ((variables).length == 0) {
        throw new HttpErrors[500]("No hay variables del sistema para realizar el proceso");
      }
      const correoAdministrador = variables[0].correoContactoAdministrador;
      const nombreAdministrador = variables[0].nombreContactoAdministrador;
      const asunto = "Contacto desde sitio web";
      const mensaje = `Estimado/a ${nombreAdministrador}, se ha enviado un mensaje desde el sitio web para
      crear crendeciales de asesor a:

      Nombre Completo: ${datos.nombreCompleto}
      Apellidos Completos : ${datos.apellidoCompleto}
      Cedula: ${datos.cedula}
      Correo: ${datos.correo}
      Número de celular: ${datos.celular}
      Dirección: ${datos.direccion}

      Hasta pronto,
      Equipo Técnico,
      `;

      const datosContacto = {
        correoDestino: correoAdministrador,
        nombreDestino: nombreAdministrador,
        asuntoCorreo: asunto,
        contenidoCorreo: mensaje
      };


      const enviado = this.servicioNotificaciones.enviarNotificaciones(datosContacto, ConfiguracionNotificaciones.urlNotificaciones2fa);
      console.log(enviado);
      return enviado;
    } catch {
      throw new HttpErrors[500]("Error de servidor para enviar mensaje")
    }
  }

}
