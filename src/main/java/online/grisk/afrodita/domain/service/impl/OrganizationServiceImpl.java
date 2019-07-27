package online.grisk.afrodita.domain.service.impl;

import online.grisk.afrodita.domain.entity.Organization;
import online.grisk.afrodita.persistence.repository.OrganizationRepository;
import online.grisk.afrodita.domain.service.OrganizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrganizationServiceImpl implements OrganizationService {

    @Autowired
    OrganizationRepository organizationRepository;

    public Organization findByRut(String rut) {
        return organizationRepository.findByRut(rut);
    }

    public Organization save(Organization organization) {
        return organizationRepository.save(organization);
    }
}
