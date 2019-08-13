package online.grisk.afrodita.integration.activator.impl;

import online.grisk.afrodita.domain.entity.Microservice;
import online.grisk.afrodita.integration.activator.BasicRestServiceActivator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.Headers;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;

import javax.validation.constraints.NotNull;
import java.util.HashMap;
import java.util.Map;

@Service
public class TreeActivatorService extends BasicRestServiceActivator {

    @Autowired
    Microservice microserviceArtemisa;

    //    Action for 'invokeRegisterScore'
    public Map<String, Object> invokeRegisterTree(@NotNull @Payload Map<String, Object> payload, @NotNull @Headers Map<String, Object> headers) throws Exception {
        ResponseEntity<Map<String, Object>> responseEntity = consumerRestServiceActivator("/api/artemisa/score", HttpMethod.POST, payload, createHeadersWithAction(headers.getOrDefault("action", "").toString()), microserviceArtemisa);
        return addServiceResponseToResponseMap(payload, responseEntity.getBody().get("current_response"), responseEntity.getStatusCode(), microserviceArtemisa.getServiceId());
    }

    //    Action for 'invokeGetScore'
    public Map<String, Object> invokeGetTree(@NotNull Long id_organization) throws Exception {
        ResponseEntity<Map<String, Object>> responseEntity = consumerRestServiceActivator("/api/artemisa/score/organization/" + id_organization, HttpMethod.GET, new HashMap<>(), new HashMap<>(), microserviceArtemisa);
        return addServiceResponseToResponseMap(new HashMap<>(), responseEntity.getBody(), responseEntity.getStatusCode(), microserviceArtemisa.getServiceId());
    }

}
