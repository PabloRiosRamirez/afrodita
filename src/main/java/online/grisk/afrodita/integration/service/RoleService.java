package online.grisk.afrodita.integration.service;

import online.grisk.afrodita.domain.entity.Role;

public interface RoleService {

	public Role findByCode(String code);
}
