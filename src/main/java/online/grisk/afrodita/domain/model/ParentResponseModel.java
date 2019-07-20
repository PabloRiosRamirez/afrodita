package online.grisk.afrodita.domain.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;

import java.util.Date;
import java.util.UUID;

public class ParentResponseModel {

    private UUID uuid;
    private HttpStatus status;
    private String message;
    private Object response;

    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private Date date;

    private ParentResponseModel(UUID uuid, HttpStatus status, String message, Object response, Date date) {
        this.uuid = uuid;
        this.status = status;
        this.message = message;
        this.response = response;
        this.date = date;
    }

    public UUID getUuid() {
		return uuid;
	}

	public HttpStatus getStatus() {
        return status;
    }

    public String getMessage() {
        return message;
    }

	public Date getDate() {
		return date;
	}

    public Object getResponse() {
        return response;
    }

    public static Message<ParentResponseModel> toMessage(UUID uuid, HttpStatus status, String message, Object response, Date date){
        return MessageBuilder.withPayload(new ParentResponseModel(uuid, status, message, response, date)).build();
    }
}