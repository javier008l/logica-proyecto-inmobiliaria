import {injectable, /* inject, */ BindingScope} from '@loopback/core';
const fetch = require('node-fetch');

@injectable({scope: BindingScope.TRANSIENT})
export class SeguridadService {
  constructor(/* Add @inject to inject parameters */) { }

  /*
   * Add service methods here
   */
  datosUsuario(datos: any, url: string): String {
    try {
      fetch(url, {
        method: 'post',
        body: JSON.stringify(datos),
        headers: {'Content-Type': 'application/json'},
      });
      return datos;
    } catch {
      return "no se enviaron datos a seguridad";
    }
  }

}
