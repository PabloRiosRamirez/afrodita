package online.grisk.afrodita.persistence.repository;

import online.grisk.afrodita.domain.entity.User;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends PagingAndSortingRepository<User, Long> {
    User findByUsername(String username);
    User findByEmail(String email);
    User findByUsernameOrEmail(String username,String email);
    User findByEmailAndTokenRestart(String email, String tokenRestart);
    User findByTokenConfirm(String tokenConfirm);
    User findByTokenRestart(String tokenRestart);
}