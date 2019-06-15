package online.grisk.afrodita.service;

import online.grisk.afrodita.entity.Organization;

public interface OrganizationService {
	
	public Organization findByRut(String rut);
	
	public Organization save(Organization organization);
	
}
