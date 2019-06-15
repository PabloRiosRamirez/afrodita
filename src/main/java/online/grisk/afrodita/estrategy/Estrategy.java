package online.grisk.afrodita.estrategy;

import org.springframework.http.ResponseEntity;

public interface Estrategy {
    ResponseEntity execute(Object object);
}
