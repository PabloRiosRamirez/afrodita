package online.grisk.afrodita.presentation.controller.afrodita;

import online.grisk.afrodita.domain.pojo.TypeVariable;
import online.grisk.afrodita.domain.service.RoleService;
import online.grisk.afrodita.domain.service.UserService;
import online.grisk.afrodita.integration.activator.impl.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpSession;
import javax.validation.constraints.NotBlank;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

@Controller
public class AfroditaController {
    @Autowired
    UserService userService;
    @Autowired
    private RoleService roleService;
    @Autowired
    EmailActivatorService emailActivatorService;
    @Autowired
    DataintegrationActivatorService dataintegrationActivatorService;
    @Autowired
    RiskScoreActivatorService riskScoreActivatorService;
    @Autowired
    RiskRatioActivatorService riskRatioActivatorService;
    @Autowired
    BusinessTreeActivatorService businessTreeActivatorService;

    @Autowired
    AfroditaActivatorService afroditaActivatorService;

    @Autowired
    List<TypeVariable> getTypesVariables;

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
            userService.save(userByToken);
            model.addAttribute("proccess", "confirm_by_email_success");
            return "login";
        } catch (Exception e) {
            model.addAttribute("errors", "confirm_by_email_token_failed");
            return "login";
        }
    }

    @RequestMapping(value = "/login/reset/{token}", method = GET)
    public String resetPassByLogin(@NotBlank @PathVariable("token") String token, Model model) throws Exception {
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
        Map<String, Object> getDataIntegration = dataintegrationActivatorService.invokeGetDataIntegration(idOrganization);
        if (getDataIntegration.get("status").toString().equalsIgnoreCase("200")) {
            model.addAttribute("dataintegration", getDataIntegration.get("current_response"));
        }
        Map<String, Object> getScore = riskScoreActivatorService.invokeGetScore(idOrganization);
        if (getScore.get("status").toString().equalsIgnoreCase("200")) {
            model.addAttribute("riskscore", getScore.get("current_response"));
        }
        Map<String, Object> getRatio = riskRatioActivatorService.invokeGetRatio(idOrganization);
        if (getRatio.get("status").toString().equalsIgnoreCase("200")) {
            model.addAttribute("riskratio", getRatio.get("current_response"));
        }
        Map<String, Object> getTree = businessTreeActivatorService.invokeGetTree(idOrganization);
        if (getTree.get("status").toString().equalsIgnoreCase("200")) {
            model.addAttribute("businesstree", getTree.get("current_response"));
        }
        return "analysis";
    }

    @RequestMapping(value = "/users/create", method = GET)
    public String createUserPage(HttpSession session, Model model, Principal principal) throws Exception {
        model.addAttribute("title", "Crear usuario");
        model.addAttribute("description", "Crear usuario");
        Long idOrganization = userService.findByUsername(principal.getName()).getOrganization().getIdOrganization();
        model.addAttribute("organization", idOrganization);
        model.addAttribute("module", "user");
        model.addAttribute("roles", afroditaActivatorService.getRoles());
        return "users/user-create";
    }

    @RequestMapping(value = "/users/edit", method = GET)
    public String editUserPage(HttpSession session, Model model, Principal principal) throws Exception {
        model.addAttribute("title", "Editar usuario");
        model.addAttribute("description", "Editar usuario");
        model.addAttribute("module", "user");
        Long idOrganization = userService.findByUsername(principal.getName()).getOrganization().getIdOrganization();
        model.addAttribute("organization", idOrganization);
        model.addAttribute("roles", afroditaActivatorService.getRoles());
        return "users/user-edit";
    }

}
