package com.example.demo.dto;

import com.example.demo.model.GravedadFalla;
import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record FallaRequest(
        @NotNull(message = "El vehículo es obligatorio") Long vehiculoId,
        @NotBlank(message = "El componente es obligatorio") String componente,
        String descripcion,
        @NotNull(message = "La fecha es obligatoria") LocalDate fecha,
        @NotNull(message = "La gravedad es obligatoria") GravedadFalla gravedad,
        boolean resuelta) {}