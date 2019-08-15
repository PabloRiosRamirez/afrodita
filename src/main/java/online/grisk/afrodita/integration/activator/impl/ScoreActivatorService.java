package online.grisk.afrodita.integration.activator.impl;

import online.grisk.afrodita.domain.dto.FileDataIntegrationDTO;
import online.grisk.afrodita.domain.dto.RiskScoreDTO;
import online.grisk.afrodita.domain.dto.ScoreRangesDTO;
import online.grisk.afrodita.domain.entity.Microservice;
import online.grisk.afrodita.domain.entity.Variable;
import online.grisk.afrodita.integration.activator.BasicRestServiceActivator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.Headers;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ScoreActivatorService extends BasicRestServiceActivator {

    @Autowired
    Microservice microserviceArtemisa;

    //    Action for 'invokeRegisterScore'
    public Map<String, Object> invokeRegisterScore(@NotNull @Payload Map<String, Object> payload, @NotNull @Headers Map<String, Object> headers) throws Exception {
    	
    	ArrayList<Map<String, Object>> ranges = (ArrayList<Map<String, Object>>) payload.get("ranges");
    	ArrayList<ScoreRangesDTO> scoreRangesDtoList = new ArrayList<>();
    	
    	for (Map<String, Object> rangeMap : ranges) {
    		ScoreRangesDTO scoreRangeDTO = new ScoreRangesDTO();
    		scoreRangeDTO.setColor(rangeMap.get("color").toString());
    		scoreRangeDTO.setLimitDown(Short.parseShort(rangeMap.get("limitDown").toString()));
    		scoreRangeDTO.setLimitUp(Short.parseShort(rangeMap.get("limitUp").toString()));
    		scoreRangesDtoList.add(scoreRangeDTO);
		}

    	RiskScoreDTO riskScoreDTO = new RiskScoreDTO();
    	riskScoreDTO.setTitule(payload.get("titulo").toString());
    	riskScoreDTO.setVariable(payload.get("variable").toString());
    	riskScoreDTO.setOrganization(Long.parseLong(payload.get("organization").toString()));
    	
    	riskScoreDTO.setRanges(scoreRangesDtoList);
    	
    	ObjectMapper mapper = new ObjectMapper();
    	
    	payload = mapper.convertValue(riskScoreDTO, new TypeReference<Map<String, Object>>() {});
    	
        ResponseEntity<Map<String, Object>> responseEntity = consumerRestServiceActivator("/api/artemisa/score", HttpMethod.POST, payload, createHeadersWithAction(headers.getOrDefault("action", "").toString()), microserviceArtemisa);
        return addServiceResponseToResponseMap(payload, responseEntity.getBody().get("current_response"), responseEntity.getStatusCode(), microserviceArtemisa.getServiceId());
    }

    //    Action for 'invokeGetScore'
    public Map<String, Object> invokeGetScore(@NotNull Long id_organization) throws Exception {
        ResponseEntity<Map<String, Object>> responseEntity = consumerRestServiceActivator("/api/artemisa/score/organization/" + id_organization, HttpMethod.GET, new HashMap<>(), new HashMap<>(), microserviceArtemisa);
        return addServiceResponseToResponseMap(new HashMap<>(), responseEntity.getBody(), responseEntity.getStatusCode(), microserviceArtemisa.getServiceId());
    }

}
