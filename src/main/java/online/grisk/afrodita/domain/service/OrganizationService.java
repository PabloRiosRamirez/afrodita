package online.grisk.afrodita.domain.service;

import online.grisk.afrodita.domain.entity.Organization;

public interface OrganizationService {

    public Organization findByRut(String rut);

    public Organization save(Organization organization);

}
