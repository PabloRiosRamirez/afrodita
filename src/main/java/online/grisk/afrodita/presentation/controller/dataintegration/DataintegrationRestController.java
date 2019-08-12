package online.grisk.afrodita.presentation.controller.dataintegration;

import online.grisk.afrodita.domain.dto.DataIntegrationDTO;
import online.grisk.afrodita.domain.dto.FileDataIntegrationDTO;
import online.grisk.afrodita.integration.activator.impl.DataintegrationActivatorService;
import online.grisk.afrodita.presentation.controller.BasicRestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
public class DataintegrationRestController extends BasicRestController {

    @Autowired
    DataintegrationActivatorService dataIntegrationActivatorService;

    @PostMapping(value = "/v1/rest/dataintegration/excel")
    public HttpEntity<?> registerDataIntegrationExcel(@Valid @RequestBody DataIntegrationDTO dataIntegrationDTO, Errors errors) throws Exception {
        if (errors.hasErrors()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        this.verifyParameters(dataIntegrationDTO.toMap());
        Map response = dataIntegrationActivatorService.invokeRegisterDataIntegrationExcel(dataIntegrationDTO.toMap(), new HashMap());
        return new ResponseEntity<>(response, HttpStatus.valueOf(Integer.parseInt(response.getOrDefault("status", "500").toString())));
    }

    @PutMapping(value = "/v1/rest/dataintegration/{idDataIntegration}/excel")
    public HttpEntity<?> updateDataIntegrationExcel(@RequestParam("file") MultipartFile file, @PathVariable Long idDataIntegration) throws Exception {
        FileDataIntegrationDTO fileDataIntegrationDTO = new FileDataIntegrationDTO(idDataIntegration, file);
        this.verifyParameters(fileDataIntegrationDTO.toMap());
        Map response = dataIntegrationActivatorService.invokeUpdateDataIntegrationExcel(fileDataIntegrationDTO.toMap(), new HashMap());
        return new ResponseEntity<>(null, HttpStatus.valueOf(Integer.parseInt(response.getOrDefault("status", "500").toString())));
    }

    @PostMapping(value = "/v1/rest/dataintegration/bureau")
    public HttpEntity<?> registerDataIntegrationBureau(@Valid @RequestBody DataIntegrationDTO dataIntegrationDTO, Errors errors) throws Exception {
        if (errors.hasErrors()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        this.verifyParameters(dataIntegrationDTO.toMap());
        Map response = dataIntegrationActivatorService.invokeRegisterDataIntegrationBureau(dataIntegrationDTO.toMap(), new HashMap());
        return new ResponseEntity<>(response, HttpStatus.valueOf(Integer.parseInt(response.getOrDefault("status", "500").toString())));
    }

    @GetMapping("/v1/rest/dataintegration/organization/{id_organization}/file")
    public ResponseEntity<Resource> getDataIntegrationByFile(@PathVariable long idOrganization) throws Exception {
        Map<String, Object> getDataIntegration = dataIntegrationActivatorService.invokeGetDataIntegration(idOrganization);
        if (getDataIntegration.get("status").toString().equalsIgnoreCase("200") && getDataIntegration.get("current_response") != null) {
            return ResponseEntity.ok().contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + ((Map<String, Object>) getDataIntegration.get("current_response")).get("analyticsFileName").toString() + "\"")
                    .body(new ByteArrayResource((byte[]) ((Map<String, Object>) getDataIntegration.get("current_response")).get("analyticsFile")));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
