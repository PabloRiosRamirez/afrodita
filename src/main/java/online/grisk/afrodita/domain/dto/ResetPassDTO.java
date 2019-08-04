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
public class ResetPassDTO {

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

    public Map toMap() {
        Map<String, Object> objectMap = new HashMap<>();
        objectMap.put("email", email);
        objectMap.put("token", token);
        objectMap.put("pass", pass);
        return objectMap;
    }
}
