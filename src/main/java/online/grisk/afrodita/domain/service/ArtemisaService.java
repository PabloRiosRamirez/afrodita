package online.grisk.afrodita.domain.service;

import lombok.Setter;
import online.grisk.afrodita.domain.dto.ResetPassDTO;
import online.grisk.afrodita.domain.dto.UserDTO;
import online.grisk.afrodita.domain.dto.UserFormDTO;
import online.grisk.afrodita.domain.entity.Organization;
import online.grisk.afrodita.domain.entity.Role;
import online.grisk.afrodita.domain.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.Map;

@Setter
@Service
public class ArtemisaService {

    @Autowired
    private UserService userService;

    @Autowired
    private OrganizationService organizationService;

    @Autowired
    private RoleService roleService;

    @Autowired
    private Role roleWithCodeAdmin;

    @Autowired
    private String token;

    @Autowired
    private BCryptPasswordEncoder encoderPassword;

    public boolean isUserValidForRegister(@Valid UserDTO userDTO) {
        return userService.findByUsernameOrEmail(userDTO.getUsername(), userDTO.getEmail()) == null;
    }
    
    public boolean isUsernameValidForRegister(@Valid UserDTO userDTO) {
        return userService.findByUsername(userDTO.getUsername()) == null;
    }
    public boolean isUsernameValidForRegister(String username) {
        return userService.findByUsername(username) == null;
    }
    
    public boolean isEmailValidForRegister(@Valid UserDTO userDTO) {
        return userService.findByEmail(userDTO.getEmail()) == null;
    }
    public boolean isEmailValidForRegister(String email) {
        return userService.findByEmail(email) == null;
    }


    public boolean isOrganizationValidForRegister(@Valid UserDTO userDTO) {
        return organizationService.findByRut(userDTO.getOrganization().getRut()) == null;
    }

    public User isUserValidForPostResetPass(@Valid ResetPassDTO resetPassDTO) {
        return userService.findByUsernameOrEmail(resetPassDTO.getToken(), resetPassDTO.getEmail());
    }

    public User registerUserAndOrganization(@Valid UserDTO userDTO) {
        return userService
                .save(new User(userDTO.getUsername(), userDTO.getEmail(), organizationService.save(new Organization(userDTO.getOrganization().getName(), userDTO.getOrganization().getRut())), encryte(userDTO.getPass()), null, token,
                        false, true, new Date(), new Date(), roleWithCodeAdmin));
    }
    public User registerUser(@Valid UserFormDTO userDTO) {
        return userService
                .save(new User(userDTO.getUsername(), userDTO.getEmail(), organizationService.findById(userDTO.getOrganization()), encryte(userDTO.getPass()), null, token,
                        false, true, new Date(), new Date(), roleService.findByCode(userDTO.getRol())));
    }

    public User registerUserWithNewPassword(@Valid User user) {
        user.setTokenRestart(null);
        user.setEnabled(true);
        return userService.save(user);
    }

    public User registerTokenForPostReset(@NotNull User user) {
        user.setTokenRestart(token);
        return userService.save(user);
    }

    public String encryte(@NotNull String key) {
        return encoderPassword.encode(key);
    }

    public User isUserValidForResetPass(@NotEmpty Map mapEmail) {
        String email = mapEmail.getOrDefault("email", "").toString();
        if (!email.equals("")) {
            return userService.findByEmail(email);
        }
        return null;
    }
}
