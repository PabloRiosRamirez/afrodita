package online.grisk.afrodita.presentation.controller.afrodita;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import online.grisk.afrodita.domain.entity.Role;
import online.grisk.afrodita.domain.service.RoleService;

@RestController
public class RoleController {

	@Autowired
	private RoleService roleService;
	
	@RequestMapping(value = "/v1/rest/roles", method = RequestMethod.GET)
	public ResponseEntity<?> findAll() {
		try {
			return new ResponseEntity<List<Role>>(roleService.findAll(), HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<String>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
