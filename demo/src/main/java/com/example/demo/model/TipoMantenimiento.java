package com.example.demo.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "tipos_mantenimiento")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class TipoMantenimiento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    @Column(nullable = false, unique = true)
    private String nombre;

    @NotNull(message = "La categoría es obligatoria")
    @Enumerated(EnumType.STRING)
    private CategoriaMantenimiento categoria;

    @Positive(message = "El intervalo en km debe ser mayor a 0")
    private Integer intervaloKm;

    @Positive(message = "El intervalo en días debe ser mayor a 0")
    private Integer intervaloDias;

    private String descripcion;
}