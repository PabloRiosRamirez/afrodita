package online.grisk.afrodita.presentation.controller.dashboard;

import online.grisk.afrodita.domain.dto.FileDataIntegrationDTO;
import online.grisk.afrodita.domain.service.UserService;
import online.grisk.afrodita.integration.activator.impl.DashboardActivatorService;
import online.grisk.afrodita.integration.activator.impl.EmailActivatorService;
import online.grisk.afrodita.integration.gateway.GatewayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.Headers;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.NotEmpty;
import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

import static org.springframework.web.bind.annotation.RequestMethod.POST;

@RestController
public class DashboardRestController {

    @Autowired
    UserService userService;

    @Autowired
    GatewayService gateway;

    @Autowired
    EmailActivatorService emailActivatorService;

    @Autowired
    DashboardActivatorService dashboardActivatorService;

    @RequestMapping(value = "/analysis/{idOrganization}/excel", method = POST)
    public ResponseEntity<?> analysisByExcel(@RequestParam("file") MultipartFile file, @PathVariable Long idOrganization, Principal principal) throws Exception {
        FileDataIntegrationDTO fileDataIntegrationDTO = new FileDataIntegrationDTO(idOrganization, file);
        this.verifyParameters(fileDataIntegrationDTO.toMap());
        Map response = dashboardActivatorService.invokeAnalysisByExcel(fileDataIntegrationDTO.toMap(), new HashMap());
        response.remove("file");
        return new ResponseEntity<>(response, HttpStatus.valueOf(Integer.parseInt(response.getOrDefault("status", "500").toString())));
    }

    @RequestMapping(value = "/analysis/{idOrganization}/bureau", method = POST)
    public ResponseEntity<?> analysisByBureau(@PathVariable Long idOrganization, @RequestBody Map payload, Principal principal) throws Exception {
        payload.put("organization", idOrganization);
        this.verifyParameters(payload);
        Map response = dashboardActivatorService.invokeAnalysisByBureau(payload, new HashMap<>());
        return new ResponseEntity<>(response, HttpStatus.valueOf(Integer.parseInt(response.getOrDefault("status", "500").toString())));
    }

    private void verifyParameters(Map payload) {
        Assert.notEmpty(payload, "Payload required");
    }

}
