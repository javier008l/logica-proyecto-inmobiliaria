// Uncomment these imports to begin using these cool features!

import {service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors, getModelSchemaRef, post, requestBody, response} from '@loopback/rest';
import {ConfiguracionNotificaciones} from '../config/configuracion.notificaciones';
import {Asesor, ContactoCliente, FormularioAsesor, FormularioContacto, VariablesGeneralesDelSistema} from '../models';
import {AsesorRepository, ClienteRepository, InmuebleRepository, VariablesGeneralesDelSistemaRepository} from '../repositories';
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
    private respositorioAsesor: AsesorRepository,
    @repository(ClienteRepository)
    private clienteRepositorio: ClienteRepository,
    @repository(InmuebleRepository)
    private inmuebleRepositorio: InmuebleRepository,
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
      if ((variables).length === 0) {
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

      Dirrección del inmueble: ${datos.direccionInmueble}

      Costo por el cual deseo vender o alquilar: ${datos.costo}

      alquiler: ${datos.paraAlquiler}

      venta: ${datos.paraVenta}

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
    } catch (e) {
      console.log(e);
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
      if ((variables).length === 0) {
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


      const enviado = this.servicioNotificaciones.enviarNotificaciones(datosContacto, ConfiguracionNotificaciones.urlNotificacionesInfoAsesor);
      console.log(enviado);
      return enviado;
    } catch {
      throw new HttpErrors[500]("Error de servidor para enviar mensaje")
    }
  }

  @post('/contactar-cliente')
  @response(200, {
    description: 'Envio del mensaje de asesor a un cliente',
    content: {'aplicacion/json': {schema: getModelSchemaRef(FormularioAsesor)}},
  })
  async contactarCliente(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ContactoCliente),
        },
      },
    })
    datos: ContactoCliente,
  ): Promise<boolean> {
    try {
      let cliente = await this.clienteRepositorio.findOne({
        where: {
          correo: datos.correoCliente
        }
      })
      let asesor = await this.respositorioAsesor.findOne({
        where: {
          correo: datos.correoAsesor
        }
      })
      if (cliente) {
        if (asesor) {
          const correoCliente = datos.correoCliente;
          const nombreCliente = cliente.primerNombre;
          const asunto = datos.asuntoCorreo
          const mensaje = `Estiamd@ ${nombreCliente}.
          El motivo por el cual le hablamos es: ${datos.motivoMensaje},

          recuerde que l@ acaba de contactar: ${asesor.primerNombre},

          me puede contactar vía correo electronico o a traves del celular;
          mi correo es: ${asesor.correo},
          mi número de celular es: ${asesor.telefono}.



          Hasta pronto,
          ,
          `;

          const datosContacto = {
            correoDestino: correoCliente,
            nombreDestino: nombreCliente,
            asuntoCorreo: asunto,
            contenidoCorreo: mensaje
          };


          const enviado = this.servicioNotificaciones.enviarNotificaciones(datosContacto, ConfiguracionNotificaciones.urlNotificacionesInfoAsesor);
          console.log(enviado);
          return enviado;
        }else{
          console.log("correo asesor no encontrado");
          return false
        }
      } else {
        console.log("no se pudo contactar al usuario. Usuario no encontrado")
        return false
      }
    } catch {
      throw new HttpErrors[500]("Error de servidor para enviar mensaje")
    }
  }

}
