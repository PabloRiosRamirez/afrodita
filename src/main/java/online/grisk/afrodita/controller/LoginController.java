package online.grisk.afrodita.controller;

import online.grisk.afrodita.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.validation.constraints.NotBlank;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

@Controller
public class LoginController {

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
            online.grisk.afrodita.entity.User userByToken = userService.findByTokenConfirm(presentedToken);
            if (userByToken == null) {
                model.addAttribute("errors", "confirm_by_email_token_failed");
                return "login";
            }
            userByToken.setTokenConfirm(null);
            userByToken.setEnabled(true);
            userByToken.setAttempt((short) 0);
            online.grisk.afrodita.entity.User user = userService.save(userByToken);
            model.addAttribute("proccess", "confirm_by_email_success");
            return "login";
        } catch (Exception e) {
            model.addAttribute("errors", "confirm_by_email_token_failed");
            return "login";
        }
    }

    @RequestMapping(value = "/login/reset/{token}", method = GET)
    public String resetPassByLogin(@NotBlank @PathVariable("token") String token, Model model) {
        online.grisk.afrodita.entity.User userByToken = userService.findByTokenRestart(token);
        if (userByToken == null) {
            model.addAttribute("errors", "confirm_by_email_token_failed");
            return "login";
        }
        model.addAttribute("proccess", "restart_by_email");
        model.addAttribute("forgotemail", userByToken.getEmail());
        model.addAttribute("forgottoken", token);
        return "login";
    }

}
