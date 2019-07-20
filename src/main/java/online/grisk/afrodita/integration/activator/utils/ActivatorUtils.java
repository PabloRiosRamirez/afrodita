package online.grisk.afrodita.integration.activator.utils;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class ActivatorUtils {
    public static String encryte(String key) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        return encoder.encode(key);
    }
}
