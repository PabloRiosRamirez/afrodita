package online.grisk.afrodita.presentation.controller.riskscore;

import online.grisk.afrodita.integration.activator.impl.RiskScoreActivatorService;
import online.grisk.afrodita.presentation.controller.BasicRestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
public class RiskScoreRestController extends BasicRestController {

    @Autowired
    RiskScoreActivatorService riskScoreActivatorService;

    @PostMapping(value = "/v1/rest/score")
    public ResponseEntity<?> registerRiskScore(@Valid @RequestBody Map payload, Errors errors) throws Exception {
        if (errors.hasErrors()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        this.verifyParameters(payload);
        Map response = riskScoreActivatorService.invokeRegisterScore(payload, new HashMap());
        return new ResponseEntity<>(response, HttpStatus.valueOf(Integer.parseInt(response.getOrDefault("status", "500").toString())));
    }

//    @GetMapping("/v1/rest/score/organization/{id_organization}")
//    public ResponseEntity<?> getScoreByOrganization(@PathVariable long idOrganization) throws Exception {
//        Map<String, Object> getScore = scoreActivatorService.invokeGetScore(idOrganization);
//        return new ResponseEntity(getScore, HttpStatus.OK);
//    }
    
}
