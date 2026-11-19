package com.example.demo.dto;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record KilometrajeRequest(
        @NotNull(message = "El vehículo es obligatorio") Long vehiculoId,
        @NotNull(message = "La fecha es obligatoria") LocalDate fecha,
        @Positive(message = "El kilometraje debe ser mayor a 0") double kilometraje) {}