package online.grisk.afrodita.integration.activator.impl;

import online.grisk.afrodita.domain.dto.BusinessTreeDTO;
import online.grisk.afrodita.domain.dto.NodeTreeDTO;
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
public class BusinessTreeActivatorService extends BasicRestServiceActivator {
    @Autowired
    Microservice microserviceArtemisa;

    public Map<String, Object> invokeRegisterTree(@NotNull @Payload Map<String, Object> payload, @NotNull @Headers Map<String, Object> headers) throws Exception {
    	ArrayList<Map<String, Object>> nodes = (ArrayList<Map<String, Object>>) payload.get("nodes");
        ArrayList<NodeTreeDTO> nodeDtoList = new ArrayList<>();
        int contador = 0;
        for (Map<String, Object> nodeMap : nodes) {
            NodeTreeDTO nodeTreeDto = new NodeTreeDTO(); 
            nodeTreeDto.setId(nodeMap.get("id").toString());
            nodeTreeDto.setOrder(contador);
            nodeTreeDto.setOutput(Boolean.parseBoolean(nodeMap.get("output").toString()));
            if(nodeTreeDto.isOutput()) {
            	nodeTreeDto.setColor(nodeMap.get("color").toString());
            	nodeTreeDto.setLabel(nodeMap.get("label").toString());
            }else {
            	nodeTreeDto.setExpression(nodeMap.get("expression").toString());
            	nodeTreeDto.setChildrenAffirmation(nodeMap.get("childrenAffirmation").toString());
            	nodeTreeDto.setChildrenNegation(nodeMap.get("childrenNegation").toString());
            }
           
            nodeTreeDto.setMain(Boolean.parseBoolean(nodeMap.get("main").toString()));
            nodeDtoList.add(nodeTreeDto);
            contador++;
        }
       
        BusinessTreeDTO businessTreeDTO = new BusinessTreeDTO();
        businessTreeDTO.setOrganization(Long.parseLong(payload.get("organization").toString()));
        businessTreeDTO.setNodes(nodeDtoList);
        
    	ResponseEntity<Map<String, Object>> responseEntity = consumerRestServiceActivator("/api/artemisa/tree", HttpMethod.POST, businessTreeDTO.toMap(), createHeadersWithAction(headers.getOrDefault("action", "").toString()), microserviceArtemisa);
        return addServiceResponseToResponseMap(payload, responseEntity.getBody().get("current_response"), responseEntity.getStatusCode(), microserviceArtemisa.getServiceId());
    }

    public Map<String, Object> invokeGetTree(@NotNull Long id_organization) throws Exception {
        ResponseEntity<Map<String, Object>> responseEntity = consumerRestServiceActivator("/api/artemisa/tree/organization/" + id_organization, HttpMethod.GET, new HashMap<>(), new HashMap<>(), microserviceArtemisa);
        return addServiceResponseToResponseMap(new HashMap<>(), responseEntity.getBody(), responseEntity.getStatusCode(), microserviceArtemisa.getServiceId());
    }
}
