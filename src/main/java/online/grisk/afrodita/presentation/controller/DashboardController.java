package online.grisk.afrodita.presentation.controller;

import online.grisk.afrodita.domain.entity.TypeVariable;
import online.grisk.afrodita.domain.entity.Variable;
import online.grisk.afrodita.domain.service.UserService;
import online.grisk.afrodita.integration.activator.impl.ArtemisaActivatorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpSession;
import javax.validation.constraints.NotBlank;
import java.security.Principal;
import java.util.List;
import java.util.Map;

import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;

@Controller
public class DashboardController {

    @Autowired
    UserService userService;

    @RequestMapping(value = "/analysis/{idOrganization}/file", method = POST)
    public String analysisByFileExcel(@RequestParam("file") MultipartFile file, @PathVariable Long idOrganization,  Model model, Principal principal) {
        try {
            model.addAttribute("title", "Dashboard");
            model.addAttribute("description", "Resultado de análisis");
            model.addAttribute("module", "analysis");
        } catch (Exception e) {
            model.addAttribute("errors", "analisysError500ByExcel");
        }
        return "dashboard/dashboard-excel";
    }

}
