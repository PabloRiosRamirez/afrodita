package online.grisk.afrodita.integration.activator;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import online.grisk.afrodita.domain.entity.ServiceActivator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

public class BasicRestServiceActivator {


    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    ObjectMapper objectMapper;

    protected HttpEntity<Object> buildHttpEntity(Map<String, Object> payload, Map<String, Object> headers, ServiceActivator serviceActivator) {
        HttpHeaders httpHeaders = createHttpHeaders(headers, serviceActivator);
        return new HttpEntity<>(payload, httpHeaders);
    }

    protected HttpHeaders createHttpHeaders(Map<String, Object> mapHeaders, ServiceActivator serviceActivator) {
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("Content-Type", "application/json");
        mapHeaders.forEach((k, v) -> {
            if (v instanceof String) {
                httpHeaders.add(k.toLowerCase(), v.toString());
            }
        });
        httpHeaders.setBasicAuth(serviceActivator.getServiceUsername(), serviceActivator.getServicePassword());
        return httpHeaders;
    }

    protected ResponseEntity<JsonNode> executeRequest(ServiceActivator serviceActivator, HttpEntity<Object> httpEntity) throws Exception {
        ResponseEntity response;
        try {
            response = this.restTemplate.exchange(serviceActivator.getUri(), HttpMethod.POST, httpEntity, JsonNode.class);
        } catch (RestClientResponseException e) {
            throw new Exception(this.buildErrorMessage(serviceActivator.getServiceId(), e));
        } catch (IllegalStateException e) {
            throw new IllegalStateException("No instances available for " + serviceActivator.getServiceId());
        } catch (Exception e) {
            throw new Exception();
        }
        return response;
    }

    protected ResponseEntity<Map<String, Object>> executeRequest(String path, HttpMethod method, ServiceActivator serviceActivator, HttpEntity<Object> httpEntity) throws Exception {
        ResponseEntity response;
        try {
            response = this.restTemplate.exchange("http://" + serviceActivator.getServiceId() + path, method, httpEntity, Map.class);
        } catch (RestClientResponseException e) {
            throw new Exception(this.buildErrorMessage(serviceActivator.getServiceId(), e));
        } catch (IllegalStateException e) {
            throw new IllegalStateException("No instances available for " + serviceActivator.getServiceId());
        } catch (Exception e) {
            throw new Exception();
        }
        return response;
    }


    private String buildErrorMessage(String nameServiceActivator, Exception exc) throws Exception {
        try {
            JsonNode jsonNode = this.objectMapper.readTree(exc.getMessage());
            if (exc instanceof RestClientResponseException) {
                RestClientResponseException e = (RestClientResponseException) exc;
                jsonNode = this.objectMapper.readTree(e.getResponseBodyAsString());
                return jsonNode.get("message") != null ? String.format("An error ocurred executing %s service activator: %S (STATUS: %d)", nameServiceActivator, jsonNode.get("message").asText(), e.getRawStatusCode()) : String.format("An error ocurred executing %s service activator: %S (STATUS: %d)", nameServiceActivator, e.getMessage(), e.getRawStatusCode());
            }
            return jsonNode.get("message") != null ? String.format("An error ocurred executing %s service activator: %S", nameServiceActivator, jsonNode.get("message").asText()) : String.format("An error ocurred executing %s service activator: %S", nameServiceActivator, exc.getMessage());

        }catch (Exception e){
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
