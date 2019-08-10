package online.grisk.afrodita.domain.dto;

import java.util.HashMap;
import java.util.Map;

import javax.persistence.Basic;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserUpdateAdminDTO {
	
	@Basic(optional = false)
	@NotNull
	private Long idUser;

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
	private long organizationId;

	@Basic(optional = false)
	@NotNull
	private Short roleId;
	
	@Basic(optional = false)
	@NotNull
	private Short resetPassword;

	public Map<String, Object> toMap() {
		Map<String, Object> objectMap = new HashMap<>();
		objectMap.put("username", username);
		objectMap.put("email", email);
		objectMap.put("pass", pass);
		objectMap.put("organizationId", organizationId);
		objectMap.put("roleId", roleId);
		objectMap.put("resetPassword", resetPassword);
		objectMap.put("idUser", idUser);
		return objectMap;
	}
}
