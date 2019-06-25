package online.grisk.afrodita.service.impl;

import online.grisk.afrodita.entity.Role;
import online.grisk.afrodita.repository.RoleRepository;
import online.grisk.afrodita.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoleServiceImpl implements RoleService{

	@Autowired
    RoleRepository roleRepository;

    public Role findByCode(String code) {
        return roleRepository.findByCode(code);
    }
}
