package online.grisk.afrodita.repository;

import online.grisk.afrodita.entity.Endpoint;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EndpointRepository extends PagingAndSortingRepository<Endpoint, Short> {
}