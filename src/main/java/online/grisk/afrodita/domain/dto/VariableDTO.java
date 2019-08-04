package online.grisk.afrodita.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VariableDTO {

    Long idVariable;
    String name;
    String code;
    String type;
    String coordenate;
    String valueDefault;


}
