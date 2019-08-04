package online.grisk.afrodita.presentation.controller;

import online.grisk.afrodita.integration.gateway.GatewayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.Headers;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

import javax.validation.constraints.NotEmpty;
import java.util.HashMap;
import java.util.Map;

public class BasicRestController {

    @Autowired
    GatewayService gateway;

    protected void verifyParameters(Map payload) {
        Assert.notEmpty(payload, "Payload required");
    }

    protected HttpEntity<?> invokeServiceActivator(@NotEmpty @Payload @RequestBody Map payload, @NotEmpty @Headers @RequestHeader Map headers, String action) {
        Map<String, Object> request = new HashMap<>();
        request.put("request", payload);
        Message build = MessageBuilder.withPayload(request).setHeader("action", action).build();
        Map process = gateway.process(build);
        return new ResponseEntity<>(process, HttpStatus.valueOf(Integer.parseInt(process.getOrDefault("status", "500").toString())));
    }

    protected Map createHeadersWithAction(String action) {
        Map<String, Object> headers = new HashMap<>();
        headers.put("action", action);
        return headers;
    }
}
