package online.grisk.afrodita.entity;


import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.io.Serializable;

public class Email implements Serializable {

    private static final long serialVersionUID = 1L;

    @NotBlank
    @Size(min = 1, max = 2147483647)
    @Pattern(regexp = "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?", message = "Correo electrónico no válido")
    private String address;

    @NotBlank
    @Size(min = 1, max = 2147483647)
    private String subject;

    @NotBlank
    @Size(min = 1, max = 2147483647)
    private String text;

    @NotBlank
    @Size(min = 1, max = 2147483647)
    private String html;

    public Email(@NotBlank @Size(min = 1, max = 2147483647) @Pattern(regexp = "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?", message = "Correo electrónico no válido") String address, @NotBlank @Size(min = 1, max = 2147483647) String subject, @NotBlank @Size(min = 1, max = 2147483647) String text, @NotBlank @Size(min = 1, max = 2147483647) String html) {
        this.address = address;
        this.subject = subject;
        this.text = text;
        this.html = html;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getHtml() {
        return html;
    }

    public void setHtml(String html) {
        this.html = html;
    }
}
