package online.grisk.afrodita.integration.activator.impl;

import online.grisk.afrodita.domain.dto.FileDataIntegrationDTO;
import online.grisk.afrodita.domain.entity.Microservice;
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

@Service
public class DashboardActivatorService extends BasicRestServiceActivator {

    @Autowired
    Microservice microserviceArtemisa;

    //    Action for 'analysisByExcel'
    public Map<String, Object> invokeAnalysisByExcel(@NotNull @Payload Map<String, Object> payload, @NotNull @Headers Map<String, Object> headers) throws Exception {
        FileDataIntegrationDTO fileDataIntegrationDTO = new FileDataIntegrationDTO(payload);
        ResponseEntity<Map<String, Object>> responseEntity = consumerMultipartRestServiceActivator("/api/artemisa/analysis/" + fileDataIntegrationDTO.getId_organization() + "/excel", HttpMethod.POST, payload, createHeadersWithAction(headers.getOrDefault("action", "").toString()), microserviceArtemisa);
        return addServiceResponseToResponseMap(payload, responseEntity.getBody(), responseEntity.getStatusCode(), microserviceArtemisa.getServiceId());
    }
    //    Action for 'analysisByBureau'
    public Map<String, Object> invokeAnalysisByBureau(@NotNull @Payload Map<String, Object> payload, @NotNull @Headers Map<String, Object> headers) throws Exception {
//        FileDataIntegrationDTO fileDataIntegrationDTO = new FileDataIntegrationDTO(payload);
        ResponseEntity<Map<String, Object>> responseEntity = consumerRestServiceActivator("/api/artemisa/analysis/" + payload.get("organization").toString() + "/bureau", HttpMethod.POST, payload, createHeadersWithAction(headers.getOrDefault("action", "").toString()), microserviceArtemisa);
        return addServiceResponseToResponseMap(payload, responseEntity.getBody(), responseEntity.getStatusCode(), microserviceArtemisa.getServiceId());
    }

}
