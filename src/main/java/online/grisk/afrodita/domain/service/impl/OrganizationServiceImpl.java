package online.grisk.afrodita.domain.service.impl;

import online.grisk.afrodita.domain.entity.Organization;
import online.grisk.afrodita.domain.service.OrganizationService;
import online.grisk.afrodita.persistence.repository.OrganizationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrganizationServiceImpl implements OrganizationService {

    @Autowired
    OrganizationRepository organizationRepository;

    public Organization findByRut(String rut) {
        return organizationRepository.findByRut(rut);
    }

    @Override
    public Organization findById(Long idOrganization) {
        return organizationRepository.findById(idOrganization).get();
    }

    public Organization save(Organization organization) {
        return organizationRepository.save(organization);
    }
}
