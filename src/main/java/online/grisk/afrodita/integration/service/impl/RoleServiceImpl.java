package online.grisk.afrodita.integration.service.impl;

import online.grisk.afrodita.domain.entity.Role;
import online.grisk.afrodita.persistence.repository.RoleRepository;
import online.grisk.afrodita.integration.service.RoleService;
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
