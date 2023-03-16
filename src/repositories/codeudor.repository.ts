import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Codeudor, CodeudorRelations} from '../models';

export class CodeudorRepository extends DefaultCrudRepository<
  Codeudor,
  typeof Codeudor.prototype.id,
  CodeudorRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(Codeudor, dataSource);
  }
}
