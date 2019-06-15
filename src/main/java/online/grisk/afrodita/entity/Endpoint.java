package online.grisk.afrodita.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;

import java.io.Serializable;
import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 * @author Pablo Rios
 * @email pa.riosramirez@gmail.com
 */

@Entity
@Table(name = "grisk_endpoint", catalog = "grisk", schema = "public")
public class Endpoint implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id_endpoint", nullable = false)
    private Short idEndpoint;
    
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 2147483647)
    @Column(name = "uri", nullable = false, length = 2147483647)
    private String uri;
    
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 2147483647)
    @Column(name = "display", nullable = false, length = 2147483647)
    private String display;
    
    @Basic(optional = false)
    @NotNull
    @Column(name = "display_order", nullable = false)
    private short displayOrder;
    
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 2147483647)
    @Column(name = "icon", nullable = false, length = 2147483647)
    private String icon;

    @JsonBackReference
    @JoinColumn(name = "module", referencedColumnName = "id_module", nullable = false)
    @ManyToOne(optional = false)
    private Module module;

    public Endpoint() {
    }

    public Endpoint(Short idEndpoint) {
        this.idEndpoint = idEndpoint;
    }

    public Endpoint(Short idEndpoint, String uri, String display, short displayOrder, String icon) {
        this.idEndpoint = idEndpoint;
        this.uri = uri;
        this.display = display;
        this.displayOrder = displayOrder;
        this.icon = icon;
    }

    public Short getIdEndpoint() {
        return idEndpoint;
    }

    public void setIdEndpoint(Short idEndpoint) {
        this.idEndpoint = idEndpoint;
    }

    public String getUri() {
        return uri;
    }

    public void setUri(String uri) {
        this.uri = uri;
    }

    public String getDisplay() {
        return display;
    }

    public void setDisplay(String display) {
        this.display = display;
    }

    public short getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(short displayOrder) {
        this.displayOrder = displayOrder;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public Module getModule() {
        return module;
    }

    public void setModule(Module module) {
        this.module = module;
    }
    
}
