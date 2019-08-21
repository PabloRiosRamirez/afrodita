package online.grisk.afrodita.domain.service.impl;

import online.grisk.afrodita.domain.entity.User;
import online.grisk.afrodita.domain.service.UserService;
import online.grisk.afrodita.persistence.repository.UserRepository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

	@Autowired
	UserRepository userRepository;

	public User findByIdUser(Long user) throws Exception {
		try {
			return userRepository.findById(user).get();
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
			if(username != null) {
				username = username.toUpperCase();
			}
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
			User usr =  userRepository.findById(user.getIdUser()).get();
			usr.setCreateAt(user.getCreateAt());
			usr.setEmail(user.getEmail().toUpperCase());
			usr.setEnabled(user.isEnabled());
			usr.setIdUser(user.getIdUser());
			usr.setNonLocked(user.isNonLocked());
			usr.setOrganization(user.getOrganization());
			usr.setPass(user.getPass());
			usr.setRole(user.getRole());
			usr.setTokenConfirm(user.getTokenConfirm());
			usr.setTokenRestart(user.getTokenRestart());
			usr.setUpdateAt(user.getUpdateAt());
			usr.setUsername(user.getUsername().toUpperCase());
			return userRepository.save(usr);
		} catch (Exception e) {
			throw new Exception(e.getMessage());
		}
	}

	@Override
	public User findByUsernameOrEmailAndOrganizationId(String username, String email, long organizationId) throws Exception {
		try {
			return userRepository.findByUsernameOrEmailAndOrganizationId(username.toUpperCase(), email, organizationId);
		} catch (Exception e) {
			throw new Exception(e.getMessage());
		}
	}

	@Override
	public User activation(long id, boolean target) throws Exception {
		try {
			User user = userRepository.findById(id).get();
			user.setNonLocked(target);
			return userRepository.save(user);
		} catch (Exception e) {
			throw new Exception(e.getMessage());
		}
	}

	@Override
	public User findByOrganizationId(long organizationId) throws Exception {
		try {
			return userRepository.findByOrganizationId(organizationId);
		} catch (Exception e) {
			throw new Exception(e.getMessage());
		}
	}

	@Override
	public List<User> findAdminsByOrganizationId(long organizationId) throws Exception {
		try {
			return userRepository.findAdminsByOrganizationId(organizationId);
		} catch (Exception e) {
			throw new Exception(e.getMessage());
		}
	}
}
