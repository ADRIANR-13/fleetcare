package com.example.demo.dto;

import com.example.demo.model.EstadoMantenimiento;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

public record MantenimientoRequest(
        @NotNull(message = "El vehículo es obligatorio") Long vehiculoId,
        @NotNull(message = "El tipo es obligatorio") Long tipoId,
        @NotNull(message = "La fecha es obligatoria") LocalDate fecha,
        @PositiveOrZero(message = "El kilometraje no puede ser negativo") double kilometraje,
        @NotNull(message = "El costo es obligatorio")
        @PositiveOrZero(message = "El costo no puede ser negativo") BigDecimal costo,
        String descripcion,
        @NotNull(message = "El estado es obligatorio") EstadoMantenimiento estado) {}