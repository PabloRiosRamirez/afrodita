package online.grisk.afrodita.service;

import online.grisk.afrodita.entity.User;

public interface UserService {
	public User findByUsername(String username);
	public User findByEmail(String email);
	public User findByEmailAndTokenRestart(String email, String tokenRestart);
	public User save(User user);
	public User findByTokenConfirm(String tokenConfirm);
	public User findByTokenRestart(String tokenRestart);
}
