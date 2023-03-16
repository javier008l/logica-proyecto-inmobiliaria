import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Contrato, ContratoRelations} from '../models';

export class ContratoRepository extends DefaultCrudRepository<
  Contrato,
  typeof Contrato.prototype.id,
  ContratoRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(Contrato, dataSource);
  }
}
