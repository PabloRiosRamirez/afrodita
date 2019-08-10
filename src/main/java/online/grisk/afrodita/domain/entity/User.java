package online.grisk.afrodita.domain.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.Date;

/**
 * @author Pablo Rios
 * @email pa.riosramirez@gmail.com
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(
        name = "user",
        schema = "public",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"username", "email"})
        })
public class User implements Serializable {

    static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id_user", nullable = false)
    private Long idUser;

    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 50)
    @Column(name = "username", nullable = false)
    private String username;

    @Pattern(regexp = "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?", message = "Correo electrónico no válido")
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 50)
    @Column(name = "email", nullable = false)
    private String email;

    @JsonManagedReference
    @JoinColumn(name = "organization", referencedColumnName = "id_organization", nullable = false)
    @ManyToOne(optional = false)
    private Organization organization;

    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 100)
    @Column(name = "pass", nullable = false)
    private String pass;

    @Column(name = "token_restart")
    private String tokenRestart;

    @Column(name = "token_confirm")
    private String tokenConfirm;

    @Basic(optional = false)
    @NotNull
    @Column(name = "enabled", nullable = false)
    private boolean enabled;

    @Basic(optional = false)
    @NotNull
    @Column(name = "non_locked", nullable = false)
    private boolean nonLocked;

    @Column(name = "create_at")
    @Temporal(TemporalType.TIMESTAMP)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private Date createAt;

    @Basic(optional = false)
    @NotNull
    @Column(name = "update_at", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private Date updateAt;

    @JsonManagedReference
    @JoinColumn(name = "role", referencedColumnName = "id_role", nullable = false)
    @ManyToOne(optional = false)
    private Role role;

    public User(@NotNull @Size(min = 1, max = 50) String username, @Pattern(regexp = "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?", message = "Correo electrónico no válido") @NotNull @Size(min = 1, max = 50) String email, Organization organization, @NotNull @Size(min = 1, max = 100) String pass, String tokenRestart, String tokenConfirm, @NotNull boolean enabled, @NotNull boolean nonLocked, Date createAt, @NotNull Date updateAt, Role role) {
        this.username = username;
        this.email = email;
        this.organization = organization;
        this.pass = pass;
        this.tokenRestart = tokenRestart;
        this.tokenConfirm = tokenConfirm;
        this.enabled = enabled;
        this.nonLocked = nonLocked;
        this.createAt = createAt;
        this.updateAt = updateAt;
        this.role = role;
    }
}
