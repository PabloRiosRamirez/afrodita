package online.grisk.afrodita.integration.activator.impl;

import online.grisk.afrodita.domain.dto.RiskRatioRatioDTO;
import online.grisk.afrodita.domain.dto.RiskRatioDTO;
import online.grisk.afrodita.domain.pojo.Microservice;
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
public class RiskRatioActivatorService extends BasicRestServiceActivator {
	@Autowired
	Microservice microserviceArtemisa;

	public Map<String, Object> invokeRegisterRatio(@NotNull @Payload Map<String, Object> payload, @NotNull @Headers Map<String, Object> headers) throws Exception {
		ArrayList<Map<String, Object>> ratios = (ArrayList<Map<String, Object>>) payload.get("ratios");
		ArrayList<RiskRatioRatioDTO> ratiosDtoList = new ArrayList<>();
		for (Map<String, Object> ratioMap : ratios) {
			RiskRatioRatioDTO riskRatioRatioDto = new RiskRatioRatioDTO();
			riskRatioRatioDto.setTitule(ratioMap.get("titule").toString());
			riskRatioRatioDto.setColor(ratioMap.get("color").toString());
			riskRatioRatioDto.setExpression(ratioMap.get("expression").toString());
			riskRatioRatioDto.setPostResult(ratioMap.get("postResult").toString());
			ratiosDtoList.add(riskRatioRatioDto);
		}
		RiskRatioDTO riskRatioDto = new RiskRatioDTO();
		riskRatioDto.setOrganization(Long.parseLong(payload.get("organization").toString()));
		riskRatioDto.setRatios(ratiosDtoList);
		ResponseEntity<Map<String, Object>> responseEntity = consumerRestServiceActivator("/api/artemisa/ratios",
				HttpMethod.POST, riskRatioDto.toMap(), createHeadersWithAction(headers.getOrDefault("action", "").toString()),
				microserviceArtemisa);
		return addServiceResponseToResponseMap(riskRatioDto.toMap(), responseEntity.getBody().get("current_response"),
				responseEntity.getStatusCode(), microserviceArtemisa.getServiceId());
	}

	public Map<String, Object> invokeGetRatio(@NotNull Long idOrganization) throws Exception {
		ResponseEntity<Map<String, Object>> responseEntity = consumerRestServiceActivator(
				"/api/artemisa/ratios/organization/" + idOrganization, HttpMethod.GET, new HashMap<>(), new HashMap<>(),
				microserviceArtemisa);
		return addServiceResponseToResponseMap(new HashMap<>(), responseEntity.getBody(),
				responseEntity.getStatusCode(), microserviceArtemisa.getServiceId());
	}

}
