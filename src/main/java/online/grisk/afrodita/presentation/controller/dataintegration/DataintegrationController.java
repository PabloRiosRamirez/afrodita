package online.grisk.afrodita.presentation.controller.dataintegration;

import online.grisk.afrodita.domain.pojo.TypeVariable;
import online.grisk.afrodita.domain.service.UserService;
import online.grisk.afrodita.integration.activator.impl.DataintegrationActivatorService;
import online.grisk.afrodita.integration.activator.impl.EmailActivatorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpSession;
import java.security.Principal;
import java.util.List;
import java.util.Map;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

@Controller
public class DataintegrationController {

    @Autowired
    UserService userService;

    @Autowired
    EmailActivatorService emailActivatorService;

    @Autowired
    DataintegrationActivatorService dataintegrationActivatorService;

    @Autowired
    List<TypeVariable> getTypesVariables;

    @RequestMapping(value = "/dataintegration", method = GET)
    public String dataIntegration(HttpSession session, Model model, Principal principal) throws Exception {
        model.addAttribute("title", "Data Integration");
        model.addAttribute("description", "Data Integration");
        model.addAttribute("module", "dataintegration");
        Map<String, Object> getDataIntegration = dataintegrationActivatorService.invokeGetDataIntegration(userService.findByUsername(principal.getName()).getOrganization().getIdOrganization());
        if (getDataIntegration.get("status").toString().equalsIgnoreCase("200")) {
            model.addAttribute("dataintegration", getDataIntegration.get("current_response"));
        }
        return "dataintegration/dataintegration";
    }

    @RequestMapping(value = "/dataintegration/setting", method = GET)
    public String dataIntegrationSetting(HttpSession session, Model model, Principal principal) throws Exception {
        model.addAttribute("title", "Data Integration");
        model.addAttribute("description", "Configuración de Data Integration");
        model.addAttribute("module", "dataintegration");
        model.addAttribute("organization", userService.findByUsername(principal.getName()).getOrganization().getIdOrganization());
        model.addAttribute("typesVariables", getTypesVariables);
        model.addAttribute("variablesBureau", dataintegrationActivatorService.getVariableBureau());
        return "dataintegration/dataintegration-setting";
    }
}
