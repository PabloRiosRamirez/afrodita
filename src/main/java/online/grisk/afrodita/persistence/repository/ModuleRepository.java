package online.grisk.afrodita.persistence.repository;

import online.grisk.afrodita.domain.entity.Module;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ModuleRepository extends PagingAndSortingRepository<Module, Short> {
}