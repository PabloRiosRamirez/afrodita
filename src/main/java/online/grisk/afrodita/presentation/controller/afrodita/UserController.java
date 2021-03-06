package online.grisk.afrodita.presentation.controller.afrodita;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.util.Assert;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import online.grisk.afrodita.domain.dto.UserDTO;
import online.grisk.afrodita.domain.dto.UserRegistrationAdminDTO;
import online.grisk.afrodita.domain.dto.UserUpdateAdminDTO;
import online.grisk.afrodita.domain.entity.Role;
import online.grisk.afrodita.domain.entity.User;
import online.grisk.afrodita.domain.service.RoleService;
import online.grisk.afrodita.domain.service.UserService;
import online.grisk.afrodita.integration.activator.impl.EmailActivatorService;

@RestController
public class UserController {

	@Autowired
	private UserService userService;
	
	@Autowired
	private RoleService roleService;

	@Autowired
	EmailActivatorService emailActivatorService;

	@RequestMapping(value = "/v1/rest/users", method = RequestMethod.POST)
	public ResponseEntity<?> createUser(@Valid @RequestBody UserRegistrationAdminDTO userRegistrationAdminDTO, Errors errors) {
		if (errors.hasErrors()) {
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		try {

			this.verifyParameters(userRegistrationAdminDTO.toMap());

			Map response = emailActivatorService.invokeEmailRegisterByAdmin(userRegistrationAdminDTO.toMap(), createHeadersWithAction("sendEmailRegisterUser"));
			return new ResponseEntity<>(response, HttpStatus.valueOf(Integer.parseInt(response.getOrDefault("status", "500").toString())));

		} catch (Exception e) {
			return new ResponseEntity<String>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@RequestMapping(value = "/v1/rest/users", method = RequestMethod.PATCH)
	public ResponseEntity<?> updateUser(@Valid @RequestBody UserUpdateAdminDTO userUpdateAdminDTO, Errors errors, Principal principal) {
		if (errors.hasErrors()) {
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		try {
			
			//validate if role is admin and is last supperuser, can't disable it
			User user = userService.findByIdUser(userUpdateAdminDTO.getIdUser());
			
			List<User> usersAdmins = userService.findAdminsByOrganizationId(user.getOrganization().getIdOrganization());
			
			Role role = roleService.findOne(userUpdateAdminDTO.getRoleId());
			
			if(usersAdmins.size() <= 1 && user.getRole().getCode().equalsIgnoreCase("ADMIN") && !user.getRole().getCode().equalsIgnoreCase(role.getCode())) {
				//return 409 confict .
				return new ResponseEntity<String>("You are last admin of organization, impossible disable you!!!", HttpStatus.CONFLICT);
			}
			
			boolean autoUpdate = false;
			
			String usernameLogged = principal.getName();
			
			String currentUsername = userService.findByIdUser(userUpdateAdminDTO.getIdUser()).getUsername();
			
			if(usernameLogged.equalsIgnoreCase(currentUsername)) {
				autoUpdate = true;
			}
			
			this.verifyParameters(userUpdateAdminDTO.toMap());

			Map response = emailActivatorService.invokeEmailUpdateByAdmin(userUpdateAdminDTO.toMap(), createHeadersWithAction("sendEmailResetPassword"));
			response.put("autoUpdate", autoUpdate);
			return new ResponseEntity<>(response, HttpStatus.valueOf(Integer.parseInt(response.getOrDefault("status", "500").toString())));

		} catch (Exception e) {
			return new ResponseEntity<String>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@RequestMapping(value = "/v1/rest/users/search", method = RequestMethod.GET)
	public ResponseEntity<?> search(@RequestParam(name = "username", required = true) String username, @RequestParam(name = "email", required = true) String email, @RequestParam(name = "organizationId", required = false) Long organizationId) {
		User user = null;
		try {
			if ((username == null && email == null) || (username.isEmpty() && email.isEmpty())) {
				return new ResponseEntity<String>("Debe ingresar al menos un parametro de busqueda: [username,email]", HttpStatus.INTERNAL_SERVER_ERROR);
			}
			
			if(organizationId != null) {
				user = userService.findByUsernameOrEmailAndOrganizationId(username, email, organizationId);
			} else {
				user = userService.findByUsernameOrEmail(username, email);
			}
			
			return user == null ? new ResponseEntity<Object>(HttpStatus.NOT_FOUND) : new ResponseEntity<Object>(user, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<String>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@RequestMapping(value = "/v1/rest/users/{id}/activation", method = RequestMethod.POST)
	public ResponseEntity<?> userActivation(@PathVariable("id") long id, @RequestBody Map<String, Object> body , Errors errors, Principal principal) {
		if (errors.hasErrors()) {
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		try {
			User user = userService.findByIdUser(id);
			
			List<User> usersAdmins = userService.findAdminsByOrganizationId(user.getOrganization().getIdOrganization());
			
			if(usersAdmins.size() <= 1) {
				return new ResponseEntity<String>("You are last admin of organization, impossible disable you!!!", HttpStatus.CONFLICT);
			}
			
			boolean target = Boolean.parseBoolean(body.get("target").toString());
			
			boolean autoUpdate = false;
			
			String usernameLogged = principal.getName();
			
			String currentUsername = user.getUsername();
			
			if(usernameLogged.equalsIgnoreCase(currentUsername)) {
				autoUpdate = true;
			}
			
			User usr = userService.activation(id, target);
			Map<String, Object> map = new HashMap<>();
			map.put("response", usr);
			map.put("autoUpdate", autoUpdate);
			return new ResponseEntity<>(map, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<String>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	private void verifyParameters(Map payload) {
		Assert.notEmpty(payload, "Payload required");
	}

	private Map createHeadersWithAction(String action) {
		Map<String, Object> headers = new HashMap<>();
		headers.put("action", action);
		return headers;
	}
}
