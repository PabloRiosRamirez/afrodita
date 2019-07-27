package online.grisk.afrodita.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import javax.persistence.Basic;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Data
@AllArgsConstructor
public class OrganizationDTO {
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 2147483647)
    private String name;

    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 2147483647)
    private String rut;
}
