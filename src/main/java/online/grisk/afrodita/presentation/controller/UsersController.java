package online.grisk.afrodita.presentation.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpSession;
import java.security.Principal;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

@Controller
public class UsersController {

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
