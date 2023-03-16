import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {TipoInmueble, TipoInmuebleRelations} from '../models';

export class TipoInmuebleRepository extends DefaultCrudRepository<
  TipoInmueble,
  typeof TipoInmueble.prototype.id,
  TipoInmuebleRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(TipoInmueble, dataSource);
  }
}
