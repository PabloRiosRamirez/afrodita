package online.grisk.afrodita.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FileDataIntegrationDTO {
    Long id_organization;
    MultipartFile file;

    public Map<String, Object> toMap() {
        Map<String, Object> objectMap = new HashMap<>();
        objectMap.put("organization", id_organization);
        objectMap.put("file", file);
        return objectMap;
    }

    public FileDataIntegrationDTO(Map<String, Object> objectMap) {
        this.id_organization = (Long) objectMap.get("organization");
        this.file = (MultipartFile) objectMap.get("file");
    }
}
