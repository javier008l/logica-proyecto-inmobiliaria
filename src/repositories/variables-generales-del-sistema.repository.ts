import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {VariablesGeneralesDelSistema, VariablesGeneralesDelSistemaRelations} from '../models';

export class VariablesGeneralesDelSistemaRepository extends DefaultCrudRepository<
  VariablesGeneralesDelSistema,
  typeof VariablesGeneralesDelSistema.prototype.id,
  VariablesGeneralesDelSistemaRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(VariablesGeneralesDelSistema, dataSource);
  }
}
