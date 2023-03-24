import {AuthenticationBindings, AuthenticationMetadata, AuthenticationStrategy} from '@loopback/authentication';
import {inject} from '@loopback/context';
import {UserProfile} from '@loopback/security';
import {HttpErrors,Request} from '@loopback/rest';
import parseBearerToken from 'parse-bearer-token';
// import {Request} from '@loopback/rest';

export class AuthStrategy implements AuthenticationStrategy {
  name = 'auth';

  constructor(
    @inject(AuthenticationBindings.METADATA)
    private metadata: AuthenticationMetadata[]
  ) {}
  /**
   * Autenticacion de un usuario frente a una accion en la base datos
   * @param request la solicitud con el token
   * @returns el perfil del usuario, undefined cuando no tiene permiso o un HttpError
   */
  async authenticate(request: Request): Promise<UserProfile | undefined> {
    const token = parseBearerToken(request);
    if (token) {
      const idMenu: string = this.metadata[0].options![0];
      const accion: string = this.metadata[0].options![1];
      console.log(this.metadata);

      //conectar con el ms-seguridad
      console.log("conectar con ms-seguridad");

      let continuar: Boolean = false;
      if(continuar){
        let perfil: UserProfile = Object.assign({
          permitido: "OK"
        });
        return perfil;
      }else{
        return undefined;
      }
    }
    throw new HttpErrors[401]('no es posible ejecurtar la accion por falta de un token');
  }
}
