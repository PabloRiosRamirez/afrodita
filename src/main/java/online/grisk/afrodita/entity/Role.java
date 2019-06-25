package online.grisk.afrodita.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.Collection;

/**
 * @author Pablo Rios
 * @email pa.riosramirez@gmail.com
 */

@Entity
@Table(
        name = "grisk_role",
        schema = "public",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"code"})
        })
public class Role implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id_role", nullable = false)
    private Short idRole;

    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 2147483647)
    @Column(name = "name", nullable = false, length = 2147483647)
    private String name;

    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 2147483647)
    @Column(name = "code", nullable = false, length = 2147483647)
    private String code;

    @JsonManagedReference
    @ManyToMany(mappedBy = "roles")
    private Collection<Module> modules;

    @JsonBackReference
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "role")
    private Collection<User> users;

    public Role() {
    }

    public Role(Short idRole) {
        this.idRole = idRole;
    }

    public Role(Short idRole, String name, String code) {
        this.idRole = idRole;
        this.name = name;
        this.code = code;
    }

    public Short getIdRole() {
        return idRole;
    }

    public void setIdRole(Short idRole) {
        this.idRole = idRole;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Collection<Module> getModules() {
        return modules;
    }

    public void setModules(Collection<Module> modules) {
        this.modules = modules;
    }

    public Collection<User> getUsers() {
        return users;
    }

    public void setUsers(Collection<User> users) {
        this.users = users;
    }
}
