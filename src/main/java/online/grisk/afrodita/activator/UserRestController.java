package online.grisk.afrodita.activator;

import online.grisk.afrodita.dto.ResponseRestAPI;
import online.grisk.afrodita.estrategy.impl.CreatedUserAdminByLogin;
import online.grisk.afrodita.estrategy.impl.PostResetPassByLogin;
import online.grisk.afrodita.estrategy.impl.ResetPassByLogin;
import online.grisk.afrodita.model.ResetPassModel;
import online.grisk.afrodita.model.UserModel;
import online.grisk.afrodita.processor.Processor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.context.ApplicationContext;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.*;

@RestController
public class UserRestController {

    @Autowired
    private ApplicationContext context;

    @Autowired
    Processor userProcessor;

    @PostMapping(value = "/v1/rest/user/created-admin-by-login")
    public ResponseEntity<ResponseRestAPI> createdUserAdminByLogin(@Valid @RequestBody UserModel usuario, Errors errors) {
        if (errors.hasErrors()) {
            return new ResponseEntity<ResponseRestAPI>(HttpStatus.BAD_REQUEST);
        }
        return userProcessor.run(usuario, context.getBean(CreatedUserAdminByLogin.class));
    }

    @Autowired
    private DiscoveryClient discoveryClient;

    @GetMapping(value = "/getUrl")
    public ResponseEntity<ResponseRestAPI> serviceUrl() {
        List<ServiceInstance> list = discoveryClient.getInstances("AFRODITA");
        Map <String, String> map = new HashMap();
        if (list != null && list.size() > 0) {
            map.put(list.size()+"", list.get(0).getUri().toString()+":"+list.get(0).getPort()+"    /   "+list.get(0).getHost());
        }
        return new ResponseEntity<ResponseRestAPI>(new ResponseRestAPI(UUID.randomUUID(), HttpStatus.OK, "", map, new Date()), HttpStatus.OK);

    }

    @PostMapping(value = "/v1/rest/user/reset-pass-by-login")
    public ResponseEntity<ResponseRestAPI> resetPassByLogin(@Valid @RequestBody String email, Errors errors) {
        if (errors.hasErrors()) {
            return new ResponseEntity<ResponseRestAPI>(HttpStatus.BAD_REQUEST);
        }
        return userProcessor.run(email, context.getBean(ResetPassByLogin.class));
    }

    @PostMapping(value = "/v1/rest/user/post-reset-pass-by-login")
    public ResponseEntity<ResponseRestAPI> postResetPassByLogin(@Valid @RequestBody ResetPassModel request, Errors errors) {
        if (errors.hasErrors()) {
            return new ResponseEntity<ResponseRestAPI>(HttpStatus.BAD_REQUEST);
        }
        return userProcessor.run(request, context.getBean(PostResetPassByLogin.class));
    }
}
