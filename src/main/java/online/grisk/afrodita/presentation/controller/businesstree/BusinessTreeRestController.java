package online.grisk.afrodita.presentation.controller.businesstree;

import java.util.HashMap;
import java.util.Map;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import online.grisk.afrodita.integration.activator.impl.BusinessTreeActivatorService;
import online.grisk.afrodita.presentation.controller.BasicRestController;

@RestController
public class BusinessTreeRestController extends BasicRestController {
	
	@Autowired
	private BusinessTreeActivatorService businessTreeActivatorService;

	@PostMapping(value = "/v1/rest/tree")
	public ResponseEntity<?> registerRiskRatio(@Valid @RequestBody Map payload, Errors errors) throws Exception {
		if (errors.hasErrors()) {
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		this.verifyParameters(payload);
		Map response = businessTreeActivatorService.invokeRegisterTree(payload, new HashMap());

		return new ResponseEntity<>(response,
				HttpStatus.valueOf(Integer.parseInt(response.getOrDefault("status", "500").toString())));
	}
}
