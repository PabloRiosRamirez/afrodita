package online.grisk.afrodita.service.impl;

import online.grisk.afrodita.entity.User;
import online.grisk.afrodita.repository.UserRepository;
import online.grisk.afrodita.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

	@Autowired
	UserRepository userRepository;

	public User findByUsername(String username) {
		return userRepository.findByUsername(username);
	}
	public User findByEmail(String email) {
		return userRepository.findByEmail(email);
	}
	public User findByEmailAndTokenRestart(String email, String tokenRestart){
		return userRepository.findByEmailAndTokenRestart(email,tokenRestart);
	}
	public User save(User user) {
		return userRepository.save(user);
	}
	public User findByTokenConfirm(String tokenConfirm){
		return userRepository.findByTokenConfirm(tokenConfirm);
	}
	public User findByTokenRestart(String tokenRestart){
		return userRepository.findByTokenRestart(tokenRestart);
	}
}
