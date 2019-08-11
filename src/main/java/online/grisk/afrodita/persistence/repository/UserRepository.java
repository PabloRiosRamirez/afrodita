package online.grisk.afrodita.persistence.repository;

import online.grisk.afrodita.domain.entity.User;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends PagingAndSortingRepository<User, Long> {
    User findByUsername(String username);

    User findByEmail(String email);

    User findByUsernameOrEmail(String username, String email);
    
    @Query("select u from User u where (u.username = ?1 or u.email = ?2) and u.organization.idOrganization = ?3")
    User findByUsernameOrEmailAndOrganizationId(String username, String email, long organizationId);
    
    User findByEmailAndTokenRestart(String email, String tokenRestart);

    User findByTokenConfirm(String tokenConfirm);

    User findByTokenRestart(String tokenRestart);
    
    @Query("select u from User u where u.organization.idOrganization = ?1")
    User findByOrganizationId(long organizationId);
    
    @Query("select u from User u where u.role.code = 'ADMIN' and u.nonLocked = true and u.organization.idOrganization = ?1")
    List<User> findAdminsByOrganizationId(long organizationId);
}