package online.grisk.afrodita.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VariableBureauDTO {
    String name;
    String type;
    String coordenate;
    String valueDefault;


}
