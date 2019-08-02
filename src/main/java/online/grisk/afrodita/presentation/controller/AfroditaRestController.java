package online.grisk.afrodita.presentation.controller;

import online.grisk.afrodita.domain.dto.DataIntegrationDTO;
import online.grisk.afrodita.domain.dto.FileDataIntegrationDTO;
import online.grisk.afrodita.domain.dto.ResetPassDTO;
import online.grisk.afrodita.domain.dto.UserDTO;
import online.grisk.afrodita.integration.activator.impl.ArtemisaActivatorService;
import online.grisk.afrodita.integration.gateway.GatewayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.Headers;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.util.Assert;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import java.util.HashMap;
import java.util.Map;

@RestController
public class AfroditaRestController {

    @Autowired
    GatewayService gateway;


    @Autowired
    ArtemisaActivatorService artemisaActivatorService;

    @PostMapping(value = "/v1/rest/user/created-admin-by-login")
    public HttpEntity<?> createdUserAdminByLogin(@Valid @RequestBody UserDTO userDTO, Errors errors) {
        if (errors.hasErrors()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        this.verifyParameters(userDTO.toMap());
        return invokeServiceActivator(userDTO.toMap(), new HashMap(), "sendEmailRegisterUser");
    }

    @PostMapping(value = "/v1/rest/user/reset-pass-by-login")
    public HttpEntity<?> resetPassByLogin(@NotEmpty @Payload @RequestBody Map payload, @NotEmpty @Headers @RequestHeader Map headers) {
        this.verifyParameters(payload);
        return invokeServiceActivator(payload, new HashMap(), "sendEmailResetPassword");
    }

    @PostMapping(value = "/v1/rest/user/post-reset-pass-by-login")
    public HttpEntity<?> postResetPassByLogin(@Valid @RequestBody ResetPassDTO resetPassDTO, Errors errors) {
        if (errors.hasErrors()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        this.verifyParameters(resetPassDTO.toMap());
        return invokeServiceActivator(resetPassDTO.toMap(), new HashMap(), "postResetPassword");
    }

    @PostMapping(value = "/v1/rest/data-integration")
    public HttpEntity<?> registerDataIntegrationExcel(@Valid @RequestBody DataIntegrationDTO dataIntegrationDTO, Errors errors) {
        if (errors.hasErrors()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        this.verifyParameters(dataIntegrationDTO.toMap());
        return invokeServiceActivator(dataIntegrationDTO.toMap(), new HashMap(), "registerDataIntegrationExcel");
    }

    @PostMapping(value = "/v1/rest/data-integration/{id_dataintegration}")
    public HttpEntity<?> updateDataIntegrationExcel(@RequestParam("file") MultipartFile file, @PathVariable Long id_dataintegration) {
        FileDataIntegrationDTO fileDataIntegrationDTO = new FileDataIntegrationDTO(id_dataintegration, file);
        this.verifyParameters(fileDataIntegrationDTO.toMap());
        return invokeServiceActivator(fileDataIntegrationDTO.toMap(), new HashMap(), "updateDataIntegrationExcel");
    }


    @GetMapping("/v1/rest/data-integration/organization/{id_organization}/file")
    public ResponseEntity<Resource> getDataIntegrationByFile(@PathVariable long idOrganization) throws Exception {
        Map<String, Object> getDataIntegration = artemisaActivatorService.invokeGetDataIntegration(idOrganization);
        if (getDataIntegration.get("status").toString().equalsIgnoreCase("200") && getDataIntegration.get("current_response") != null) {
            return ResponseEntity.ok().contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + ((Map<String, Object>) getDataIntegration.get("current_response")).get("analyticsFileName").toString() + "\"")
                    .body(new ByteArrayResource((byte[]) ((Map<String, Object>) getDataIntegration.get("current_response")).get("analyticsFile")));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    private void verifyParameters(Map payload) {
        Assert.notEmpty(payload, "Payload required");
    }

    private HttpEntity<?> invokeServiceActivator(@NotEmpty @Payload @RequestBody Map payload, @NotEmpty @Headers @RequestHeader Map headers, String action) {
        Map<String, Object> request = new HashMap<>();
        request.put("request", payload);
        Message build = MessageBuilder.withPayload(request).setHeader("action", action).build();
        Map process = gateway.process(build);
        return new ResponseEntity<>(process, HttpStatus.valueOf(Integer.parseInt(process.getOrDefault("status", "500").toString())));
    }
}
