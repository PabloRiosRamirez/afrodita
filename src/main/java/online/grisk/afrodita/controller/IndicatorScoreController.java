package online.grisk.afrodita.controller;

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
        model.addAttribute("title", "Score Risk");
        model.addAttribute("description", "Score Risk");
        return "indicator-score/indicator-score";
    }

    @RequestMapping(value = "/indicators/score/setting", method = GET)
    public String indicatorScoreSttingPage(HttpSession session, Model model, Principal principal) {
        model.addAttribute("title", "Score Risk");
        model.addAttribute("description", "Configuración de Score Risk");
        return "indicator-score/indicator-score-setting";
    }



}
