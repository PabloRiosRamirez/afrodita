package online.grisk.afrodita.processor;

import online.grisk.afrodita.estrategy.Estrategy;
import org.springframework.http.ResponseEntity;

public interface Processor {
    ResponseEntity run(Object object, Estrategy estrategy);
}
