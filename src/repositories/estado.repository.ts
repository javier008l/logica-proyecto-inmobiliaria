import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Contrato, Estado, EstadoRelations} from '../models';
import {ContratoRepository} from './contrato.repository';
import {SolicitudRepository} from './solicitud.repository';

export class EstadoRepository extends DefaultCrudRepository<
  Estado,
  typeof Estado.prototype.id,
  EstadoRelations
> {

  public readonly contratos: HasManyRepositoryFactory<Contrato, typeof Estado.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource, @repository.getter('ContratoRepository') protected contratoRepositoryGetter: Getter<ContratoRepository>, @repository.getter('SolicitudRepository') protected solicitudRepositoryGetter: Getter<SolicitudRepository>,
  ) {
    super(Estado, dataSource);

    this.contratos = this.createHasManyRepositoryFactoryFor('contratos', contratoRepositoryGetter,);
    this.registerInclusionResolver('contratos', this.contratos.inclusionResolver);
  }
}
