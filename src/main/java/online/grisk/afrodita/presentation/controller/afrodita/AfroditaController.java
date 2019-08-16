package online.grisk.afrodita.presentation.controller.afrodita;

import online.grisk.afrodita.domain.entity.Role;
import online.grisk.afrodita.domain.entity.TypeVariable;
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
    ScoreActivatorService scoreActivatorService;

    @Autowired
    RatioActivatorService ratioActivatorService;

    @Autowired
    TreeActivatorService treeActivatorService;

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
        model.addAttribute("id_organization", idOrganization);
        Map<String, Object> getDataIntegration = dataintegrationActivatorService.invokeGetDataIntegration(idOrganization);
        if (getDataIntegration.get("status").toString().equalsIgnoreCase("200")) {
            model.addAttribute("dataintegration", getDataIntegration.get("current_response"));
        }
        Map<String, Object> getScore = scoreActivatorService.invokeGetScore(idOrganization);
        if (getScore.get("status").toString().equalsIgnoreCase("200")) {
            model.addAttribute("score", getScore.get("current_response"));
        }
        Map<String, Object> getRatio = ratioActivatorService.invokeGetRatio(idOrganization);
        if (getRatio.get("status").toString().equalsIgnoreCase("200")) {
            model.addAttribute("ratios", getRatio.get("current_response"));
        }
        Map<String, Object> getTree = treeActivatorService.invokeGetTree(idOrganization);
        if (getTree.get("status").toString().equalsIgnoreCase("200")) {
            model.addAttribute("tree", getTree.get("current_response"));
        }
        return "analysis";
    }


    @RequestMapping(value = "/indicators/score", method = GET)
    public String indicatorScore(HttpSession session, Model model, Principal principal) throws Exception {
        model.addAttribute("title", "Risk Score");
        model.addAttribute("description", "Risk Score");
        model.addAttribute("module", "indicators");
        Long idOrganization = userService.findByUsername(principal.getName()).getOrganization().getIdOrganization();
        Map<String, Object> getDataIntegration = dataintegrationActivatorService.invokeGetDataIntegration(idOrganization);
        if (getDataIntegration.get("status").toString().equalsIgnoreCase("200")) {
            model.addAttribute("dataintegration", getDataIntegration.get("current_response"));
            Map<String, Object> getScore = scoreActivatorService.invokeGetScore(idOrganization);
            if (getScore.get("status").toString().equalsIgnoreCase("200")) {
            	model.addAttribute("score", getScore.get("current_response"));
            }
        }
        return "indicator_score/indicator_score";
    }

    @RequestMapping(value = "/indicators/score/setting", method = GET)
    public String indicatorScoreSetting(HttpSession session, Model model, Principal principal) throws Exception {
        model.addAttribute("title", "Risk Score");
        model.addAttribute("description", "Risk Score");
        model.addAttribute("module", "indicators");
        Long idOrganization = userService.findByUsername(principal.getName()).getOrganization().getIdOrganization();
        model.addAttribute("id_organization", idOrganization);
        Map<String, Object> getDataIntegration = dataintegrationActivatorService.invokeGetDataIntegration(idOrganization);
        if (getDataIntegration.get("status").toString().equalsIgnoreCase("200")) {
            model.addAttribute("dataintegration", getDataIntegration.get("current_response"));
            List<Map> variablesNumeric = new ArrayList<>();
            for (Map<String, Object> variable : (List<Map>) ((Map<String, Object>) getDataIntegration.get("current_response")).getOrDefault("variablesCollection", new ArrayList<>())) {
                if ((boolean) variable.getOrDefault("bureau", false))
                    variablesNumeric.add(variable);
            }
            model.addAttribute("variables", variablesNumeric);
        }
        return "indicator_score/indicator_score-setting";
    }
    @RequestMapping(value = "/indicators/ratios", method = GET)
    public String indicatorRatios(HttpSession session, Model model, Principal principal) throws Exception {
        model.addAttribute("title", "Risk Ratios");
        model.addAttribute("description", "Risk Ratios");
        model.addAttribute("module", "indicators");
        Long idOrganization = userService.findByUsername(principal.getName()).getOrganization().getIdOrganization();
        Map<String, Object> getDataIntegration = dataintegrationActivatorService.invokeGetDataIntegration(idOrganization);
        if (getDataIntegration.get("status").toString().equalsIgnoreCase("200")) {
            model.addAttribute("dataintegration", getDataIntegration.get("current_response"));
            Map<String, Object> getRatios = ratioActivatorService.invokeGetRatio(idOrganization);
            if (getRatios.get("status").toString().equalsIgnoreCase("200")) {
            	model.addAttribute("ratios", getRatios.get("current_response"));
            }
        }
        return "indicator_ratios/indicator_ratios";
    }


    @RequestMapping(value = "/indicators/ratios/setting", method = GET)
    public String indicatorRatiosSetting(HttpSession session, Model model, Principal principal) throws Exception {
        model.addAttribute("title", "Risk Ratios");
        model.addAttribute("description", "Risk Ratios");
        model.addAttribute("module", "indicators");
        Long idOrganization = userService.findByUsername(principal.getName()).getOrganization().getIdOrganization();
        model.addAttribute("id_organization", idOrganization);
        Map<String, Object> getDataIntegration = dataintegrationActivatorService.invokeGetDataIntegration(idOrganization);
        if (getDataIntegration.get("status").toString().equalsIgnoreCase("200")) {
            model.addAttribute("dataintegration", getDataIntegration.get("current_response"));
            List<Map> variablesNumeric = new ArrayList<>();
            for (Map<String, Object> variable : (List<Map>) ((Map<String, Object>) getDataIntegration.get("current_response")).getOrDefault("variablesCollection", new ArrayList<>())) {
                if ((boolean) variable.getOrDefault("bureau", false))
                    variablesNumeric.add(variable);
            }
            model.addAttribute("variables", variablesNumeric);
        }
        return "indicator_ratios/indicator_ratios-setting";
    }

    /*@RequestMapping(value = "/indicators/ratios", method = GET)
    public String indicatorsRatios(HttpSession session, Model model, Principal principal) {
        model.addAttribute("title", "Risk Ratios");
        model.addAttribute("description", "Configuración de Risk Ratios");
        model.addAttribute("module", "indicators");
        return "indicator_ratios/indicator_ratios";
    }*/

    /*@RequestMapping(value = "/indicators/ratios/setting", method = GET)
    public String indicatorsRatiosSetting(HttpSession session, Model model, Principal principal) throws Exception {
        model.addAttribute("title", "Risk Ratios");
        model.addAttribute("description", "Configuración de Risk Ratios");
        model.addAttribute("module", "indicators");
        Long idOrganization = userService.findByUsername(principal.getName()).getOrganization().getIdOrganization();
        model.addAttribute("id_organization", idOrganization);
        Map<String, Object> getDataIntegration = dataintegrationActivatorService.invokeGetDataIntegration(idOrganization);
        getDataIntegration.put("variables", getDataIntegration.get("_childNode"));
        return "indicator_ratios/indicator_ratios-setting";
    }*/

    @RequestMapping(value = "/indicators/tree", method = GET)
    public String indicatorsTree(HttpSession session, Model model, Principal principal) throws Exception {
        model.addAttribute("title", "Business Tree");
        model.addAttribute("description", "Configuración de Business Tree");
        model.addAttribute("module", "indicators");
        Long idOrganization = userService.findByUsername(principal.getName()).getOrganization().getIdOrganization();
        Map<String, Object> getDataIntegration = dataintegrationActivatorService.invokeGetDataIntegration(idOrganization);
        if (getDataIntegration.get("status").toString().equalsIgnoreCase("200")) {
            model.addAttribute("dataintegration", getDataIntegration.get("current_response"));
            Map<String, Object> getTree = treeActivatorService.invokeGetTree(idOrganization);
            if (getTree.get("status").toString().equalsIgnoreCase("200")) {
                model.addAttribute("tree", getTree.get("current_response"));
            }
        }
        return "indicator_tree/indicator_tree";
    }

    @RequestMapping(value = "/indicators/tree/setting", method = GET)
    public String indicatorsTreeSetting(HttpSession session, Model model, Principal principal) {
        model.addAttribute("title", "Business Tree");
        model.addAttribute("description", "Configuración de Business Tree");
        model.addAttribute("module", "indicators");
        return "indicator_tree/indicator_tree-setting";
    }

    @RequestMapping(value = "/users/create", method = GET)
    public String createUserPage(HttpSession session, Model model, Principal principal) throws Exception {
        model.addAttribute("title", "Crear usuario");
        model.addAttribute("description", "Crear usuario");
        Long idOrganization = userService.findByUsername(principal.getName()).getOrganization().getIdOrganization();
        model.addAttribute("id_organization", idOrganization);
        model.addAttribute("module", "user");
//        List<Role> roles = afroditaActivatorService.getRoles();
//        for (int i = 0; i < roles.size(); i++) {
//			roles.get(i).setUsers(null);
//		}
        model.addAttribute("roles", afroditaActivatorService.getRoles());
        return "users/user-create";
    }

    @RequestMapping(value = "/users/edit", method = GET)
    public String editUserPage(HttpSession session, Model model, Principal principal) throws Exception {
        model.addAttribute("title", "Editar usuario");
        model.addAttribute("description", "Editar usuario");
        model.addAttribute("module", "user");
        Long idOrganization = userService.findByUsername(principal.getName()).getOrganization().getIdOrganization();
        model.addAttribute("id_organization", idOrganization);
//      List<Role> roles = afroditaActivatorService.getRoles();
//      for (int i = 0; i < roles.size(); i++) {
//			roles.get(i).setUsers(null);
//		}
      model.addAttribute("roles", afroditaActivatorService.getRoles());
//        model.addAttribute("user", userService.findByUsername(principal.getName()));
        return "users/user-edit";
    }

}
