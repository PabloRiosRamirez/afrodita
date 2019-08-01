package online.grisk.afrodita.integration.activator.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import online.grisk.afrodita.domain.dto.FileDataIntegrationDTO;
import online.grisk.afrodita.domain.dto.ResetPassDTO;
import online.grisk.afrodita.domain.dto.UserDTO;
import online.grisk.afrodita.domain.entity.ServiceActivator;
import online.grisk.afrodita.domain.entity.User;
import online.grisk.afrodita.domain.service.ArtemisaService;
import online.grisk.afrodita.integration.activator.BasicRestServiceActivator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.messaging.handler.annotation.Headers;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.io.IOException;
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

    //    Action for 'registerDataIntegrationExcel'
    public Map<String, Object> invokeRegisterDataIntegrationExcel(@NotNull @Payload Map<String, Object> payload, @NotNull @Headers Map<String, Object> headers) throws Exception {
        ResponseEntity<JsonNode> responseEntity = consumerRestServiceActivator((Map<String, Object>) payload.get("request"), createHeadersWithAction(headers.getOrDefault("action", "").toString()), serviceActivatorArtemisa);
        return addServiceResponseToResponseMap(payload, responseEntity.getBody().get("current_response"), responseEntity.getStatusCode(), serviceActivatorArtemisa.getServiceId());
    }

    //    Action for 'updateDataIntegrationExcel'
    public Map<String, Object> invokeUpdateDataIntegrationExcel(@NotNull @Payload Map<String, Object> payload, @NotNull @Headers Map<String, Object> headers) throws Exception {
        FileDataIntegrationDTO fileDataIntegrationDTO = new FileDataIntegrationDTO((Map<String, Object>) payload.get("request"));
        ResponseEntity<JsonNode> responseEntity = consumerDataIntegrationRestServiceActivator("/api/artemisa/data-integration/" + fileDataIntegrationDTO.getId_organization(), HttpMethod.PUT, payload, createHeadersWithAction(headers.getOrDefault("action", "").toString()), serviceActivatorArtemisa);
        return addServiceResponseToResponseMap(payload, responseEntity.getBody(), responseEntity.getStatusCode(), serviceActivatorArtemisa.getServiceId());
    }

    //    Action for 'getDataIntegrationExcel'
    public Map<String, Object> invokeGetDataIntegration(@NotNull Long id_organization) throws Exception {
        ResponseEntity<Map> responseEntity = consumerRestServiceActivator("/api/artemisa/data-integration/organization/" + id_organization, HttpMethod.GET, new HashMap<>(), new HashMap<>(), serviceActivatorArtemisa);
        return addServiceResponseToResponseMap(new HashMap<>(), responseEntity.getBody(), responseEntity.getStatusCode(), serviceActivatorArtemisa.getServiceId());
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

    private ResponseEntity<Map> consumerRestServiceActivator(@NotBlank String path, @NotNull HttpMethod method, @NotNull @Payload Map<String, Object> payload, @NotNull @Headers Map<String, Object> headers, @NotNull ServiceActivator serviceActivatorArtemisa) throws Exception {
        HttpEntity<Object> httpEntity = this.buildHttpEntity(payload, headers, serviceActivatorArtemisa);
        return this.executeRequest(path, method, serviceActivatorArtemisa, httpEntity);
    }

    private ResponseEntity<JsonNode> consumerRestServiceActivator(@NotNull @Payload Map<String, Object> payload, @NotNull @Headers Map<String, Object> headers, @NotNull ServiceActivator serviceActivatorArtemisa) throws Exception {
        HttpEntity<Object> httpEntity = this.buildHttpEntity(payload, headers, serviceActivatorArtemisa);
        return this.executeRequest(serviceActivatorArtemisa, httpEntity);
    }

    private ResponseEntity<Map> consumerDataIntegrationRestServiceActivator(@NotBlank String path, @NotNull HttpMethod method, @NotNull @Payload Map<String, Object> payload, @NotNull @Headers Map<String, Object> headers, @NotNull ServiceActivator serviceActivatorArtemisa) throws Exception {
        HttpEntity<Object> httpEntity = this.buildHttpEntityMultipart(payload, headers, serviceActivatorArtemisa);
        return this.executeRequest(path, method, serviceActivatorArtemisa, httpEntity);
    }

    private HttpEntity<Object> buildHttpEntityMultipart(Map<String, Object> payload, Map<String, Object> headers, ServiceActivator serviceActivator) throws IOException {
        FileDataIntegrationDTO fileDataIntegrationDTO = new FileDataIntegrationDTO((Map<String, Object>) payload.get("request"));
        ContentDisposition contentDisposition = ContentDisposition.builder("form-data").name("file").filename(fileDataIntegrationDTO.getFile().getOriginalFilename()).build();

        HttpHeaders httpHeaders = this.createHttpHeaders(headers, serviceActivator);
        httpHeaders.setContentDisposition(contentDisposition);
        httpHeaders.setContentType(MediaType.MULTIPART_FORM_DATA);
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", fileDataIntegrationDTO.getFile().getResource());
        return new HttpEntity<>(body, httpHeaders);
    }
}
