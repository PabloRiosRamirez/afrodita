package online.grisk.afrodita.persistence.repository;

import online.grisk.afrodita.domain.entity.Organization;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrganizationRepository extends PagingAndSortingRepository<Organization, Long> {
    Organization findByRut(String rut);

}