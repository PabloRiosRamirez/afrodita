package online.grisk.afrodita.domain.dto;

import java.util.HashMap;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NodeTreeDTO {

	private String id;
	private Integer order;
	private boolean output;
	private String label;
	private String color;
	private boolean main;
	private String expression;
	private String childrenNegation;
	private String childrenAffirmation;

	public Map<String, Object> toMap() {
		Map<String, Object> objectMap = new HashMap<>();
		objectMap.put("id", id);
		objectMap.put("order", order);
		objectMap.put("output", output);
		objectMap.put("label", label);
		objectMap.put("color", color);
		objectMap.put("main", main);
		objectMap.put("expression", expression);
		objectMap.put("childrenNegation", childrenNegation);
		objectMap.put("childrenAffirmation", childrenAffirmation);
		return objectMap;
	}
}