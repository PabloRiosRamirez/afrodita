package online.grisk.afrodita.repository;

import online.grisk.afrodita.entity.Module;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ModuleRepository extends PagingAndSortingRepository<Module, Short> {
}