package online.grisk.afrodita.integration.activator.impl;

import online.grisk.afrodita.domain.dto.RatioDTO;
import online.grisk.afrodita.domain.dto.RiskRatioDTO;
import online.grisk.afrodita.domain.dto.RiskScoreDTO;
import online.grisk.afrodita.domain.dto.ScoreRangesDTO;
import online.grisk.afrodita.domain.entity.Microservice;
import online.grisk.afrodita.integration.activator.BasicRestServiceActivator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.Headers;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import javax.validation.constraints.NotNull;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@Service
public class RatioActivatorService extends BasicRestServiceActivator {

	@Autowired
	Microservice microserviceArtemisa;

	// Action for 'invokeRegisterScore'
	public Map<String, Object> invokeRegisterRatio(@NotNull @Payload Map<String, Object> payload, @NotNull @Headers Map<String, Object> headers) throws Exception {

		ArrayList<Map<String, Object>> ratios = (ArrayList<Map<String, Object>>) payload.get("ratios");
		ArrayList<RatioDTO> ratiosDtoList = new ArrayList<>();

		for (Map<String, Object> ratioMap : ratios) {
			RatioDTO ratioDto = new RatioDTO();
			ratioDto.setTitule(ratioMap.get("titule").toString());
			ratioDto.setColor(ratioMap.get("color").toString());
			ratioDto.setOperation(ratioMap.get("expression").toString());
			ratioDto.setPostResult(ratioMap.get("fix").toString());
//    		ratioDto.setOrderDisplay(0);
			ratiosDtoList.add(ratioDto);
		}

		RiskRatioDTO riskRatioDto = new RiskRatioDTO();
		riskRatioDto.setTitule(new String());

		riskRatioDto.setOrganization(Long.parseLong(payload.get("organization").toString()));

		riskRatioDto.setRatios(ratiosDtoList);

		ObjectMapper mapper = new ObjectMapper();

		payload = mapper.convertValue(riskRatioDto, new TypeReference<Map<String, Object>>() {
		});

		ResponseEntity<Map<String, Object>> responseEntity = consumerRestServiceActivator("/api/artemisa/ratios",
				HttpMethod.POST, payload, createHeadersWithAction(headers.getOrDefault("action", "").toString()),
				microserviceArtemisa);
		return addServiceResponseToResponseMap(payload, responseEntity.getBody().get("current_response"),
				responseEntity.getStatusCode(), microserviceArtemisa.getServiceId());
	}

	// Action for 'invokeGetScore'
	public Map<String, Object> invokeGetRatio(@NotNull Long id_organization) throws Exception {
		ResponseEntity<Map<String, Object>> responseEntity = consumerRestServiceActivator(
				"/api/artemisa/score/organization/" + id_organization, HttpMethod.GET, new HashMap<>(), new HashMap<>(),
				microserviceArtemisa);
		return addServiceResponseToResponseMap(new HashMap<>(), responseEntity.getBody(),
				responseEntity.getStatusCode(), microserviceArtemisa.getServiceId());
	}

}
