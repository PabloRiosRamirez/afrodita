package online.grisk.afrodita.presentation.controller;

import online.grisk.afrodita.domain.dto.FileDataIntegrationDTO;
import online.grisk.afrodita.domain.entity.TypeVariable;
import online.grisk.afrodita.domain.entity.Variable;
import online.grisk.afrodita.domain.service.UserService;
import online.grisk.afrodita.integration.activator.impl.ArtemisaActivatorService;
import online.grisk.afrodita.integration.gateway.GatewayService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.Headers;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpSession;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;

@Controller
public class DashboardController {

	@Autowired
	UserService userService;

	@Autowired
	GatewayService gateway;

	@Autowired
	ArtemisaActivatorService artemisaActivatorService;

	@RequestMapping(value = "/analysis/{idOrganization}/file", method = POST)
	public String analysisByFileExcel(@RequestParam("file") MultipartFile file, @PathVariable Long idOrganization,
			Model model, Principal principal) {
		try {
			model.addAttribute("title", "Dashboard");
			model.addAttribute("description", "Resultado de análisis");
			model.addAttribute("module", "analysis");
		} catch (Exception e) {
			model.addAttribute("errors", "analisysError500ByExcel");
		}
		
		FileDataIntegrationDTO fileDataIntegrationDTO = new FileDataIntegrationDTO(idOrganization, file);
        this.verifyParameters(fileDataIntegrationDTO.toMap());
		HttpEntity<?> updateDataIntegrationExcel = invokeServiceActivator(fileDataIntegrationDTO.toMap(), new HashMap(), "updateDataIntegrationExcel");

		return "dashboard/dashboard-excel";
	}
	
	  private void verifyParameters(Map payload) {
	        Assert.notEmpty(payload, "Payload required");
	    }
	
	   private HttpEntity<?> invokeServiceActivator(@NotEmpty @Payload @RequestBody Map payload, @NotEmpty @Headers @RequestHeader Map headers, String action) {
	        Map<String, Object> request = new HashMap<>();
	        request.put("request", payload);
	        Message build = MessageBuilder.withPayload(request).setHeader("action", action).build();
	        Map process = gateway.process(build);
	        return new ResponseEntity<>(process, HttpStatus.valueOf(Integer.parseInt(process.getOrDefault("status", "500").toString())));
	    }
	

}
