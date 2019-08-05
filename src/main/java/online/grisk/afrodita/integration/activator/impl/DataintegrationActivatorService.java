package online.grisk.afrodita.integration.activator.impl;

import online.grisk.afrodita.domain.dto.FileDataIntegrationDTO;
import online.grisk.afrodita.domain.entity.Microservice;
import online.grisk.afrodita.domain.entity.Variable;
import online.grisk.afrodita.integration.activator.BasicRestServiceActivator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.Headers;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;

import javax.validation.constraints.NotNull;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DataintegrationActivatorService extends BasicRestServiceActivator {

    @Autowired
    Microservice microserviceArtemisa;

    @Autowired
    DataintegrationActivatorService dataintegrationActivatorService;

    //    Action for 'variableBureau'
    public List<Variable> getVariableBureau() throws Exception {
        ResponseEntity<Map<String, Object>> responseEntity = this.executeRequest("/api/artemisa/variables/bureau", HttpMethod.GET, microserviceArtemisa, this.buildHttpEntity(new HashMap<>(), new HashMap<>(), microserviceArtemisa));
        return (List<Variable>) responseEntity.getBody().get("variables");
    }

    //    Action for 'getDataIntegrationExcel'
    public Map<String, Object> invokeGetDataIntegration(@NotNull Long id_organization) throws Exception {
        ResponseEntity<Map<String, Object>> responseEntity = consumerRestServiceActivator("/api/artemisa/dataintegration/organization/" + id_organization, HttpMethod.GET, new HashMap<>(), new HashMap<>(), microserviceArtemisa);
        return addServiceResponseToResponseMap(new HashMap<>(), responseEntity.getBody(), responseEntity.getStatusCode(), microserviceArtemisa.getServiceId());
    }

    //    Action for 'registerDataIntegrationExcel'
    public Map<String, Object> invokeRegisterDataIntegrationExcel(@NotNull @Payload Map<String, Object> payload, @NotNull @Headers Map<String, Object> headers) throws Exception {
        ResponseEntity<Map<String, Object>> responseEntity = consumerRestServiceActivator("/api/artemisa/dataintegration/excel", HttpMethod.POST, payload, createHeadersWithAction(headers.getOrDefault("action", "").toString()), microserviceArtemisa);
        return addServiceResponseToResponseMap(payload, responseEntity.getBody().get("current_response"), responseEntity.getStatusCode(), microserviceArtemisa.getServiceId());
    }

    //    Action for 'updateDataIntegrationExcel'
    public Map<String, Object> invokeUpdateDataIntegrationExcel(@NotNull @Payload Map<String, Object> payload, @NotNull @Headers Map<String, Object> headers) throws Exception {
        FileDataIntegrationDTO fileDataIntegrationDTO = new FileDataIntegrationDTO(payload);
        ResponseEntity<Map<String, Object>> responseEntity = consumerMultipartRestServiceActivator("/api/artemisa/dataintegration/" + fileDataIntegrationDTO.getId_organization() + "/excel", HttpMethod.PUT, payload, createHeadersWithAction(headers.getOrDefault("action", "").toString()), microserviceArtemisa);
        return addServiceResponseToResponseMap(payload, responseEntity.getBody(), responseEntity.getStatusCode(), microserviceArtemisa.getServiceId());
    }

    //    Action for 'registerDataIntegrationBureau'
    public Map<String, Object> invokeRegisterDataIntegrationBureau(@NotNull @Payload Map<String, Object> payload, @NotNull @Headers Map<String, Object> headers) throws Exception {
        ResponseEntity<Map<String, Object>> responseEntity = consumerRestServiceActivator("/api/artemisa/dataintegration/bureau", HttpMethod.POST, payload, createHeadersWithAction(headers.getOrDefault("action", "").toString()), microserviceArtemisa);
        return addServiceResponseToResponseMap(payload, responseEntity.getBody().get("current_response"), responseEntity.getStatusCode(), microserviceArtemisa.getServiceId());
    }

    //  Action for 'invokeAnalysisByExcel'
    public Map<String, Object> invokeAnalysisByExcel(@NotNull @Payload Map<String, Object> payload, @NotNull @Headers Map<String, Object> headers) throws Exception {
        FileDataIntegrationDTO fileDataIntegrationDTO = new FileDataIntegrationDTO((Map<String, Object>) payload.get("request"));
        ResponseEntity<Map<String, Object>> responseEntity = consumerMultipartRestServiceActivator("/v1/analysisFiles/organization/" + fileDataIntegrationDTO.getId_organization(), HttpMethod.POST, payload, createHeadersWithAction(headers.getOrDefault("action", "").toString()), microserviceArtemisa);
        return addServiceResponseToResponseMap(payload, responseEntity.getBody(), responseEntity.getStatusCode(), microserviceArtemisa.getServiceId());
    }

}
