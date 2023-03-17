import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory, BelongsToAccessor} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Estado, EstadoRelations, Contrato, Solicitud} from '../models';
import {ContratoRepository} from './contrato.repository';
import {SolicitudRepository} from './solicitud.repository';

export class EstadoRepository extends DefaultCrudRepository<
  Estado,
  typeof Estado.prototype.id,
  EstadoRelations
> {

  public readonly contratos: HasManyRepositoryFactory<Contrato, typeof Estado.prototype.id>;

  public readonly solicitud: BelongsToAccessor<Solicitud, typeof Estado.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('ContratoRepository') protected contratoRepositoryGetter: Getter<ContratoRepository>, @repository.getter('SolicitudRepository') protected solicitudRepositoryGetter: Getter<SolicitudRepository>,
  ) {
    super(Estado, dataSource);
    this.solicitud = this.createBelongsToAccessorFor('solicitud', solicitudRepositoryGetter,);
    this.registerInclusionResolver('solicitud', this.solicitud.inclusionResolver);
    this.contratos = this.createHasManyRepositoryFactoryFor('contratos', contratoRepositoryGetter,);
    this.registerInclusionResolver('contratos', this.contratos.inclusionResolver);
  }
}
