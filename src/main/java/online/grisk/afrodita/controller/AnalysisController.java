package online.grisk.afrodita.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

@Controller
public class AnalysisController {

    @RequestMapping(value = "/analysis", method = GET)
    public String analysisPage(Model model) {
        model.addAttribute("title", "Análisis");
        return "analysis";
    }
}
