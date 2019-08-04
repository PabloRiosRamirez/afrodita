package online.grisk.afrodita.domain.service;

import online.grisk.afrodita.domain.entity.Role;

public interface RoleService {

    public Role findByCode(String code);
}
