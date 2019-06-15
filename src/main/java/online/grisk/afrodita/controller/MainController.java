package online.grisk.afrodita.controller;

import online.grisk.afrodita.controller.utils.ControllerUtils;
import online.grisk.afrodita.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpSession;
import javax.validation.constraints.NotBlank;
import javax.xml.bind.annotation.adapters.HexBinaryAdapter;
import java.security.MessageDigest;
import java.security.Principal;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

@Controller
public class MainController {

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
                return "redirect:/login?confirm=tokenfailed";
            }
            userByToken.setTokenConfirm(null);
            userByToken.setEnabled(true);
            userByToken.setAttempt((short) 0);
            online.grisk.afrodita.entity.User user = userService.save(userByToken);
            return "redirect:/login?confirm=success";
        } catch (Exception e) {
            return "redirect:/login?confirm=failed";
        }
    }

    @RequestMapping(value = "/login/reset/{token}", method = GET)
    public String resetPassByLogin(@NotBlank @PathVariable("token") String token, Model model) {
        model.addAttribute("title", "Login");
        return "redirect:/login?reset=success";
    }

    @RequestMapping(value = {"/", "/dashboard"}, method = GET)
    public String dashboardPage(HttpSession session, Model model, Principal principal) {
        try {
            model.addAttribute("title", "Dashboard");

            User user = ControllerUtils.getUserFromPrincipal(principal);
            session.setAttribute("user", userService.findByUsername(user.getUsername()));

            model.addAttribute("userInfo", ControllerUtils.toString(user));
        } catch (NullPointerException e) {
            System.out.println("The necessary permissions for this module have not been assigned");
        }
        return "dashboard";
    }

    @RequestMapping(value = {"/configuration"}, method = GET)
    public String configurationPage(Model model, Principal principal) {
        try {
            model.addAttribute("title", "Configuration");

            User user = ControllerUtils.getUserFromPrincipal(principal);

            model.addAttribute("userInfo", ControllerUtils.toString(user));
        } catch (NullPointerException e) {
            System.out.println("The necessary permissions for this module have not been assigned");
        }
        return "configuration";
    }

    @RequestMapping(value = {"/tree-business"}, method = GET)
    public String treeBusinessPage(Model model, Principal principal) {
        try {
            model.addAttribute("title", "Tree Business");
            User user = ControllerUtils.getUserFromPrincipal(principal);
            model.addAttribute("userInfo", ControllerUtils.toString(user));
        } catch (NullPointerException e) {
            System.out.println("The necessary permissions for this module have not been assigned");
        }
        return "tree-business";
    }

    @RequestMapping(value = {"/reports"}, method = GET)
    public String reportsPage(Model model, Principal principal) {
        try {
            model.addAttribute("title", "Reports");
            User user = ControllerUtils.getUserFromPrincipal(principal);
            model.addAttribute("userInfo", ControllerUtils.toString(user));
        } catch (NullPointerException e) {
            System.out.println("The necessary permissions for this module have not been assigned");
        }
        return "reports";
    }

    @RequestMapping(value = {"/403"}, method = GET)
    public String accessDenied(Model model, Principal principal) {
        if (principal != null) {
            User user = (User) ((Authentication) principal).getPrincipal();
            model.addAttribute("userInfo", ControllerUtils.toString(user));
            String message = "Hi " + principal.getName() //
                    + "<br> You do not have permission to access this page!";
            model.addAttribute("message", message);
        }

        return "403Page";
    }

}
