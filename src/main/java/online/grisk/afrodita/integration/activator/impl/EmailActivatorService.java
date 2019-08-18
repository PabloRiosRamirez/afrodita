package online.grisk.afrodita.integration.activator.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import online.grisk.afrodita.domain.dto.ResetPassDTO;
import online.grisk.afrodita.domain.dto.UserDTO;
import online.grisk.afrodita.domain.dto.UserRegistrationAdminDTO;
import online.grisk.afrodita.domain.dto.UserUpdateAdminDTO;
import online.grisk.afrodita.domain.pojo.Microservice;
import online.grisk.afrodita.domain.entity.User;
import online.grisk.afrodita.domain.service.ArtemisaService;
import online.grisk.afrodita.domain.service.OrganizationService;
import online.grisk.afrodita.domain.service.RoleService;
import online.grisk.afrodita.domain.service.UserService;
import online.grisk.afrodita.integration.activator.BasicRestServiceActivator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.Headers;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;

import javax.validation.constraints.NotNull;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class EmailActivatorService extends BasicRestServiceActivator {

	@Autowired
	UUID uuid;

	@Autowired
	Microservice microserviceArtemisa;
	
	@Autowired
	RoleService roleService;

	@Autowired
	OrganizationService organizationService;

	@Autowired
	UserService userService;

	@Autowired
	ArtemisaService artemisaService;

	@Autowired
	ObjectMapper objectMapper;

	// Action for 'sendEmailRegisterUser'
	public Map<String, Object> invokeEmailRegisterByLogin(@NotNull @Payload Map<String, Object> payload,
			@NotNull @Headers Map<String, Object> headers) throws Exception {
		UserDTO userDTO = objectMapper.convertValue(payload, UserDTO.class);
		if (artemisaService.isOrganizationValidForRegister(userDTO)) {
			if (artemisaService.isUsernameValidForRegister(userDTO)) {
				if (artemisaService.isEmailValidForRegister(userDTO)) {
					User user = artemisaService.registerUserAndOrganization(userDTO);
					ResponseEntity<JsonNode> responseEntity = consumerRestServiceActivator("/api/artemisa/email",
							HttpMethod.POST, buildRequestHermesByArtemisa(user.getEmail(), user.getTokenConfirm()),
							createHeadersWithAction(headers.getOrDefault("action", "").toString()),
							microserviceArtemisa);
					return addServiceResponseToResponseMap(payload, responseEntity.getBody(),
							responseEntity.getStatusCode(), microserviceArtemisa.getServiceId());
				} else {
					return addServiceResponseToResponseMap(buildResponseError("Email Already Exist"), null,
							HttpStatus.CONFLICT, microserviceArtemisa.getServiceId());
				}
			} else {
				return addServiceResponseToResponseMap(buildResponseError("Username Already Exist"), null,
						HttpStatus.CONFLICT, microserviceArtemisa.getServiceId());
			}
		} else {
			return addServiceResponseToResponseMap(buildResponseError("Organization Already Exist"), null,
					HttpStatus.CONFLICT, microserviceArtemisa.getServiceId());
		}
	}

	// Action for 'invokeEmailRegisterByAdmin'
	public Map<String, Object> invokeEmailRegisterByAdmin(@NotNull @Payload Map<String, Object> payload,
			@NotNull @Headers Map<String, Object> headers) throws Exception {
		UserRegistrationAdminDTO userRegistrationAdminDTO = objectMapper.convertValue(payload,
				UserRegistrationAdminDTO.class);
		if (organizationService.findOne(userRegistrationAdminDTO.getOrganizationId()) != null) {
			if (roleService.findOne(userRegistrationAdminDTO.getRoleId()) != null) {
				if (userService.findByUsername(userRegistrationAdminDTO.getUsername().toUpperCase()) == null) {
					if (userService.findByEmail(userRegistrationAdminDTO.getEmail()) == null) {
						User user = artemisaService.registerUserAdmin(userRegistrationAdminDTO);
						ResponseEntity<JsonNode> responseEntity = consumerRestServiceActivator("/api/artemisa/email",
								HttpMethod.POST, buildRequestHermesByArtemisa(user.getEmail(), user.getTokenConfirm()),
								createHeadersWithAction(headers.getOrDefault("action", "").toString()),
								microserviceArtemisa);
						return addServiceResponseToResponseMap(payload, responseEntity.getBody(),
								responseEntity.getStatusCode(), microserviceArtemisa.getServiceId());
					} else {
						return addServiceResponseToResponseMap(buildResponseError("Email Already Exist"), null,
								HttpStatus.CONFLICT, microserviceArtemisa.getServiceId());
					}
				} else {
					return addServiceResponseToResponseMap(buildResponseError("Username Already Exist"), null,
							HttpStatus.CONFLICT, microserviceArtemisa.getServiceId());
				}
			} else {
				return addServiceResponseToResponseMap(buildResponseError("Role Doesn't Exist"), null,
						HttpStatus.CONFLICT, microserviceArtemisa.getServiceId());
			}
		} else {
			return addServiceResponseToResponseMap(buildResponseError("Organization Doesn't Exist"), null,
					HttpStatus.CONFLICT, microserviceArtemisa.getServiceId());
		}
	}
	
	// Action for 'invokeEmailUpdateByAdmin'
	public Map<String, Object> invokeEmailUpdateByAdmin(@NotNull @Payload Map<String, Object> payload,
			@NotNull @Headers Map<String, Object> headers) throws Exception {
		UserUpdateAdminDTO userUpdateAdminDTO = objectMapper.convertValue(payload, UserUpdateAdminDTO.class);
		if (organizationService.findOne(userUpdateAdminDTO.getOrganizationId()) != null) {
			if (roleService.findOne(userUpdateAdminDTO.getRoleId()) != null) {
				
				User usrValid = userService.findByIdUser(userUpdateAdminDTO.getIdUser());
				
				String messageUsernameValidation = null;
				if(!usrValid.getUsername().toUpperCase().equals(userUpdateAdminDTO.getUsername().toUpperCase())) {
					if(userService.findByUsername(userUpdateAdminDTO.getUsername().toUpperCase()) != null) {
						messageUsernameValidation = "Username Already Exist";
					}
				}
				
				if (messageUsernameValidation == null) {
					
					String messageEmailValidation = null;
					if(!usrValid.getEmail().equals(userUpdateAdminDTO.getEmail())) {
						if(userService.findByUsername(userUpdateAdminDTO.getUsername().toUpperCase()) != null) {
							messageEmailValidation = "Email Already Exist";
						}
					}
					
					if (messageEmailValidation == null) {
						User user = artemisaService.updateUserAdmin(userUpdateAdminDTO);
						if(userUpdateAdminDTO.getResetPassword() == 1) {
							User userReseted = artemisaService.registerTokenForPostReset(user);
							ResponseEntity<JsonNode> responseEntity = consumerRestServiceActivator("/api/artemisa/email", HttpMethod.POST, buildRequestHermesByArtemisa(user.getEmail(), user.getTokenRestart()), createHeadersWithAction(headers.getOrDefault("action", "").toString()), microserviceArtemisa);
							return addServiceResponseToResponseMap(payload, responseEntity.getBody(), responseEntity.getStatusCode(), microserviceArtemisa.getServiceId());
						} else {
							return addServiceResponseToResponseMap(payload, user, HttpStatus.OK, microserviceArtemisa.getServiceId());
						}
					} else {
						return addServiceResponseToResponseMap(buildResponseError(messageEmailValidation), null,
								HttpStatus.CONFLICT, microserviceArtemisa.getServiceId());
					}
				} else {
					return addServiceResponseToResponseMap(buildResponseError(messageUsernameValidation), null,
							HttpStatus.CONFLICT, microserviceArtemisa.getServiceId());
				}
			} else {
				return addServiceResponseToResponseMap(buildResponseError("Role Doesn't Exist"), null,
						HttpStatus.CONFLICT, microserviceArtemisa.getServiceId());
			}
		} else {
			return addServiceResponseToResponseMap(buildResponseError("Organization Doesn't Exist"), null,
					HttpStatus.CONFLICT, microserviceArtemisa.getServiceId());
		}
	}

	// Action for 'sendEmailResetPassword'
	public Map<String, Object> invokeEmailResetPassByLogin(@NotNull @Payload Map<String, Object> payload,
			@NotNull @Headers Map<String, Object> headers) throws Exception {
		User userValidForResetPass = artemisaService.isUserValidForResetPass((Map<String, Object>) payload);
		if (userValidForResetPass != null) {
			User userReseted = artemisaService.registerTokenForPostReset(userValidForResetPass);
			ResponseEntity<JsonNode> responseEntity = consumerRestServiceActivator("/api/artemisa/email",
					HttpMethod.POST,
					buildRequestHermesByArtemisa(userValidForResetPass.getEmail(), userReseted.getTokenRestart()),
					createHeadersWithAction(headers.getOrDefault("action", "").toString()), microserviceArtemisa);
			if (userReseted != null)
				return addServiceResponseToResponseMap(payload, responseEntity.getBody(),
						responseEntity.getStatusCode(), microserviceArtemisa.getServiceId());
			else
				return addServiceResponseToResponseMap(payload, null, HttpStatus.INTERNAL_SERVER_ERROR,
						microserviceArtemisa.getServiceId());
		} else {
			return addServiceResponseToResponseMap(buildResponseError("Unregistered user"), new HashMap<>(),
					HttpStatus.CONFLICT, microserviceArtemisa.getServiceId());
		}
	}

	// Action for 'postResetPassword'
	public Map<String, Object> invokePostResetPassByLogin(@NotNull @Payload Map<String, Object> payload,
			@NotNull @Headers Map<String, Object> headers) throws Exception {
		ResetPassDTO resetPassDto = new ResetPassDTO(payload.get("email").toString(), payload.get("token").toString(),
				payload.get("pass").toString());
		User user = artemisaService.isUserValidForPostResetPass(resetPassDto);
		if (user != null) {
			user.setPass(artemisaService.encryte(resetPassDto.getPass()));
			if (artemisaService.registerUserWithNewPassword(user) != null)
				return addServiceResponseToResponseMap(payload, null, HttpStatus.OK,
						microserviceArtemisa.getServiceId());
			else
				return addServiceResponseToResponseMap(payload, null, HttpStatus.INTERNAL_SERVER_ERROR,
						microserviceArtemisa.getServiceId());
		} else {
			return addServiceResponseToResponseMap(buildResponseError("Unregistered user or token invalid"), null,
					HttpStatus.CONFLICT, microserviceArtemisa.getServiceId());
		}
	}

	private Map buildRequestHermesByArtemisa(String address, String token) {
		Map<String, Object> request = new HashMap<>();
		request.put("address", address);
		request.put("token", token);
		return request;
	}
}
