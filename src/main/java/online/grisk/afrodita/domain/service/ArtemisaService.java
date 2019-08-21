package online.grisk.afrodita.domain.service;

import lombok.Setter;
import online.grisk.afrodita.domain.dto.ResetPassDTO;
import online.grisk.afrodita.domain.dto.UserDTO;
import online.grisk.afrodita.domain.dto.UserRegistrationAdminDTO;
import online.grisk.afrodita.domain.dto.UserUpdateAdminDTO;
import online.grisk.afrodita.domain.entity.Organization;
import online.grisk.afrodita.domain.entity.Role;
import online.grisk.afrodita.domain.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Date;
import java.util.Map;
import java.util.UUID;

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
    private BCryptPasswordEncoder encoderPassword;

    public boolean isUserValidForRegister(@Valid UserDTO userDTO) throws Exception {
        return userService.findByUsernameOrEmail(userDTO.getUsername().toUpperCase(), userDTO.getEmail().toLowerCase()) == null;
    }

    public boolean isUsernameValidForRegister(@Valid UserDTO userDTO) throws Exception {
        return userService.findByUsername(userDTO.getUsername().toUpperCase()) == null;
    }

    public boolean isEmailValidForRegister(@Valid UserDTO userDTO) throws Exception {
        return userService.findByEmail(userDTO.getEmail().toLowerCase()) == null;
    }

    public boolean isOrganizationValidForRegister(@Valid UserDTO userDTO) {
        return organizationService.findByRut(userDTO.getOrganization().getRut()) == null;
    }

    public User isUserValidForPostResetPass(@Valid ResetPassDTO resetPassDTO) throws Exception {
        return userService.findByUsernameOrEmail(resetPassDTO.getToken(), resetPassDTO.getEmail().toLowerCase());
    }

    public User registerUserAndOrganization(@Valid UserDTO userDTO) throws Exception {
        return userService.save(new User(userDTO.getUsername().toUpperCase(), userDTO.getEmail().toLowerCase(),
                organizationService.save(
                        new Organization(userDTO.getOrganization().getName(), userDTO.getOrganization().getRut())),
                encryte(userDTO.getPass()), null, token(), false, true, new Date(), new Date(), roleWithCodeAdmin));
    }

    public User registerUserAdmin(@Valid UserRegistrationAdminDTO userRegistrationAdminDTO) throws Exception {
        return userService.save(new User(userRegistrationAdminDTO.getUsername().toUpperCase(), userRegistrationAdminDTO.getEmail().toLowerCase(),
                organizationService.findOne(userRegistrationAdminDTO.getOrganizationId()),
                encryte(userRegistrationAdminDTO.getPass()), null, token(), false, true, new Date(), new Date(), roleService.findOne(userRegistrationAdminDTO.getRoleId())));
    }

    public User updateUserAdmin(UserUpdateAdminDTO userUpdateAdminDTO) throws Exception {
        User usr = userService.findByIdUser(userUpdateAdminDTO.getIdUser());
        usr.setUsername(userUpdateAdminDTO.getUsername().toUpperCase());
        usr.setEmail(userUpdateAdminDTO.getEmail().toLowerCase());
        return userService.save(usr);
    }

    public User registerUserWithNewPassword(@Valid User user) throws Exception {
        user.setTokenRestart(null);
        user.setEnabled(true);
        return userService.save(user);
    }

    public User registerTokenForPostReset(@NotNull User user) throws Exception {
        user.setTokenRestart(token());
        return userService.save(user);
    }

    public String encryte(@NotNull String key) {
        return encoderPassword.encode(key);
    }

    public User isUserValidForResetPass(@NotEmpty Map mapEmail) throws Exception {
        String email = mapEmail.getOrDefault("email", "").toString();
        if (!email.equals("")) {
            return userService.findByEmail(email.toLowerCase());
        }
        return null;
    }

    private String token() {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] messageDigest = md.digest(UUID.randomUUID().toString().getBytes());
            BigInteger no = new BigInteger(1, messageDigest);
            String hashtext = no.toString(16);
            while (hashtext.length() < 32) {
                hashtext = "0" + hashtext;
            }
            return hashtext;
        } catch (NoSuchAlgorithmException e) {
            return UUID.randomUUID().toString();
        }
    }
}
