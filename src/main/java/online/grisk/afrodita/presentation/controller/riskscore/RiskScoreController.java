package online.grisk.afrodita.presentation.controller.riskscore;

import online.grisk.afrodita.domain.service.UserService;
import online.grisk.afrodita.integration.activator.impl.DataintegrationActivatorService;
import online.grisk.afrodita.integration.activator.impl.RiskRatioActivatorService;
import online.grisk.afrodita.integration.activator.impl.RiskScoreActivatorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpSession;
import java.security.Principal;
import java.util.Map;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

@Controller
public class RiskScoreController {
    @Autowired
    UserService userService;
    @Autowired
    RiskScoreActivatorService riskScoreActivatorService;
    @Autowired
    DataintegrationActivatorService dataintegrationActivatorService;

    @RequestMapping(value = "/indicators/riskscore", method = GET)
    public String indicatorScore(HttpSession session, Model model, Principal principal) throws Exception {
        model.addAttribute("title", "Risk Score");
        model.addAttribute("description", "Risk Score");
        model.addAttribute("module", "indicators");
        Map<String, Object> getDataIntegration = dataintegrationActivatorService.invokeGetDataIntegration(userService.findByUsername(principal.getName()).getOrganization().getIdOrganization());
        if (getDataIntegration.get("status").toString().equalsIgnoreCase("200")) {
            model.addAttribute("dataintegration", getDataIntegration.get("current_response"));
        }
        Map<String, Object> riskScore = riskScoreActivatorService.invokeGetScore(userService.findByUsername(principal.getName()).getOrganization().getIdOrganization());
        if (riskScore.get("status").toString().equalsIgnoreCase("200")) {
            model.addAttribute("riskscore", riskScore.get("current_response"));
        }
        return "indicator_score/indicator_score";
    }

    @RequestMapping(value = "/indicators/riskscore/setting", method = GET)
    public String indicatorScoreSetting(HttpSession session, Model model, Principal principal) throws Exception {
        model.addAttribute("title", "Risk Score");
        model.addAttribute("description", "Risk Score");
        model.addAttribute("module", "indicators");
        Map<String, Object> getDataIntegration = dataintegrationActivatorService.invokeGetDataIntegration(userService.findByUsername(principal.getName()).getOrganization().getIdOrganization());
        if (getDataIntegration.get("status").toString().equalsIgnoreCase("200")) {
            model.addAttribute("dataintegration", getDataIntegration.get("current_response"));
        }
        return "indicator_score/indicator_score-setting";
    }
}
