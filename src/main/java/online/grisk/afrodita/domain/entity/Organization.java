package online.grisk.afrodita.domain.entity;

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
        name = "grisk_organization",
        schema = "public",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"rut"})
        })
public class Organization implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id_organization", nullable = false)
    private Long idOrganization;

    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 2147483647)
    @Column(name = "name", nullable = false, length = 2147483647)
    private String name;

    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 2147483647)
    @Column(name = "rut", nullable = false, length = 2147483647)
    private String rut;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "organization")
    private Collection<User> users;

    public Organization() {
    }

    public Organization(Long idOrganization) {
        this.idOrganization = idOrganization;
    }

    public Organization(@NotNull @Size(min = 1, max = 2147483647) String name, @NotNull @Size(min = 1, max = 2147483647) String rut) {
        this.name = name;
        this.rut = rut;
    }

    public Organization(@NotNull @Size(min = 1, max = 2147483647) String name, @NotNull @Size(min = 1, max = 2147483647) String rut, Collection<User> users) {
        this.name = name;
        this.rut = rut;
        this.users = users;
    }

    public Long getIdOrganization() {
        return idOrganization;
    }

    public void setIdOrganization(Long idOrganization) {
        this.idOrganization = idOrganization;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRut() {
        return rut;
    }

    public void setRut(String rut) {
        this.rut = rut;
    }

    public Collection<User> getUsers() {
        return users;
    }

    public void setUsers(Collection<User> users) {
        this.users = users;
    }
}
