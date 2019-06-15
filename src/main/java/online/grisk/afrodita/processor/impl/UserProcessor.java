package online.grisk.afrodita.processor.impl;

import online.grisk.afrodita.dto.ResponseRestAPI;
import online.grisk.afrodita.estrategy.Estrategy;
import online.grisk.afrodita.processor.Processor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

@Component
public class UserProcessor implements Processor {

    @Override
    public ResponseEntity<ResponseRestAPI> run(Object object, Estrategy estrategy) {
        return estrategy.execute(object);
    }
}
