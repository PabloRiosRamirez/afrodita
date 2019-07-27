package online.grisk.afrodita.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import javax.persistence.Basic;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.HashMap;
import java.util.Map;

@Data
@AllArgsConstructor
public class UserDTO {
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
    private OrganizationDTO organization;

    public Map<String, Object> toMap() {
        Map<String, Object> objectMap  = new HashMap<>();
        objectMap.put("username", username);
        objectMap.put("email", email);
        objectMap.put("pass", pass);
        objectMap.put("organization", organization);
        return objectMap;
    }
}
