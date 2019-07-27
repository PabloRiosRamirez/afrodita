package online.grisk.afrodita.integration.activator.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import online.grisk.afrodita.domain.dto.ResetPassDTO;
import online.grisk.afrodita.domain.dto.UserDTO;
import online.grisk.afrodita.domain.entity.ServiceActivator;
import online.grisk.afrodita.domain.entity.User;
import online.grisk.afrodita.domain.service.ArtemisaService;
import online.grisk.afrodita.integration.activator.BasicRestServiceActivator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
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
public class ArtemisaActivatorService extends BasicRestServiceActivator {

    @Autowired
    UUID uuid;

    @Autowired
    ServiceActivator serviceActivatorArtemisa;

    @Autowired
    ArtemisaService artemisaService;

    @Autowired
    ObjectMapper objectMapper;

    //    Action for 'sendEmailRegisterUser'
    public Map<String, Object> invokeEmailRegisterByLogin(@NotNull @Payload Map<String, Object> payload, @NotNull @Headers Map<String, Object> headers) throws Exception {
        UserDTO userDTO = objectMapper.convertValue(payload.get("request"), UserDTO.class);
        if (artemisaService.isOrganizationValidForRegister(userDTO)) {
            if (artemisaService.isUserValidForRegister(userDTO)) {
                User user = artemisaService.registerUserAndOrganization(userDTO);
                ResponseEntity<JsonNode> responseEntity = consumerRestServiceActivator(buildRequestHermesByArtemisa(user.getEmail(), user.getTokenConfirm()), createHeadersWithAction(headers.getOrDefault("action", "").toString()), serviceActivatorArtemisa);
                return addServiceResponseToResponseMap(payload, responseEntity.getBody(), responseEntity.getStatusCode(), serviceActivatorArtemisa.getServiceId());
            } else {
                return addServiceResponseToResponseMap(buildResponseError("Registered user"), null, HttpStatus.CONFLICT, serviceActivatorArtemisa.getServiceId());
            }
        } else {
            return addServiceResponseToResponseMap(buildResponseError("Registered organization"), null, HttpStatus.CONFLICT, serviceActivatorArtemisa.getServiceId());
        }
    }

    //    Action for 'sendEmailResetPassword'
    public Map<String, Object> invokeEmailResetPassByLogin(@NotNull @Payload Map<String, Object> payload, @NotNull @Headers Map<String, Object> headers) throws Exception {
        User userValidForResetPass = artemisaService.isUserValidForResetPass((Map<String, Object>) payload.get("request"));
        if (userValidForResetPass != null) {
            User userReseted = artemisaService.registerTokenForPostReset(userValidForResetPass);
            ResponseEntity<JsonNode> responseEntity = consumerRestServiceActivator(buildRequestHermesByArtemisa(userValidForResetPass.getEmail(), userReseted.getTokenRestart()), createHeadersWithAction(headers.getOrDefault("action", "").toString()), serviceActivatorArtemisa);
            if (userReseted != null)
                return addServiceResponseToResponseMap(payload, responseEntity.getBody(), responseEntity.getStatusCode(), serviceActivatorArtemisa.getServiceId());
            else
                return addServiceResponseToResponseMap(payload, null, HttpStatus.INTERNAL_SERVER_ERROR, serviceActivatorArtemisa.getServiceId());
        } else {
            return addServiceResponseToResponseMap(buildResponseError("Unregistered user"), new HashMap<>(), HttpStatus.CONFLICT, serviceActivatorArtemisa.getServiceId());
        }
    }

    //    Action for 'postResetPassword'
    public Map<String, Object> invokePostResetPassByLogin(@NotNull @Payload Map<String, Object> payload, @NotNull @Headers Map<String, Object> headers) throws Exception {
        User user = artemisaService.isUserValidForPostResetPass((ResetPassDTO) payload.get("request"));
        if (user != null) {
            user.setPass(artemisaService.encryte(user.getPass()));
            if (artemisaService.registerUserWithNewPassword(user) != null)
                return addServiceResponseToResponseMap(payload, null, HttpStatus.OK, serviceActivatorArtemisa.getServiceId());
            else
                return addServiceResponseToResponseMap(payload, null, HttpStatus.INTERNAL_SERVER_ERROR, serviceActivatorArtemisa.getServiceId());
        } else {
            return addServiceResponseToResponseMap(buildResponseError("Unregistered user or token invalid"), null, HttpStatus.CONFLICT, serviceActivatorArtemisa.getServiceId());
        }
    }


    private Map buildRequestHermesByArtemisa(String address, String token) {
        Map<String, Object> request = new HashMap<>();
        request.put("address", address);
        request.put("token", token);
        return request;
    }

    private Map buildResponseError(String error) {
        Map<String, Object> response = new HashMap<>();
        response.put("error", error);
        return response;
    }

    private Map createHeadersWithAction(String action) {
        Map<String, Object> headers = new HashMap<>();
        headers.put("action", action);
        return headers;
    }

    private ResponseEntity<JsonNode> consumerRestServiceActivator(@NotNull @Payload Map<String, Object> payload, @NotNull @Headers Map<String, Object> headers, @NotNull ServiceActivator serviceActivatorArtemisa) throws Exception {
        HttpEntity<Object> httpEntity = this.buildHttpEntity(payload, headers, serviceActivatorArtemisa);
        return this.executeRequest(serviceActivatorArtemisa, httpEntity);
    }
}
