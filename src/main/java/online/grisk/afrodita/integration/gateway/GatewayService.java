package online.grisk.afrodita.integration.gateway;

import online.grisk.afrodita.domain.model.ParentResponseModel;
import org.springframework.integration.annotation.Gateway;
import org.springframework.messaging.Message;

import java.util.Map;

public interface GatewayService {
    @Gateway
    Message<ParentResponseModel> process(Message message);
}
