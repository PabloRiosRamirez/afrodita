package online.grisk.afrodita.estrategy.impl;

import online.grisk.afrodita.dto.ResponseRestAPI;
import online.grisk.afrodita.entity.User;
import online.grisk.afrodita.estrategy.Estrategy;
import online.grisk.afrodita.model.ResetPassModel;
import online.grisk.afrodita.service.UserService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.UUID;

@Component
public class PostResetPassByLogin implements Estrategy {

    private static final Log logger = LogFactory.getLog(PostResetPassByLogin.class);

    @Autowired
    UUID uuid;

    @Autowired
    UserService userService;

    @Override
    public ResponseEntity<ResponseRestAPI> execute(Object object) {

        ResponseEntity<ResponseRestAPI> problemaInesperado = new ResponseEntity<ResponseRestAPI>(new ResponseRestAPI(uuid,
                HttpStatus.INTERNAL_SERVER_ERROR, "Ha ocurrido un problema inesperado.", new Date(), null),
                HttpStatus.INTERNAL_SERVER_ERROR);
        try {
            ResetPassModel request = (ResetPassModel) object;
            User ByEmailAndTokenRestart = userService.findByEmailAndTokenRestart(request.getEmail(), request.getToken());
            if (ByEmailAndTokenRestart == null) {
                return new ResponseEntity<>(new ResponseRestAPI(uuid,
                        HttpStatus.NOT_FOUND, "No esta registrado usuarios con este correo electrónico.", new Date(), null),
                        HttpStatus.NOT_FOUND);
            }
            ByEmailAndTokenRestart.setPass(request.getPass());
            ByEmailAndTokenRestart.setTokenRestart(null);
            ByEmailAndTokenRestart.setEnabled(true);
            ByEmailAndTokenRestart.setAttempt((short) 0);
            online.grisk.afrodita.entity.User user = userService.save(ByEmailAndTokenRestart);
                return new ResponseEntity<ResponseRestAPI>(new ResponseRestAPI(uuid, HttpStatus.OK,
                        "Se ha restablecido correctamente la contraseña de su cuenta.", new Date(), null), HttpStatus.OK);
        } catch (Exception e) {
            return problemaInesperado;
        }
    }
}
