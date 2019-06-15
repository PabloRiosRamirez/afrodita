package online.grisk.afrodita.utils;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public final class Constant {

    public static final String FORMAT_DATE_PATTERN = "dd-MM-yyyy HH:mm:ss";
    public static final String DATE_TIMEZONE = "America/Santiago";

    private Constant() {
    }

    public static String encryte(String key) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        return encoder.encode(key);
    }
}
