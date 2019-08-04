package online.grisk.afrodita.domain.entity;

import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.HttpMethod;

import java.util.Map;

@Data
@AllArgsConstructor
public class Microservice {

    @ApiModelProperty("Service Id")
    private String serviceId;

    @ApiModelProperty("Service Call Method")
    private HttpMethod serviceCallMethod;

    @ApiModelProperty("Service Path")
    private String servicePath;

    @ApiModelProperty("Service Username")
    private String serviceUsername;

    @ApiModelProperty("Service Password")
    private String servicePassword;

    @ApiModelProperty("Service Headers")
    private Map<String, Object> serviceHeaders;


    public String getUri() {
        return String.format("http://%s%s", this.serviceId, this.servicePath);
    }
}
