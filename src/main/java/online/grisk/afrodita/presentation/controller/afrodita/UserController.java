package online.grisk.afrodita.presentation.controller.afrodita;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import online.grisk.afrodita.domain.entity.User;
import online.grisk.afrodita.domain.service.UserService;

@RestController
public class UserController {

	@Autowired
	private UserService userService;

	@RequestMapping(value = "/v1/rest/users", method = RequestMethod.POST)
	public ResponseEntity<?> createUser(@Valid @RequestBody User user) {
		try {
			return new ResponseEntity<User>(userService.save(user), HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<String>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@RequestMapping(value = "/v1/rest/users", method = RequestMethod.PUT)
	public ResponseEntity<?> updateUser(@Valid @RequestBody User user) {
		try {
			return new ResponseEntity<User>(userService.update(user), HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<String>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@RequestMapping(value = "/v1/rest/users/search", method = RequestMethod.GET)
	public ResponseEntity<?> search(@RequestParam(name = "username", required = true) String username, @RequestParam(name = "email", required = true) String email) {
		try {
			if((username == null && email == null) || (username.isEmpty() && email.isEmpty())) {
				return new ResponseEntity<String>("Debe ingresar al menos un parametro de busqueda: [username,email]", HttpStatus.INTERNAL_SERVER_ERROR);
			}
			User user = userService.findByUsernameOrEmail(username, email);
			return user == null ? new ResponseEntity<Object>(HttpStatus.NOT_FOUND) : new ResponseEntity<Object>(user, HttpStatus.OK);		
		} 
		catch (Exception e) {
			return new ResponseEntity<String>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

}
