import { /* inject, */ BindingScope, injectable} from '@loopback/core';

const fetch = require('node-fetch');
@injectable({scope: BindingScope.TRANSIENT})
export class NotificacionService {
  constructor(/* Add @inject to inject parameters */) { }

  /*
   * Add service methods here
   */

  enviarNotificaciones(datos: any, url: string): boolean {
    try {
      fetch(url, {
        method: 'post',
        body: JSON.stringify(datos),
        headers: {'Content-Type': 'application/json'},
      });
      return true;
    } catch {
      return false;
    }
  }
}

