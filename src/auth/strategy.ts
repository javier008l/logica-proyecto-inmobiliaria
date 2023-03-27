import {AuthenticationBindings, AuthenticationMetadata, AuthenticationStrategy} from '@loopback/authentication';
import {inject} from '@loopback/context';
import {HttpErrors, Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import parseBearerToken from 'parse-bearer-token';
import {ConfiguracionSeguridad} from '../config/configuracion.seguridad';
const fetch = require('node-fetch');
// import {Request} from '@loopback/rest';

export class AuthStrategy implements AuthenticationStrategy {
  name = 'auth';

  constructor(
    @inject(AuthenticationBindings.METADATA)
    private metadata: AuthenticationMetadata[]
  ) { }
  /**
   * Autenticacion de un usuario frente a una accion en la base datos
   * @param request la solicitud con el token
   * @returns el perfil del usuario, undefined cuando no tiene permiso o un HttpError
   */
  async authenticate(request: Request): Promise<UserProfile | undefined> {
    const token = parseBearerToken(request);
    if (token) {
      let idMenu: string = this.metadata[0].options![0];
      let accion: string = this.metadata[0].options![1];
      console.log(this.metadata);

      //conectar con el ms-seguridad
      const datos = {token: token, idMenu: idMenu, accion: accion};
      const urlValidarPermisos = `${ConfiguracionSeguridad.enlaceMicroservicioSeguridad}/validar-permisos`;
      let res = undefined;
      try{
      await fetch(urlValidarPermisos, {
        method: 'post',
        body: JSON.stringify(datos),
        headers: {'Content-Type': 'application/json'},
      }).then((res: any) => res.json())
        .then((json: any) => {
          res = json;
        });
        if (res) {
          let perfil: UserProfile = Object.assign({
            permitido: "OK"
          });
          return perfil;
        } else {
          return undefined;
        }
      }catch (e){
        throw new HttpErrors[401]('No se tienen permisos sobre la acción a ejecutar.');
      }
    }
    throw new HttpErrors[401]('no es posible ejecurtar la accion por falta de un token');
  }
}
