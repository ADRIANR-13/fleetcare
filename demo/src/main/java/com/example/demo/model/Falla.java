package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "fallas")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Falla {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "vehiculo_id")
    private Vehiculo vehiculo;

    private String componente;
    private String descripcion;
    private LocalDate fecha;

    @Enumerated(EnumType.STRING)
    private GravedadFalla gravedad;

    private boolean resuelta;
}