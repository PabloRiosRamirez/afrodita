package online.grisk.afrodita.domain.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
        name = "role",
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
    @Size(min = 1, max = 50)
    @Column(name = "name", nullable = false)
    private String name;

    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 25)
    @Column(name = "code", nullable = false)
    private String code;

    @JsonBackReference
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "role")
    private Collection<User> users;

    public Role(@NotNull @Size(min = 1, max = 50) String name, @NotNull @Size(min = 1, max = 25) String code) {
        this.name = name;
        this.code = code;
    }
}
