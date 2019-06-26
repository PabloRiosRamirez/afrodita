package online.grisk.afrodita.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpSession;
import java.security.Principal;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

@Controller
public class DataIntegrationController {

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

}
