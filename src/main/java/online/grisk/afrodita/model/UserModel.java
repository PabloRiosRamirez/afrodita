package online.grisk.afrodita.model;

import javax.persistence.Basic;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

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

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPass() {
        return pass;
    }

    public void setPass(String pass) {
        this.pass = pass;
    }

    public OrganizationModel getOrganization() {
        return organization;
    }

    public void setEnterprise(OrganizationModel organization) {
        this.organization = organization;
    }
}
