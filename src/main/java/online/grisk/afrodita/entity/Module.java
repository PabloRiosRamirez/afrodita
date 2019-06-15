package online.grisk.afrodita.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.io.Serializable;
import java.util.Collection;
import javax.persistence.Basic;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 * @author Pablo Rios
 * @email pa.riosramirez@gmail.com
 */

@Entity
@Table(name = "grisk_module", catalog = "grisk", schema = "public")
public class Module implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id_module", nullable = false)
    private Short idModule;

    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 2147483647)
    @Column(name = "display", nullable = false, length = 2147483647)
    private String display;

    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 2147483647)
    @Column(name = "icon", nullable = false, length = 2147483647)
    private String icon;

    @Basic(optional = false)
    @NotNull
    @Column(name = "display_order", nullable = false)
    private short displayOrder;

    @Size(max = 2147483647)
    @Column(name = "uri", length = 2147483647)
    private String uri;

    @JsonBackReference
    @JoinTable(name = "role_has_module", joinColumns = {
        @JoinColumn(name = "module", referencedColumnName = "id_module", nullable = false)}, inverseJoinColumns = {
        @JoinColumn(name = "role", referencedColumnName = "id_role", nullable = false)})
    @ManyToMany
    private Collection<Role> roles;

    @JsonManagedReference
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "module")
    private Collection<Endpoint> endpoints;

    public Module() {
    }

    public Module(Short idModule) {
        this.idModule = idModule;
    }

    public Module(@NotNull @Size(min = 1, max = 2147483647) String display, @NotNull @Size(min = 1, max = 2147483647) String icon, @NotNull short displayOrder, @Size(max = 2147483647) String uri, Collection<Role> roles, Collection<Endpoint> endpoints) {
        this.display = display;
        this.icon = icon;
        this.displayOrder = displayOrder;
        this.uri = uri;
        this.roles = roles;
        this.endpoints = endpoints;
    }

    public Short getIdModule() {
        return idModule;
    }

    public void setIdModule(Short id) {
        this.idModule = id;
    }

    public String getDisplay() {
        return display;
    }

    public void setDisplay(String display) {
        this.display = display;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public short getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(short displayOrder) {
        this.displayOrder = displayOrder;
    }

    public String getUri() {
        return uri;
    }

    public void setUri(String uri) {
        this.uri = uri;
    }

    public Collection<Role> getRoles() {
        return roles;
    }

    public void setRoles(Collection<Role> roles) {
        this.roles = roles;
    }

    public Collection<Endpoint> getEndpoints() {
        return endpoints;
    }

    public void setEndpoints(Collection<Endpoint> endpoints) {
        this.endpoints = endpoints;
    }
}
