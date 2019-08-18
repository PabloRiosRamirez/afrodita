/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package online.grisk.afrodita.domain.pojo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;

/**
 * @author Pablo Ríos Ramírez
 * @email pa.riosramirez@gmail.com
 * @web www.pabloriosramirez.com
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TypeVariable implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long idTypeVariable;

    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 100)
    private String name;

    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 50)
    private String code;

    public TypeVariable(Long idTypeVariable) {
        this.idTypeVariable = idTypeVariable;
    }
}
