package online.grisk.afrodita.presentation.controller.afrodita;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

import java.security.Principal;

import javax.servlet.http.HttpSession;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import online.grisk.afrodita.domain.entity.User;
import online.grisk.afrodita.domain.service.UserService;

@Controller
public class UserController {

	@Autowired
	private UserService userService;

	@RequestMapping(value = "/users/create", method = RequestMethod.POST)
	public ResponseEntity<?> createUser(@Valid @RequestBody User user) {
		try {
			return new ResponseEntity<User>(userService.save(user), HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<String>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@RequestMapping(value = "/users/edit", method = GET)
	public ResponseEntity<?> editUserPage(HttpSession session, Model model, Principal principal) {
		try {
			return new ResponseEntity<User>(userService.up(user), HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<String>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

}
