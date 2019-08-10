package online.grisk.afrodita.persistence.repository;

import online.grisk.afrodita.domain.entity.User;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends PagingAndSortingRepository<User, Long> {
    User findByUsername(String username);

    User findByEmail(String email);

    User findByUsernameOrEmail(String username, String email);
    
    @Query("select u from user u where (u.username = ?1 or u.email = ?2) and u.organization.idOrganization = ?3")
    User findByUsernameOrEmailAndOrganizationId(String username, String email, long organizationId);
    
    User findByEmailAndTokenRestart(String email, String tokenRestart);

    User findByTokenConfirm(String tokenConfirm);

    User findByTokenRestart(String tokenRestart);
}