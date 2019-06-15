package online.grisk.afrodita.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import online.grisk.afrodita.utils.Constant;

import org.springframework.http.HttpStatus;

import java.util.Date;
import java.util.UUID;

public class ResponseRestAPI {

    private UUID uuid;
    private HttpStatus status;
    private String message;
    private Object response;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = Constant.FORMAT_DATE_PATTERN, timezone = Constant.DATE_TIMEZONE)
    private Date date;

    public ResponseRestAPI() {
    }

    public ResponseRestAPI(UUID uuid, HttpStatus status, String message, Object response, Date date) {
        this.uuid = uuid;
        this.status = status;
        this.message = message;
        this.response = response;
        this.date = date;
    }

    public UUID getUuid() {
		return uuid;
	}

	public void setUuid(UUID uuid) {
		this.uuid = uuid;
	}

	public HttpStatus getStatus() {
        return status;
    }

    public void setStatus(HttpStatus status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}
}