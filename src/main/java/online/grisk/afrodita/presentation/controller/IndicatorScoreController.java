package online.grisk.afrodita.presentation.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpSession;
import java.security.Principal;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

@Controller
public class IndicatorScoreController {

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



}
