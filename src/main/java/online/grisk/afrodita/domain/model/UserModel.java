package online.grisk.afrodita.domain.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Basic;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Data
@AllArgsConstructor
public class UserModel {
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 2147483647)
    private String username;

    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 2147483647)
    private String email;

    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 2147483647)
    private String pass;

    @Basic(optional = false)
    @NotNull
    private OrganizationModel organization;
}
