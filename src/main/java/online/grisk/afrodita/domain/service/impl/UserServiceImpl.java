package online.grisk.afrodita.domain.service.impl;

import online.grisk.afrodita.domain.entity.User;
import online.grisk.afrodita.domain.service.UserService;
import online.grisk.afrodita.persistence.repository.UserRepository;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

	@Autowired
	UserRepository userRepository;

	public Optional<User> findByIdUser(Long user) throws Exception {
		try {
			return userRepository.findById(user);
		} catch (Exception e) {
			throw new Exception(e.getMessage());
		}
	}

	public User findByUsername(String username) throws Exception {
		try {
			return userRepository.findByUsername(username);
		} catch (Exception e) {
			throw new Exception(e.getMessage());
		}

	}

	public User findByEmail(String email) throws Exception {
		try {
			return userRepository.findByEmail(email);
		} catch (Exception e) {
			throw new Exception(e.getMessage());
		}
	}

	public User findByUsernameOrEmail(String username, String email) throws Exception {
		try {
			return userRepository.findByUsernameOrEmail(username, email);
		} catch (Exception e) {
			throw new Exception(e.getMessage());
		}

	}

	public User findByEmailAndTokenRestart(String email, String tokenRestart) throws Exception {
		try {
			return userRepository.findByEmailAndTokenRestart(email, tokenRestart);
		} catch (Exception e) {
			throw new Exception(e.getMessage());
		}

	}

	public User save(User user) throws Exception {
		try {
			return userRepository.save(user);
		} catch (Exception e) {
			throw new Exception(e.getMessage());
		}

	}

	public User findByTokenConfirm(String tokenConfirm) throws Exception {
		try {
			return userRepository.findByTokenConfirm(tokenConfirm);
		} catch (Exception e) {
			throw new Exception(e.getMessage());
		}
	}

	public User findByTokenRestart(String tokenRestart) throws Exception {
		try {
			return userRepository.findByTokenRestart(tokenRestart);
		} catch (Exception e) {
			throw new Exception(e.getMessage());
		}
	}

	@Override
	public User update(User user) throws Exception {
		try {
			Optional<User> usr =  userRepository.findById(user.getIdUser());
			User uf = usr.get();
			
		} catch (Exception e) {
			throw new Exception(e.getMessage());
		}
	}
}
