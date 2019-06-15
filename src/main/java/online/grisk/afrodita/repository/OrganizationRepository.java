package online.grisk.afrodita.repository;

import online.grisk.afrodita.entity.Organization;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrganizationRepository extends PagingAndSortingRepository<Organization, Long> {
    Organization findByRut(String rut);

}