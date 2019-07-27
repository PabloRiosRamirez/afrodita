package online.grisk.afrodita.domain.entity;

import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.Collection;

/**
 * @author Pablo Rios
 * @email pa.riosramirez@gmail.com
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(
        name = "organization",
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
    @Size(min = 1, max = 100)
    @Column(name = "name", nullable = false)
    private String name;

    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 25)
    @Column(name = "rut", nullable = false)
    private String rut;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "organization")
    private Collection<User> users;

    public Organization(@NotNull @Size(min = 1, max = 100) String name, @NotNull @Size(min = 1, max = 25) String rut) {
        this.name = name;
        this.rut = rut;
    }
}
