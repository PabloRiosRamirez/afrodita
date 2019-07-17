package online.grisk.afrodita.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpSession;
import java.security.Principal;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

@Controller
public class IndicatorsController {

    @RequestMapping(value = "/indicators/ratios", method = GET)
    public String indicatorsRatiosPage(HttpSession session, Model model, Principal principal) {
        model.addAttribute("title", "Ratios Risk");
        model.addAttribute("description", "Configuración de Ratios Risk");
        return "indicators/indicators-ratios";
    }
    @RequestMapping(value = "/indicators/tree", method = GET)
    public String indicatorsTreePage(HttpSession session, Model model, Principal principal) {
        model.addAttribute("title", "Business Tree");
        model.addAttribute("description", "Configuración de Business Tree");
        return "indicators/indicators-tree";
    }



}
