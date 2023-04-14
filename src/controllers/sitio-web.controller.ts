// Uncomment these imports to begin using these cool features!

import {service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors, getModelSchemaRef, post, requestBody, response} from '@loopback/rest';
import {ConfiguracionNotificaciones} from '../config/configuracion.notificaciones';
import {FormularioContacto, VariablesGeneralesDelSistema} from '../models';
import {VariablesGeneralesDelSistemaRepository} from '../repositories';
import {NotificacionService} from '../services';

// import {inject} from '@loopback/core';


export class SitioWebController {
  constructor(
    @repository(VariablesGeneralesDelSistemaRepository)
    private variablesRepository: VariablesGeneralesDelSistemaRepository,
    @service(NotificacionService)
    private servicioNotificaciones: NotificacionService
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
      let variables: VariablesGeneralesDelSistema[] = await this.variablesRepository.find();
      if ((variables).length == 0) {
        throw new HttpErrors[500]("No hay variables del sistema para realizar el proceso");
      }
      let correoAdministrador = variables[0].correoContactoAdministrador;
      let nombreAdministrador = variables[0].nombreContactoAdministrador;
      let asunto = "Contacto desde sitio web";
      let mensaje = `Estimado ${nombreAdministrador}, se ha enviad un mensaje desde el sitio web con la siguiente información:

      Nombre: ${datos.nombreCompleto}
      Correo: ${datos.correo}
      Celular: ${datos.celular}
      Tipo de Mensaje: ${datos.tipoMensaje}

      Texto del mensaje: ${datos.mensaje}

      Hasta pronto,
      Equipo Técnico,
      `;

      let datosContacto = {
        correoDestino: correoAdministrador,
        nombreDestino: nombreAdministrador,
        asuntoCorreo: asunto,
        contenidoCorreo: mensaje
      };


      let enviado = this.servicioNotificaciones.enviarNotificaciones(datosContacto, ConfiguracionNotificaciones.urlNotificaciones2fa);
      console.log(enviado);
      return enviado;
    } catch {
      throw new HttpErrors[500]("Error de servidor para enviar mensaje")
    }
  }
}
