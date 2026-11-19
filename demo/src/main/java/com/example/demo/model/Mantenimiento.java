package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "mantenimientos")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Mantenimiento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "vehiculo_id")
    private Vehiculo vehiculo;

    @ManyToOne(optional = false)
    @JoinColumn(name = "tipo_id")
    private TipoMantenimiento tipo;

    private LocalDate fecha;
    private double kilometraje;

    @Column(precision = 12, scale = 2)
    private BigDecimal costo;

    private String descripcion;

    @Enumerated(EnumType.STRING)
    private EstadoMantenimiento estado;
}