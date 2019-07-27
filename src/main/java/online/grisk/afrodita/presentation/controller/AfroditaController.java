package online.grisk.afrodita.presentation.controller;

import online.grisk.afrodita.domain.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import javax.servlet.http.HttpSession;
import javax.validation.constraints.NotBlank;
import java.security.Principal;
import static org.springframework.web.bind.annotation.RequestMethod.GET;

@Controller
public class AfroditaController {

    @Autowired
    UserService userService;

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
    public String analysisPage(HttpSession session, Model model, Principal principal) {
        model.addAttribute("title", "Análisis");
        model.addAttribute("description", "Análisis de riesgo");
        model.addAttribute("module", "analisis");
        return "dashboard";
    }

    @RequestMapping(value = "/data-integration/excel", method = GET)
    public String dataIntegrationExcel(HttpSession session, Model model, Principal principal) {
        model.addAttribute("title", "Data Integration Excel");
        model.addAttribute("description", "Configuración de Data Integration en modo Excel");
        return "data-integration/data_integration-excel";
    }

    @RequestMapping(value = "/data-integration/bureau", method = GET)
    public String dataIntegrationBureau(HttpSession session, Model model, Principal principal) {
        model.addAttribute("title", "Data Integration Bureau");
        model.addAttribute("description", "Configuración de Data Integration en modo Bureau");
        return "data-integration/data_integration-bureau";
    }

    @RequestMapping(value = "/indicators/ratios", method = GET)
    public String indicatorsRatiosPage(HttpSession session, Model model, Principal principal) {
        model.addAttribute("title", "Risk Ratios");
        model.addAttribute("description", "Configuración de Risk Ratios");
        return "indicators/indicators-ratios";
    }
    @RequestMapping(value = "/indicators/tree", method = GET)
    public String indicatorsTreePage(HttpSession session, Model model, Principal principal) {
        model.addAttribute("title", "Business Tree");
        model.addAttribute("description", "Configuración de Business Tree");
        return "indicators/indicators-tree";
    }

    @RequestMapping(value = "/indicators/score", method = GET)
    public String indicatorScorePage(HttpSession session, Model model, Principal principal) {
        model.addAttribute("title", "Risk Score");
        model.addAttribute("description", "Risk Score");
        return "indicator-score/indicator-score";
    }

    @RequestMapping(value = "/indicators/score/setting", method = GET)
    public String indicatorScoreSttingPage(HttpSession session, Model model, Principal principal) {
        model.addAttribute("title", "Risk Score");
        model.addAttribute("description", "Configuración de Risk Score");
        return "indicator-score/indicator-score-setting";
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
        return "users/create-user";
    }

    @RequestMapping(value = "/users/edit", method = GET)
    public String editUserPage(HttpSession session, Model model, Principal principal) {
        model.addAttribute("title", "Editar usuario");
        model.addAttribute("description", "Editar usuario");
        return "users/edit-user";
    }

}
