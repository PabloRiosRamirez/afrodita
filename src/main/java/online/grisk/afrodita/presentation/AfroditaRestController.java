package online.grisk.afrodita.presentation;

import online.grisk.afrodita.domain.model.ParentResponseModel;
import online.grisk.afrodita.domain.model.ResetPassModel;
import online.grisk.afrodita.domain.model.UserModel;
import online.grisk.afrodita.integration.gateway.GatewayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RestController
public class AfroditaRestController {

    @Autowired
    GatewayService gatewayService;

    @PostMapping(value = "/v1/rest/user/created-admin-by-login")
    public ResponseEntity<?> createdUserAdminByLogin(@Valid @RequestBody UserModel usuario, Errors errors) {
        if (errors.hasErrors()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        Message<ParentResponseModel> process = gatewayService.process(MessageBuilder.withPayload(usuario)
                .setHeader("step", "registerUser")
                .build());
        return new ResponseEntity<>(process.getPayload(), process.getPayload().getStatus());
    }

    @PostMapping(value = "/v1/rest/user/reset-pass-by-login")
    public ResponseEntity<?> resetPassByLogin(@Valid @RequestBody String email, Errors errors) {
        if (errors.hasErrors()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        Message<ParentResponseModel> process = gatewayService.process(MessageBuilder.withPayload(email)
                .setHeader("step", "resetPassword")
                .build());
        return new ResponseEntity<>(process.getPayload(), process.getPayload().getStatus());
    }

    @PostMapping(value = "/v1/rest/user/post-reset-pass-by-login")
    public ResponseEntity<?> postResetPassByLogin(@Valid @RequestBody ResetPassModel request, Errors errors) {
        if (errors.hasErrors()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        Message<ParentResponseModel> process = gatewayService.process(MessageBuilder.withPayload(request)
                .setHeader("step", "postResetPassword")
                .build());
        return new ResponseEntity<>(process.getPayload(), process.getPayload().getStatus());
    }
}
