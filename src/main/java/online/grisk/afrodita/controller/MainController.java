package online.grisk.afrodita.controller;

import online.grisk.afrodita.controller.utils.ControllerUtils;
import online.grisk.afrodita.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpSession;
import java.security.Principal;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

@Controller
public class MainController {

    @Autowired
    UserService userService;


    @RequestMapping(value = "/account", method = GET)
    public String accountPage(Model model) {
        model.addAttribute("title", "Información de cuenta");
        model.addAttribute("description", "Información de cuenta");
        return "account";
    }

    @RequestMapping(value = "/", method = GET)
    public String dashboardPage(HttpSession session, Model model, Principal principal) {
        try {
            model.addAttribute("title", "Home");
            User user = ControllerUtils.getUserFromPrincipal(principal);
            session.setAttribute("username", user.getUsername().toUpperCase());
            session.setAttribute("role", userService.findByUsername(user.getUsername()).getRole().getName());
        } catch (NullPointerException e) {
            System.out.println("The necessary permissions for this module have not been assigned");
        }
        return "dashboard";
    }

}
