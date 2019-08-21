package online.grisk.afrodita.domain.service;

import lombok.Setter;
import online.grisk.afrodita.domain.dto.ResetPassDTO;
import online.grisk.afrodita.domain.dto.UserDTO;
import online.grisk.afrodita.domain.dto.UserRegistrationAdminDTO;
import online.grisk.afrodita.domain.dto.UserUpdateAdminDTO;
import online.grisk.afrodita.domain.entity.Organization;
import online.grisk.afrodita.domain.entity.Role;
import online.grisk.afrodita.domain.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.Map;

@Setter
@Service
public class ArtemisaService {

	@Autowired
	private UserService userService;

	@Autowired
	private OrganizationService organizationService;
	
	@Autowired
	private RoleService roleService;

	@Autowired
	private Role roleWithCodeAdmin;

	@Autowired
	private String token;

	@Autowired
	private BCryptPasswordEncoder encoderPassword;

	public boolean isUserValidForRegister(@Valid UserDTO userDTO) throws Exception {
		return userService.findByUsernameOrEmail(userDTO.getUsername(), userDTO.getEmail()) == null;
	}

	public boolean isUsernameValidForRegister(@Valid UserDTO userDTO) throws Exception {
		return userService.findByUsername(userDTO.getUsername()) == null;
	}

	public boolean isEmailValidForRegister(@Valid UserDTO userDTO) throws Exception {
		return userService.findByEmail(userDTO.getEmail()) == null;
	}

	public boolean isOrganizationValidForRegister(@Valid UserDTO userDTO) {
		return organizationService.findByRut(userDTO.getOrganization().getRut()) == null;
	}

	public User isUserValidForPostResetPass(@Valid ResetPassDTO resetPassDTO) throws Exception {
		return userService.findByUsernameOrEmail(resetPassDTO.getToken(), resetPassDTO.getEmail());
	}

	public User registerUserAndOrganization(@Valid UserDTO userDTO) throws Exception {
		return userService.save(new User(userDTO.getUsername().toUpperCase(), userDTO.getEmail().toUpperCase(),
				organizationService.save(
						new Organization(userDTO.getOrganization().getName(), userDTO.getOrganization().getRut())),
				encryte(userDTO.getPass()), null, token, false, true, new Date(), new Date(), roleWithCodeAdmin));
	}

	public User registerUserAdmin(@Valid UserRegistrationAdminDTO userRegistrationAdminDTO) throws Exception {
		return userService.save(new User(userRegistrationAdminDTO.getUsername().toUpperCase(), userRegistrationAdminDTO.getEmail().toUpperCase(),
				organizationService.findOne(userRegistrationAdminDTO.getOrganizationId()),
				encryte(userRegistrationAdminDTO.getPass()), null, token, false, true, new Date(), new Date(), roleService.findOne(userRegistrationAdminDTO.getRoleId())));
	}
	
	public User updateUserAdmin(UserUpdateAdminDTO userUpdateAdminDTO) throws Exception {
		User usr = userService.findByIdUser(userUpdateAdminDTO.getIdUser());
		usr.setUsername(userUpdateAdminDTO.getUsername().toUpperCase());
		usr.setEmail(userUpdateAdminDTO.getEmail().toUpperCase());
		return userService.save(usr);
	}

	public User registerUserWithNewPassword(@Valid User user) throws Exception {
		user.setTokenRestart(null);
		user.setEnabled(true);
		return userService.save(user);
	}

	public User registerTokenForPostReset(@NotNull User user) throws Exception {
		user.setTokenRestart(token);
		return userService.save(user);
	}

	public String encryte(@NotNull String key) {
		return encoderPassword.encode(key);
	}

	public User isUserValidForResetPass(@NotEmpty Map mapEmail) throws Exception {
		String email = mapEmail.getOrDefault("email", "").toString();
		if (!email.equals("")) {
			return userService.findByEmail(email);
		}
		return null;
	}
}
