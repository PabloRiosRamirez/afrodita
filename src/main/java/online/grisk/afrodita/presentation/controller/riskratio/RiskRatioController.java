package online.grisk.afrodita.presentation.controller.riskratio;

import online.grisk.afrodita.domain.service.UserService;
import online.grisk.afrodita.integration.activator.impl.DataintegrationActivatorService;
import online.grisk.afrodita.integration.activator.impl.RiskRatioActivatorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpSession;
import java.security.Principal;
import java.util.Map;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

@Controller
public class RiskRatioController {
    @Autowired
    UserService userService;
    @Autowired
    RiskRatioActivatorService riskRatioActivatorService;
    @Autowired
    DataintegrationActivatorService dataintegrationActivatorService;

    @RequestMapping(value = "/indicators/riskratios", method = GET)
    public String indicatorRatios(HttpSession session, Model model, Principal principal) throws Exception {
        model.addAttribute("title", "Risk Ratios");
        model.addAttribute("description", "Risk Ratios");
        model.addAttribute("module", "indicators");
        Map<String, Object> getDataIntegration = dataintegrationActivatorService.invokeGetDataIntegration(userService.findByUsername(principal.getName()).getOrganization().getIdOrganization());
        if (getDataIntegration.get("status").toString().equalsIgnoreCase("200")) {
            model.addAttribute("dataintegration", getDataIntegration.get("current_response"));
        }
        Map<String, Object> getRiskRatio = riskRatioActivatorService.invokeGetRatio(userService.findByUsername(principal.getName()).getOrganization().getIdOrganization());
        if (getRiskRatio.get("status").toString().equalsIgnoreCase("200")) {
            model.addAttribute("riskratio", getRiskRatio.get("current_response"));
        }
        return "indicator_ratios/indicator_ratios";
    }

    @RequestMapping(value = "/indicators/riskratios/setting", method = GET)
    public String indicatorRatiosSetting(HttpSession session, Model model, Principal principal) throws Exception {
        model.addAttribute("title", "Risk Ratios");
        model.addAttribute("description", "Risk Ratios");
        model.addAttribute("module", "indicators");
        Map<String, Object> getDataIntegration = dataintegrationActivatorService.invokeGetDataIntegration(userService.findByUsername(principal.getName()).getOrganization().getIdOrganization());
        if (getDataIntegration.get("status").toString().equalsIgnoreCase("200")) {
            model.addAttribute("dataintegration", getDataIntegration.get("current_response"));
        }
        return "indicator_ratios/indicator_ratios-setting";
    }
}
