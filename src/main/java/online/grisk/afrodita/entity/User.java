package online.grisk.afrodita.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import online.grisk.afrodita.utils.Constant;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

/**
 * @author Pablo Rios
 * @email pa.riosramirez@gmail.com
 */

@Entity
@Table(
        name = "grisk_user",
        catalog = "grisk",
        schema = "public",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"username"}),
                @UniqueConstraint(columnNames = {"username", "email", "token_restart", "token_confirm"})
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
    @Size(min = 1, max = 2147483647)
    @Column(name = "username", nullable = false, length = 2147483647)
    private String username;

    @Pattern(regexp = "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?", message = "Correo electrónico no válido")
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 2147483647)
    @Column(name = "email", nullable = false, length = 2147483647)
    private String email;

    @JoinColumn(name = "organization", referencedColumnName = "id_organization", nullable = false)
    @ManyToOne(optional = false)
    private Organization organization;

    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 2147483647)
    @Column(name = "pass", nullable = false, length = 2147483647)
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

    @Basic(optional = false)
    @NotNull
    @Column(name = "attempt", nullable = false)
    private short attempt;

    @Column(name = "create_at")
    @Temporal(TemporalType.TIMESTAMP)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = Constant.FORMAT_DATE_PATTERN, timezone = Constant.DATE_TIMEZONE)
    private Date createAt;

    @Basic(optional = false)
    @NotNull
    @Column(name = "update_at", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = Constant.FORMAT_DATE_PATTERN, timezone = Constant.DATE_TIMEZONE)
    private Date updateAt;

    @JsonManagedReference
    @JoinColumn(name = "role", referencedColumnName = "id_role", nullable = false)
    @ManyToOne(optional = false)
    private Role role;

    public User() {
    }

    public User(Long idUser) {
        this.idUser = idUser;
    }

    public User(@NotNull @Size(min = 1, max = 2147483647) String username,
                @Pattern(regexp = "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?", message = "Correo electrónico no válido") @NotNull @Size(min = 1, max = 2147483647) String email,
                @NotNull @Size(min = 1, max = 2147483647) String pass,
                String tokenRestart,
                String tokenConfirm,
                @NotNull boolean enabled,
                @NotNull boolean nonLocked,
                @NotNull short attempt,
                Date createAt,
                @NotNull Date updateAt,
                Organization organization,
                Role role) {
        this.username = username;
        this.email = email;
        this.pass = pass;
        this.tokenRestart = tokenRestart;
        this.tokenConfirm = tokenConfirm;
        this.enabled = enabled;
        this.nonLocked = nonLocked;
        this.attempt = attempt;
        this.createAt = createAt;
        this.updateAt = updateAt;
        this.organization = organization;
        this.role = role;
    }

    public Long getIdUser() {
        return idUser;
    }

    public void setIdUser(Long idUser) {
        this.idUser = idUser;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPass() {
        return pass;
    }

    public void setPass(String pass) {
        this.pass = pass;
    }

    public String getTokenRestart() {
        return tokenRestart;
    }

    public void setTokenRestart(String tokenRestart) {
        this.tokenRestart = tokenRestart;
    }

    public String getTokenConfirm() {
        return tokenConfirm;
    }

    public void setTokenConfirm(String tokenConfirm) {
        this.tokenConfirm = tokenConfirm;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public boolean isNonLocked() {
        return nonLocked;
    }

    public void setNonLocked(boolean nonLocked) {
        this.nonLocked = nonLocked;
    }

    public short getAttempt() {
        return attempt;
    }

    public void setAttempt(short attempt) {
        this.attempt = attempt;
    }

    public Date getCreateAt() {
        return createAt;
    }

    public void setCreateAt(Date createAt) {
        this.createAt = createAt;
    }

    public Date getUpdateAt() {
        return updateAt;
    }

    public void setUpdateAt(Date updateAt) {
        this.updateAt = updateAt;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Organization getOrganization() {
        return organization;
    }

    public void setOrganization(Organization organization) {
        this.organization = organization;
    }

}
