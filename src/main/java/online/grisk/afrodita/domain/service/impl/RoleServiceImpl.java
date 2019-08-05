package online.grisk.afrodita.domain.service.impl;

import online.grisk.afrodita.domain.entity.Role;
import online.grisk.afrodita.domain.service.RoleService;
import online.grisk.afrodita.persistence.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RoleServiceImpl implements RoleService {

    @Autowired
    RoleRepository roleRepository;

    public Role findByCode(String code) {
        return roleRepository.findByCode(code);
    }

    public List<Role> findAll() {
        List<Role> list = new ArrayList<>();
        roleRepository.findAll().forEach(list::add);
        return list;
    }
}
