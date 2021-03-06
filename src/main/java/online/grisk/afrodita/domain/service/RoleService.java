package online.grisk.afrodita.domain.service;

import online.grisk.afrodita.domain.entity.Role;

import java.util.List;

public interface RoleService {

    public Role findByCode(String code);
    public Role findOne(short id);
    public List<Role> findAll();

}
