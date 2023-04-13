import { /* inject, */ BindingScope, injectable} from '@loopback/core';

const fetch = require('node-fetch');
@injectable({scope: BindingScope.TRANSIENT})
export class NotificacionService {
  constructor(/* Add @inject to inject parameters */) { }

  /*
   * Add service methods here
   */

  sendNotification(data: any, url: string) {
    fetch(url, {
      method: 'post',
      body: JSON.stringify(data),
      headers: {'Content-Type': 'application/json'},
    });
  }
}

