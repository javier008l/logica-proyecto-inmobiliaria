import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Estado, EstadoRelations} from '../models';

export class EstadoRepository extends DefaultCrudRepository<
  Estado,
  typeof Estado.prototype.id,
  EstadoRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(Estado, dataSource);
  }
}
