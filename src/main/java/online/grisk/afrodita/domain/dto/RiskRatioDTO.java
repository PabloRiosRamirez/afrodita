package online.grisk.afrodita.domain.dto;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RiskRatioDTO {
	
	Long organization;
	Collection<RiskRatioRatioDTO> ratios;

	public Map<String, Object> toMap() {
		Map<String, Object> objectMap = new HashMap<>();
		objectMap.put("organization", organization);
		objectMap.put("ratios", ratios);
		return objectMap;
	}
}
