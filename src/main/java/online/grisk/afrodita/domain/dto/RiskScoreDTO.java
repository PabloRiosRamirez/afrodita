package online.grisk.afrodita.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RiskScoreDTO {

    Long organization;
    String titule;
    String variable;
    Collection<RiskScoreRangeDTO> ranges;

    public Map<String, Object> toMap() {
        Map<String, Object> objectMap = new HashMap<>();
        objectMap.put("organization", organization);
        objectMap.put("titule", titule);
        objectMap.put("variable", variable);
        objectMap.put("ranges", ranges);
        return objectMap;
    }
}
