package online.grisk.afrodita.domain.service;

import java.util.Optional;

import online.grisk.afrodita.domain.entity.User;

public interface UserService {
	public User findByIdUser(Long user) throws Exception;

	public User findByUsername(String username) throws Exception;

	public User findByEmail(String email) throws Exception;

	public User findByUsernameOrEmail(String username, String email) throws Exception;

	public User findByEmailAndTokenRestart(String email, String tokenRestart) throws Exception;

	public User save(User user) throws Exception;

	public User findByTokenConfirm(String tokenConfirm) throws Exception;

	public User findByTokenRestart(String tokenRestart) throws Exception;

	public User update(User user) throws Exception;
	
	public User findByUsernameOrEmailAndOrganizationId(String username, String email, long organizationId) throws Exception;
	
	public User activation(long id, boolean target) throws Exception;
	
	public User findByOrganizationId(long organizationId) throws Exception;
	
}
