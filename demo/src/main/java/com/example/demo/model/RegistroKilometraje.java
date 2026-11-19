package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "registros_kilometraje")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class RegistroKilometraje {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "vehiculo_id")
    private Vehiculo vehiculo;

    private LocalDate fecha;
    private double kilometraje;
}