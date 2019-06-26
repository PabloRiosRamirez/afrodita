package online.grisk.afrodita.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpSession;
import java.security.Principal;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

@Controller
public class MainController {

    @RequestMapping(value = "/account", method = GET)
    public String accountPage(HttpSession session, Model model, Principal principal) {
        model.addAttribute("title", "Información de cuenta");
        model.addAttribute("description", "Información de cuenta");
        return "account";
    }

    @RequestMapping(value = "/", method = GET)
    public String dashboardPage(HttpSession session, Model model, Principal principal) {
        model.addAttribute("title", "Home");
        model.addAttribute("description", "Página principal de GRisk");
        return "dashboard";
    }

}
