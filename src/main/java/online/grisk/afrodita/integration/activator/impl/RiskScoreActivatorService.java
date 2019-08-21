package online.grisk.afrodita.integration.activator.impl;

import online.grisk.afrodita.domain.dto.RiskScoreDTO;
import online.grisk.afrodita.domain.dto.RiskScoreRangeDTO;
import online.grisk.afrodita.domain.pojo.Microservice;
import online.grisk.afrodita.integration.activator.BasicRestServiceActivator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.Headers;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;

import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@Service
public class RiskScoreActivatorService extends BasicRestServiceActivator {
    @Autowired
    Microservice microserviceArtemisa;

    public Map<String, Object> invokeRegisterScore(@NotNull @Payload Map<String, Object> payload, @NotNull @Headers Map<String, Object> headers) throws Exception {
        ArrayList<Map<String, Object>> ranges = (ArrayList<Map<String, Object>>) payload.get("ranges");
        ArrayList<RiskScoreRangeDTO> riskScoreRangeDtoList = new ArrayList<>();
        for (Map<String, Object> rangeMap : ranges) {
            RiskScoreRangeDTO scoreRangeDTO = new RiskScoreRangeDTO();
            scoreRangeDTO.setColor(rangeMap.get("color").toString());
            scoreRangeDTO.setLowerLimit(Short.parseShort(rangeMap.get("lowerLimit").toString()));
            scoreRangeDTO.setUpperLimit(Short.parseShort(rangeMap.get("upperLimit").toString()));
            riskScoreRangeDtoList.add(scoreRangeDTO);
        }
        RiskScoreDTO riskScoreDTO = new RiskScoreDTO();
        riskScoreDTO.setVariable(payload.get("variable").toString());
        riskScoreDTO.setOrganization(Long.parseLong(payload.get("organization").toString()));
        riskScoreDTO.setTitule(payload.get("titule").toString());
        riskScoreDTO.setRanges(riskScoreRangeDtoList);
        ResponseEntity<Map<String, Object>> responseEntity = consumerRestServiceActivator("/api/artemisa/score", HttpMethod.POST, riskScoreDTO.toMap(), createHeadersWithAction(headers.getOrDefault("action", "").toString()), microserviceArtemisa);
        return addServiceResponseToResponseMap(payload, responseEntity.getBody().get("current_response"), responseEntity.getStatusCode(), microserviceArtemisa.getServiceId());
    }

    public Map<String, Object> invokeGetScore(@NotNull Long id_organization) throws Exception {
        ResponseEntity<Map<String, Object>> responseEntity = consumerRestServiceActivator("/api/artemisa/score/organization/" + id_organization, HttpMethod.GET, new HashMap<>(), new HashMap<>(), microserviceArtemisa);
        return addServiceResponseToResponseMap(new HashMap<>(), responseEntity.getBody(), responseEntity.getStatusCode(), microserviceArtemisa.getServiceId());
    }

}
