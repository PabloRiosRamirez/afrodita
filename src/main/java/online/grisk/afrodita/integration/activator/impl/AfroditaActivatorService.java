package online.grisk.afrodita.integration.activator.impl;

import online.grisk.afrodita.domain.entity.Role;
import online.grisk.afrodita.domain.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AfroditaActivatorService {
    @Autowired
    RoleService roleService;

    public List<Role> getRoles() {
        return roleService.findAll();
    }
}
