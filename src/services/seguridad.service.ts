import {injectable, /* inject, */ BindingScope} from '@loopback/core';
const fetch = require('node-fetch');

@injectable({scope: BindingScope.TRANSIENT})
export class SeguridadService {
  constructor(/* Add @inject to inject parameters */) { }

  /*
   * Add service methods here
   */
  datosUsuario(datos: any, url: string): String {
    console.log("----------------------------------")
    console.log(datos);
    console.log(url);
    console.log("----------------------------------")
    try {
      fetch(url, {
        method: 'post',
        body: datos,
        headers: {'Content-Type': 'application/json'},
      });
      return datos;
    } catch (err){
      console.log(err);
      return "no se enviaron datos a seguridad";
    }
  }

}
