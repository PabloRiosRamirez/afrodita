package online.grisk.afrodita.presentation.controller.dashboard;

import online.grisk.afrodita.domain.dto.FileDataIntegrationDTO;
import online.grisk.afrodita.domain.service.UserService;
import online.grisk.afrodita.integration.activator.impl.DashboardActivatorService;
import online.grisk.afrodita.integration.activator.impl.EmailActivatorService;
import online.grisk.afrodita.integration.gateway.GatewayService;
import org.springframework.beans.factory.annotation.Autowired;
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

@Controller
public class DashboardController {

    @Autowired
    UserService userService;

    @Autowired
    GatewayService gateway;

    @Autowired
    EmailActivatorService emailActivatorService;

    @Autowired
    DashboardActivatorService dashboardActivatorService;

    @RequestMapping(value = "/analysis/{idOrganization}/excel", method = POST)
    public String analysisByExcel(@RequestParam("file") MultipartFile file, @PathVariable Long idOrganization,
                                  Model model, Principal principal) throws Exception {
        try {
            model.addAttribute("title", "Dashboard");
            model.addAttribute("description", "Resultado de análisis");
            model.addAttribute("module", "analysis");
        } catch (Exception e) {
            model.addAttribute("errors", "analisysError500ByExcel");
        }

        FileDataIntegrationDTO fileDataIntegrationDTO = new FileDataIntegrationDTO(idOrganization, file);
        this.verifyParameters(fileDataIntegrationDTO.toMap());
        Map response = dashboardActivatorService.invokeAnalysisByExcel(fileDataIntegrationDTO.toMap(), new HashMap());
        return "dashboard/dashboard-excel";
    }

    @RequestMapping(value = "/analysis/{idOrganization}/bureau", method = POST)
    public String analysisByBureau(Map payload, Model model, Principal principal) throws Exception {
        try {
            model.addAttribute("title", "Dashboard");
            model.addAttribute("description", "Resultado de análisis");
            model.addAttribute("module", "analysis");
        } catch (Exception e) {
            model.addAttribute("errors", "analisysError500ByExcel");
        }
//        this.verifyParameters(payload);
//        Map response = dashboardActivatorService.invokeAnalysisByBureau(payload, headers);
        return "dashboard/dashboard-bureau";
    }

    private void verifyParameters(Map payload) {
        Assert.notEmpty(payload, "Payload required");
    }

}
