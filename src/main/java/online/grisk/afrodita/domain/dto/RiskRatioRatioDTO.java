package online.grisk.afrodita.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashMap;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RiskRatioRatioDTO {

    private String titule;
    private String color;
    private String postResult;
    private String expression;

    public Map<String, Object> toMap() {
        Map<String, Object> objectMap = new HashMap<>();
        objectMap.put("titule", titule);
        objectMap.put("color", color);
        objectMap.put("postResult", postResult);
        objectMap.put("expression", expression);
        return objectMap;
    }

}
