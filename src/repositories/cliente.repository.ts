import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Cliente, ClienteRelations, Solicitud, Contrato} from '../models';
import {SolicitudRepository} from './solicitud.repository';
import {ContratoRepository} from './contrato.repository';

export class ClienteRepository extends DefaultCrudRepository<
  Cliente,
  typeof Cliente.prototype.id,
  ClienteRelations
> {

  public readonly solicitudes: HasManyRepositoryFactory<Solicitud, typeof Cliente.prototype.id>;

  public readonly contratos: HasManyRepositoryFactory<Contrato, typeof Cliente.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('SolicitudRepository') protected solicitudRepositoryGetter: Getter<SolicitudRepository>, @repository.getter('ContratoRepository') protected contratoRepositoryGetter: Getter<ContratoRepository>,
  ) {
    super(Cliente, dataSource);
    this.contratos = this.createHasManyRepositoryFactoryFor('contratos', contratoRepositoryGetter,);
    this.registerInclusionResolver('contratos', this.contratos.inclusionResolver);
    this.solicitudes = this.createHasManyRepositoryFactoryFor('solicitudes', solicitudRepositoryGetter,);
    this.registerInclusionResolver('solicitudes', this.solicitudes.inclusionResolver);
  }
}
