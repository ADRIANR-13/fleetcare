package com.example.demo.dto;

import com.example.demo.model.Rol;
import jakarta.validation.constraints.*;

public record UsuarioRequest(
        @NotBlank(message = "El usuario es obligatorio")
        @Size(min = 4, message = "El usuario debe tener al menos 4 caracteres") String username,
        String password,
        @NotBlank(message = "El nombre es obligatorio") String nombre,
        @NotNull(message = "El rol es obligatorio") Rol rol,
        boolean activo) {}