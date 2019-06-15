package online.grisk.afrodita.repository;

import online.grisk.afrodita.entity.Role;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends PagingAndSortingRepository<Role, Short> {
    Role findByCode(String code);
}