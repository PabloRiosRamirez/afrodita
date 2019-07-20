package online.grisk.afrodita.integration.activator;

import online.grisk.afrodita.domain.entity.Organization;
import online.grisk.afrodita.domain.entity.Role;
import online.grisk.afrodita.domain.entity.User;
import online.grisk.afrodita.domain.model.OrganizationModel;
import online.grisk.afrodita.domain.model.ParentResponseModel;
import online.grisk.afrodita.domain.model.ResetPassModel;
import online.grisk.afrodita.domain.model.UserModel;
import online.grisk.afrodita.integration.activator.utils.ActivatorUtils;
import online.grisk.afrodita.integration.service.OrganizationService;
import online.grisk.afrodita.integration.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.Message;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Component
public class HermesActivatorService {

    @Autowired
    UUID uuid;

    @Autowired
    UserService userService;

    @Autowired
    OrganizationService organizationService;

    @Autowired
    Role roleAdmin;

    @Autowired
    String token;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${HERMES_USER}")
    private String hermesUser;

    @Value("${HERMES_PASS}")
    private String hermesPassword;

    public Message<ParentResponseModel> registerUser(Object object) {
        Message messageError = ParentResponseModel.toMessage(uuid,
                HttpStatus.INTERNAL_SERVER_ERROR, "Ha ocurrido un problema inesperado", null, new Date());
        try {
            UserModel presentedUser = (UserModel) object;
            if (userService.findByUsernameOrEmail(presentedUser.getUsername(), presentedUser.getEmail()) == null) {
                if (restTemplate.exchange("http://hermes/v1/rest/mail/send", HttpMethod.POST, createRequestHermes(presentedUser.getEmail(), "registerUser"), ParentResponseModel.class).getStatusCode() == HttpStatus.OK) {
                    OrganizationModel presentedOrganization = presentedUser.getOrganization();
                    Organization existedOrganization = organizationService.findByRut(presentedOrganization.getRut());
                    if (existedOrganization == null) {
                        existedOrganization = organizationService
                                .save(new Organization(presentedOrganization.getRut(), presentedOrganization.getName()));
                    }
                    User user = userService
                            .save(new User(presentedUser.getUsername(), presentedUser.getEmail(), ActivatorUtils.encryte(presentedUser.getPass()), null, token,
                                    false, true, (short) 0, new Date(), new Date(), existedOrganization, roleAdmin));
                    if (user != null) {
                        return ParentResponseModel.toMessage(uuid, HttpStatus.CREATED,
                                "Se ha enviado correctamente el correo para restablecer contraseña de cuenta.", null, new Date());
                    }
                }
                return messageError;
            } else {
                return ParentResponseModel.toMessage(uuid,
                        HttpStatus.CONFLICT, "Usuario ya registrado con el mismo username y/o email.", null, new Date());
            }
        } catch (Exception e) {
            return messageError;
        }
    }

    public Message<ParentResponseModel> resetPassword(Object object) {
        Message messageError = ParentResponseModel.toMessage(uuid,
                HttpStatus.INTERNAL_SERVER_ERROR, "Ha ocurrido un problema inesperado", null, new Date());
        try {
            User byEmail = userService.findByEmail(object.toString());
            if (byEmail == null) {
                return ParentResponseModel.toMessage(uuid,
                        HttpStatus.NOT_FOUND, "No esta registrado usuarios con este correo electrónico.", new Date(), null);
            }
            if (restTemplate.postForEntity("http://hermes/v1/rest/mail/send", createRequestHermes(object.toString(), "resetPassword"), ParentResponseModel.class).getStatusCode() == HttpStatus.OK) {
                byEmail.setTokenRestart(token);
                User user = userService.save(byEmail);
                return ParentResponseModel.toMessage(uuid, HttpStatus.OK,
                        "Se ha enviado correctamente el correo para restablecer contraseña de cuenta.", null, new Date());
            }
            return messageError;
        } catch (Exception e) {
            return messageError;
        }
    }

    public Message<ParentResponseModel> postResetPassword(Object object) {
        Message messageError = ParentResponseModel.toMessage(uuid,
                HttpStatus.INTERNAL_SERVER_ERROR, "Ha ocurrido un problema inesperado", null, new Date());

        try {
            ResetPassModel request = (ResetPassModel) object;
            User byEmailAndTokenRestart = userService.findByEmailAndTokenRestart(request.getEmail(), request.getToken());
            if (byEmailAndTokenRestart == null) {
                return ParentResponseModel.toMessage(uuid,
                        HttpStatus.NOT_FOUND, "No esta registrado usuarios con este correo electrónico.", null, new Date());
            }
            byEmailAndTokenRestart.setPass(request.getPass());
            byEmailAndTokenRestart.setTokenRestart(null);
            byEmailAndTokenRestart.setEnabled(true);
            byEmailAndTokenRestart.setAttempt((short) 0);
            online.grisk.afrodita.domain.entity.User user = userService.save(byEmailAndTokenRestart);
            return ParentResponseModel.toMessage(uuid, HttpStatus.OK,
                    "Se ha restablecido correctamente la contraseña de su cuenta.", null, new Date());
        } catch (Exception e) {
            return messageError;
        }
    }

    private HttpEntity createRequestHermes(String email, String step) {
        Map<String, String> request = new HashMap<>();
        request.put("address", email);
        request.put("step", step);
        request.put("token", token);
        HttpHeaders headers = new HttpHeaders();
        headers.setBasicAuth(hermesUser, hermesPassword);
        return new HttpEntity(request, headers);
    }
}
