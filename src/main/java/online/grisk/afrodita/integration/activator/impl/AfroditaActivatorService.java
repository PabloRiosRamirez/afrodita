package online.grisk.afrodita.integration.activator.impl;

import online.grisk.afrodita.domain.entity.Microservice;
import online.grisk.afrodita.domain.entity.Role;
import online.grisk.afrodita.domain.entity.Variable;
import online.grisk.afrodita.domain.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AfroditaActivatorService {

    @Autowired
    RoleService roleService;

    //    Action for 'roles'
    public List<Role> getRoles() {
        return roleService.findAll();
    }
}
