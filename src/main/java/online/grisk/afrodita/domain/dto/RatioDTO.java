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
public class RatioDTO {

	private String titule;
	private String color;
	private String postResult; // fix
	private String operation; // expresion
	private short orderDisplay; // orden array llegada

	public Map<String, Object> toMap() {
		Map<String, Object> objectMap = new HashMap<>();
		objectMap.put("titule", titule);
		objectMap.put("color", color);
		objectMap.put("postResult", postResult);
		objectMap.put("operation", operation);
		objectMap.put("orderDisplay", orderDisplay);
		return objectMap;
	}

}
