package online.grisk.afrodita.persistence.repository;

import online.grisk.afrodita.domain.entity.Role;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends PagingAndSortingRepository<Role, Short> {
    Role findByCode(String code);
}