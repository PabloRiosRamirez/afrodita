package online.grisk.afrodita.domain.dto;

import javax.persistence.Basic;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VariableDTO {

	Long idVariable;

	@Basic(optional = false)
	@NotNull
	@Size(min = 1, max = 50)
	String name;

	@Basic(optional = false)
	@NotNull
	@Size(min = 1, max = 50)
	String code;

	@Basic(optional = false)
	@NotNull
	@Size(min = 1, max = 50)
	String type;

	@Basic(optional = false)
	@NotNull
	@Size(min = 1, max = 50)
	String coordinate;

	@Basic(optional = false)
	@NotNull
	@Size(min = 1, max = 50)
	String defaultValue;

}
