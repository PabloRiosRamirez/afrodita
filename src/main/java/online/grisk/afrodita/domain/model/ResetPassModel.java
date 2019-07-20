package online.grisk.afrodita.domain.model;

import javax.persistence.Basic;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class ResetPassModel {

    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 2147483647)
    private String email;

    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 2147483647)
    private String token;

    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 2147483647)
    private String pass;


    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getPass() {
        return pass;
    }

    public void setPass(String pass) {
        this.pass = pass;
    }
}
