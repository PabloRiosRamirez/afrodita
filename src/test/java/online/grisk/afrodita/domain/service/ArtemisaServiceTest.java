package online.grisk.afrodita.domain.service;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.junit.Assert.*;

public class ArtemisaServiceTest {

    ArtemisaService artemisaService = new ArtemisaService();

    @Before
    public void setUp() throws Exception {
        artemisaService.setEncoderPassword(new BCryptPasswordEncoder());
    }

    @Test
    public void isUserValidForRegister() {
    }

    @Test
    public void isUserValidForPostResetPass() {
    }

    @Test
    public void registerUserAndOrganization() {
    }

    @Test
    public void registerUserWithNewPassword() {
    }

    @Test
    public void registerTokenForPostReset() {
    }

    @Test
    public void encryte() {
        String encryte = artemisaService.encryte("prios");
        Assert.assertNotNull(encryte);
    }

    @Test
    public void isUserValidForResetPass() {
    }
}