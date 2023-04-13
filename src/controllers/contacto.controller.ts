// Uncomment these imports to begin using these cool features!

import {service} from '@loopback/core';
import {getModelSchemaRef, post, requestBody, response} from '@loopback/rest';
import {ConfiguracionGeneral} from '../config/configuracion.general';
import {MensajeContacto} from '../models';
import {NotificacionService} from '../services';



// import {inject} from '@loopback/core';

export class ContactController {
  constructor(
    @service(NotificacionService)
    private notificacionService: NotificacionService,
  ) { }

  @post('/contact-form')
  @response(200, {
    description: 'Login user with credentials',
    content: {'application/json': {schema: getModelSchemaRef(MensajeContacto)}},
  })
  async recoveryPassword(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MensajeContacto),
        },
      },
    })
    message: MensajeContacto,
  ): Promise<boolean> {
    try {
      let a = ConfiguracionGeneral.correoAdministradorContacto; // cambiar por acceso a base de datos.
      let nombreAdm = ConfiguracionGeneral.administradorNombreContacto;
      let sujeto = 'Mensaje de Contacto';
      let contenido = `Hola ${nombreAdm}, <br /> Se ha recibido un mensaje de contacto desde el sitio web. La informaciÃ³n es la siguiente:<br /><br />
      <ul>
      <li><strong>Nombre: </strong>${MensajeContacto.name}</li>
      <li><strong>Celular</strong>${MensajeContacto.celular}</li>
      <li><strong>Correo</strong>${MensajeContacto.contactEmail}</li>
      <li><strong>Tipo de mensaje</strong>${MensajeContacto.messageType}</li>
      <li><strong>Correo</strong>${MensajeContacto.message}</li>
      </ul>

      Saludos cordiales,
      Equipo de soporte de la inmobiliaria!!! :-)
      `;
      let data = {
        destinyEmail: a,
        destinyName: nombreAdm,
        emailSubject: sujeto,
        emailBody: contenido,
      };
      this.notificacionService.sendNotification(
        data,
        ConfiguracionGeneral.urlNotificaciones2fa,
      );
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}

