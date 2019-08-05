package online.grisk.afrodita.integration.activator.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import online.grisk.afrodita.domain.dto.ResetPassDTO;
import online.grisk.afrodita.domain.dto.UserDTO;
import online.grisk.afrodita.domain.entity.Microservice;
import online.grisk.afrodita.domain.entity.User;
import online.grisk.afrodita.domain.service.ArtemisaService;
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
    ArtemisaService artemisaService;

    @Autowired
    ObjectMapper objectMapper;

    //    Action for 'sendEmailRegisterUser'
    public Map<String, Object> invokeEmailRegisterByLogin(@NotNull @Payload Map<String, Object> payload, @NotNull @Headers Map<String, Object> headers) throws Exception {
        UserDTO userDTO = objectMapper.convertValue(payload, UserDTO.class);
        if (artemisaService.isOrganizationValidForRegister(userDTO)) {
            if (artemisaService.isUsernameValidForRegister(userDTO)) {
            	 if (artemisaService.isEmailValidForRegister(userDTO)) {
	                User user = artemisaService.registerUserAndOrganization(userDTO);
	                ResponseEntity<JsonNode> responseEntity = consumerRestServiceActivator("/api/artemisa/email", HttpMethod.POST, buildRequestHermesByArtemisa(user.getEmail(), user.getTokenConfirm()), createHeadersWithAction(headers.getOrDefault("action", "").toString()), microserviceArtemisa);
	                return addServiceResponseToResponseMap(payload, responseEntity.getBody(), responseEntity.getStatusCode(), microserviceArtemisa.getServiceId());
            	 } else {
            		 return addServiceResponseToResponseMap(buildResponseError("Email Already Exist"), null, HttpStatus.CONFLICT, microserviceArtemisa.getServiceId());
            	 }
            } else {
                return addServiceResponseToResponseMap(buildResponseError("Username Already Exist"), null, HttpStatus.CONFLICT, microserviceArtemisa.getServiceId());
            }
        } else {
            return addServiceResponseToResponseMap(buildResponseError("Organization Already Exist"), null, HttpStatus.CONFLICT, microserviceArtemisa.getServiceId());
        }
    }

    //    Action for 'sendEmailResetPassword'
    public Map<String, Object> invokeEmailResetPassByLogin(@NotNull @Payload Map<String, Object> payload, @NotNull @Headers Map<String, Object> headers) throws Exception {
        User userValidForResetPass = artemisaService.isUserValidForResetPass((Map<String, Object>) payload);
        if (userValidForResetPass != null) {
            User userReseted = artemisaService.registerTokenForPostReset(userValidForResetPass);
            ResponseEntity<JsonNode> responseEntity = consumerRestServiceActivator("/api/artemisa/email", HttpMethod.POST, buildRequestHermesByArtemisa(userValidForResetPass.getEmail(), userReseted.getTokenRestart()), createHeadersWithAction(headers.getOrDefault("action", "").toString()), microserviceArtemisa);
            if (userReseted != null)
                return addServiceResponseToResponseMap(payload, responseEntity.getBody(), responseEntity.getStatusCode(), microserviceArtemisa.getServiceId());
            else
                return addServiceResponseToResponseMap(payload, null, HttpStatus.INTERNAL_SERVER_ERROR, microserviceArtemisa.getServiceId());
        } else {
            return addServiceResponseToResponseMap(buildResponseError("Unregistered user"), new HashMap<>(), HttpStatus.CONFLICT, microserviceArtemisa.getServiceId());
        }
    }

    //    Action for 'postResetPassword'
    public Map<String, Object> invokePostResetPassByLogin(@NotNull @Payload Map<String, Object> payload, @NotNull @Headers Map<String, Object> headers) throws Exception {
    	ResetPassDTO resetPassDto = new ResetPassDTO(payload.get("email").toString(), payload.get("token").toString(), payload.get("pass").toString());
    	User user = artemisaService.isUserValidForPostResetPass(resetPassDto);
        if (user != null) {
            user.setPass(artemisaService.encryte(resetPassDto.getPass()));
            if (artemisaService.registerUserWithNewPassword(user) != null)
                return addServiceResponseToResponseMap(payload, null, HttpStatus.OK, microserviceArtemisa.getServiceId());
            else
                return addServiceResponseToResponseMap(payload, null, HttpStatus.INTERNAL_SERVER_ERROR, microserviceArtemisa.getServiceId());
        } else {
            return addServiceResponseToResponseMap(buildResponseError("Unregistered user or token invalid"), null, HttpStatus.CONFLICT, microserviceArtemisa.getServiceId());
        }
    }

    private Map buildRequestHermesByArtemisa(String address, String token) {
        Map<String, Object> request = new HashMap<>();
        request.put("address", address);
        request.put("token", token);
        return request;
    }
}
