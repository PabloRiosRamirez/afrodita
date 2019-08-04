package online.grisk.afrodita.integration.activator;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import online.grisk.afrodita.domain.entity.Microservice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.messaging.handler.annotation.Headers;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.client.RestTemplate;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.HashMap;
import java.util.Map;

public class BasicRestServiceActivator {


    @Autowired
    ObjectMapper objectMapper;
    @Autowired
    private RestTemplate restTemplate;

    protected Map buildResponseError(String error) {
        Map<String, Object> response = new HashMap<>();
        response.put("error", error);
        return response;
    }

    protected Map createHeadersWithAction(String action) {
        Map<String, Object> headers = new HashMap<>();
        headers.put("action", action);
        return headers;
    }

    protected ResponseEntity<Map<String, Object>> consumerRestServiceActivator(@NotBlank String path, @NotNull HttpMethod method, @NotNull @Payload Map<String, Object> payload, @NotNull @Headers Map<String, Object> headers, @NotNull Microservice microserviceArtemisa) throws Exception {
        HttpEntity<Object> httpEntity = this.buildHttpEntity(payload, headers, microserviceArtemisa);
        return this.executeRequest(path, method, microserviceArtemisa, httpEntity);
    }


    protected HttpEntity<Object> buildHttpEntity(Map<String, Object> payload, Map<String, Object> headers, Microservice microservice) {
        HttpHeaders httpHeaders = createHttpHeaders(headers, microservice);
        return new HttpEntity<>(payload, httpHeaders);
    }

    protected HttpHeaders createHttpHeaders(Map<String, Object> mapHeaders, Microservice microservice) {
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("Content-Type", "application/json");
        mapHeaders.forEach((k, v) -> {
            if (v instanceof String) {
                httpHeaders.add(k.toLowerCase(), v.toString());
            }
        });
        httpHeaders.setBasicAuth(microservice.getServiceUsername(), microservice.getServicePassword());
        return httpHeaders;
    }

    protected ResponseEntity<Map<String, Object>> executeRequest(String path, HttpMethod method, Microservice microservice, HttpEntity<Object> httpEntity) throws Exception {
        ResponseEntity response;
        try {
            response = this.restTemplate.exchange("http://" + microservice.getServiceId() + path, method, httpEntity, Map.class);
        } catch (RestClientResponseException e) {
            throw new Exception(this.buildErrorMessage(microservice.getServiceId(), e));
        } catch (IllegalStateException e) {
            throw new IllegalStateException("No instances available for " + microservice.getServiceId());
        } catch (Exception e) {
            throw new Exception();
        }
        return response;
    }

    private String buildErrorMessage(String nameServiceActivator, Exception exc) {
        try {
            JsonNode jsonNode = this.objectMapper.readTree(exc.getMessage());
            if (exc instanceof RestClientResponseException) {
                RestClientResponseException e = (RestClientResponseException) exc;
                jsonNode = this.objectMapper.readTree(e.getResponseBodyAsString());
                return jsonNode.get("message") != null ? String.format("An error ocurred executing %s service activator: %S (STATUS: %d)", nameServiceActivator, jsonNode.get("message").asText(), e.getRawStatusCode()) : String.format("An error ocurred executing %s service activator: %S (STATUS: %d)", nameServiceActivator, e.getMessage(), e.getRawStatusCode());
            }
            return jsonNode.get("message") != null ? String.format("An error ocurred executing %s service activator: %S", nameServiceActivator, jsonNode.get("message").asText()) : String.format("An error ocurred executing %s service activator: %S", nameServiceActivator, exc.getMessage());

        } catch (Exception e) {
            return String.format("An error ocurred executing %s service activator: %S", nameServiceActivator, exc.getMessage());
        }
    }

    protected Map<String, Object> addServiceResponseToResponseMap(Map<String, Object> payload, Object response, HttpStatus status, String serviceId) {
        payload.put(serviceId.toLowerCase() + "_" + "response", response);
        payload.put("current_response", response);
        payload.put("status", status.value());
        return payload;
    }
}
