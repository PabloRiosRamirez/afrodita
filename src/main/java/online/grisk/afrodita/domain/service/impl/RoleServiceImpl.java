package online.grisk.afrodita.domain.service.impl;

import online.grisk.afrodita.domain.entity.Role;
import online.grisk.afrodita.domain.service.RoleService;
import online.grisk.afrodita.persistence.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoleServiceImpl implements RoleService {

    @Autowired
    RoleRepository roleRepository;

    public Role findByCode(String code) {
        return roleRepository.findByCode(code);
    }
}
