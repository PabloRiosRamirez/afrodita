package online.grisk.afrodita.presentation.controller.afrodita;

import online.grisk.afrodita.domain.entity.TypeVariable;
import online.grisk.afrodita.domain.entity.Variable;
import online.grisk.afrodita.domain.service.UserService;
import online.grisk.afrodita.integration.activator.impl.DataintegrationActivatorService;
import online.grisk.afrodita.integration.activator.impl.EmailActivatorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpSession;
import javax.validation.constraints.NotBlank;
import java.security.Principal;
import java.util.List;
import java.util.Map;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

@Controller
public class AfroditaController {

    @Autowired
    UserService userService;

    @Autowired
    EmailActivatorService emailActivatorService;

    @Autowired
    DataintegrationActivatorService dataintegrationActivatorService;

    @Autowired
    List<TypeVariable> getTypesVariables;

    @Autowired
    List<Variable> getVariablesBureau;

    @RequestMapping(value = "/login", method = GET)
    public String loginPage(Model model) {
        model.addAttribute("title", "Login");
        return "login";
    }

    @RequestMapping(value = "/login/confirm/{token}", method = GET)
    public String confirmUserByLogin(@NotBlank @PathVariable("token") String presentedToken, Model model) {
        try {
            model.addAttribute("title", "Login");
            online.grisk.afrodita.domain.entity.User userByToken = userService.findByTokenConfirm(presentedToken);
            if (userByToken == null) {
                model.addAttribute("errors", "confirm_by_email_token_failed");
                return "login";
            }
            userByToken.setTokenConfirm(null);
            userByToken.setEnabled(true);
            online.grisk.afrodita.domain.entity.User user = userService.save(userByToken);
            model.addAttribute("proccess", "confirm_by_email_success");
            return "login";
        } catch (Exception e) {
            model.addAttribute("errors", "confirm_by_email_token_failed");
            return "login";
        }
    }

    @RequestMapping(value = "/login/reset/{token}", method = GET)
    public String resetPassByLogin(@NotBlank @PathVariable("token") String token, Model model) {
        online.grisk.afrodita.domain.entity.User userByToken = userService.findByTokenRestart(token);
        if (userByToken == null) {
            model.addAttribute("errors", "confirm_by_email_token_failed");
            return "login";
        }
        model.addAttribute("proccess", "restart_by_email");
        model.addAttribute("forgotemail", userByToken.getEmail());
        model.addAttribute("forgottoken", token);
        return "login";
    }

    @RequestMapping(value = "/", method = GET)
    public String analysisPage(HttpSession session, Model model, Principal principal) throws Exception {
        model.addAttribute("title", "Análisis");
        model.addAttribute("description", "Análisis de riesgo");
        model.addAttribute("module", "analysis");
        Long idOrganization = userService.findByUsername(principal.getName()).getOrganization().getIdOrganization();
        model.addAttribute("id_organization", idOrganization);
        Map<String, Object> getDataIntegration = dataintegrationActivatorService.invokeGetDataIntegration(idOrganization);
        if (getDataIntegration.get("status").toString().equalsIgnoreCase("200")) {
            model.addAttribute("dataintegration", getDataIntegration.get("current_response"));
        }
        return "analysis";
    }


    @RequestMapping(value = "/indicators/score", method = GET)
    public String indicatorScore(HttpSession session, Model model, Principal principal) {
        model.addAttribute("title", "Risk Score");
        model.addAttribute("description", "Risk Score");
        model.addAttribute("module", "indicators");
        return "indicator-score/indicator-score";
    }

    @RequestMapping(value = "/indicators/score/setting", method = GET)
    public String indicatorScoreSetting(HttpSession session, Model model, Principal principal) {
        model.addAttribute("title", "Risk Score");
        model.addAttribute("description", "Risk Score");
        model.addAttribute("module", "indicators");
        return "indicator-score/indicator-score-setting";
    }

    @RequestMapping(value = "/indicators/ratios", method = GET)
    public String indicatorsRatios(HttpSession session, Model model, Principal principal) {
        model.addAttribute("title", "Risk Ratios");
        model.addAttribute("description", "Configuración de Risk Ratios");
        model.addAttribute("module", "indicators");
        return "indicators-ratios/indicators-ratios";
    }

    @RequestMapping(value = "/indicators/ratios/setting", method = GET)
    public String indicatorsRatiosSetting(HttpSession session, Model model, Principal principal) {
        model.addAttribute("title", "Risk Ratios");
        model.addAttribute("description", "Configuración de Risk Ratios");
        model.addAttribute("module", "indicators");
        return "indicators-ratios/indicators-ratios-setting";
    }

    @RequestMapping(value = "/indicators/tree", method = GET)
    public String indicatorsTree(HttpSession session, Model model, Principal principal) {
        model.addAttribute("title", "Business Tree");
        model.addAttribute("description", "Configuración de Business Tree");
        model.addAttribute("module", "indicators");
        return "indicators/indicators-tree";
    }

    @RequestMapping(value = "/indicators/tree/setting", method = GET)
    public String indicatorsTreeSetting(HttpSession session, Model model, Principal principal) {
        model.addAttribute("title", "Business Tree");
        model.addAttribute("description", "Configuración de Business Tree");
        model.addAttribute("module", "indicators");
        return "indicators/indicators-tree-setting";
    }

    @RequestMapping(value = "/account", method = GET)
    public String accountPage(HttpSession session, Model model, Principal principal) {
        model.addAttribute("title", "Información de cuenta");
        model.addAttribute("description", "Información de cuenta");
        return "account";
    }

    @RequestMapping(value = "/users/create", method = GET)
    public String createUserPage(HttpSession session, Model model, Principal principal) {
        model.addAttribute("title", "Crear usuario");
        model.addAttribute("description", "Crear usuario");
        model.addAttribute("module", "user");
        return "users/create-user";
    }

    @RequestMapping(value = "/users/edit", method = GET)
    public String editUserPage(HttpSession session, Model model, Principal principal) {
        model.addAttribute("title", "Editar usuario");
        model.addAttribute("description", "Editar usuario");
        model.addAttribute("module", "user");
        return "users/edit-user";
    }

}
