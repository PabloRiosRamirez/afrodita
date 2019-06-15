package online.grisk.afrodita.entity;

import java.io.Serializable;
import java.util.Collection;
import javax.persistence.Basic;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 * @author Pablo Rios
 * @email pa.riosramirez@gmail.com
 */

@Entity
@Table(
        name = "grisk_organization",
        catalog = "grisk",
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
