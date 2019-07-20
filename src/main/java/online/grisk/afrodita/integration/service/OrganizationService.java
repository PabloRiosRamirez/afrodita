package online.grisk.afrodita.integration.service;

import online.grisk.afrodita.domain.entity.Organization;

public interface OrganizationService {
	
	public Organization findByRut(String rut);
	
	public Organization save(Organization organization);
	
}
