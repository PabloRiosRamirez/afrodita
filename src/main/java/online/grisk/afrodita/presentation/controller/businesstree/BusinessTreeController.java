package online.grisk.afrodita.presentation.controller.businesstree;

import online.grisk.afrodita.domain.service.UserService;
import online.grisk.afrodita.integration.activator.impl.BusinessTreeActivatorService;
import online.grisk.afrodita.integration.activator.impl.DataintegrationActivatorService;
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
public class BusinessTreeController {
    @Autowired
    UserService userService;
    @Autowired
    BusinessTreeActivatorService businessTreeActivatorService;
    @Autowired
    DataintegrationActivatorService dataintegrationActivatorService;

    @RequestMapping(value = "/indicators/businesstree", method = GET)
    public String indicatorsTree(HttpSession session, Model model, Principal principal) throws Exception {
        model.addAttribute("title", "Business Tree");
        model.addAttribute("description", "Configuración de Business Tree");
        model.addAttribute("module", "indicators");
        Map<String, Object> getDataIntegration = dataintegrationActivatorService.invokeGetDataIntegration(userService.findByUsername(principal.getName()).getOrganization().getIdOrganization());
        if (getDataIntegration.get("status").toString().equalsIgnoreCase("200")) {
            model.addAttribute("dataintegration", getDataIntegration.get("current_response"));
        }
        Map<String, Object> getBusinessTree = businessTreeActivatorService.invokeGetTree(userService.findByUsername(principal.getName()).getOrganization().getIdOrganization());
        if (getBusinessTree.get("status").toString().equalsIgnoreCase("200")) {
            model.addAttribute("businesstree", getBusinessTree.get("current_response"));
        }
        return "indicator_tree/indicator_tree";
    }

    @RequestMapping(value = "/indicators/businesstree/setting", method = GET)
    public String indicatorsTreeSetting(HttpSession session, Model model, Principal principal) throws Exception {
        model.addAttribute("title", "Business Tree");
        model.addAttribute("description", "Configuración de Business Tree");
        model.addAttribute("module", "indicators");
        Map<String, Object> getDataIntegration = dataintegrationActivatorService.invokeGetDataIntegration(userService.findByUsername(principal.getName()).getOrganization().getIdOrganization());
        if (getDataIntegration.get("status").toString().equalsIgnoreCase("200")) {
            model.addAttribute("dataintegration", getDataIntegration.get("current_response"));
        }
        return "indicator_tree/indicator_tree-setting";
    }
}
