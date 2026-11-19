package com.example.demo.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "vehiculos")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Vehiculo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "La placa es obligatoria")
    @Size(min = 6, max = 10, message = "La placa debe tener entre 6 y 10 caracteres")
    @Column(nullable = false, unique = true)
    private String placa;

    @NotBlank(message = "La marca es obligatoria")
    private String marca;

    @NotBlank(message = "El modelo es obligatorio")
    private String modelo;

    @Min(value = 1990, message = "El año debe ser 1990 o mayor")
    private int anio;

    @PositiveOrZero(message = "El kilometraje no puede ser negativo")
    private double kilometraje;

    @NotBlank(message = "El estado es obligatorio")
    private String estado; // OPERATIVO, EN_MANTENIMIENTO, FUERA_DE_SERVICIO
}