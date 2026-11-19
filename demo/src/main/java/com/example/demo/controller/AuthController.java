package com.example.demo.controller;

import com.example.demo.dto.AuthResponse;
import com.example.demo.dto.LoginRequest;
import com.example.demo.model.Usuario;
import com.example.demo.repository.UsuarioRepository;
import com.example.demo.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtil;

    public AuthController(UsuarioRepository usuarioRepository, PasswordEncoder encoder, JwtUtil jwtUtil) {
        this.usuarioRepository = usuarioRepository;
        this.encoder = encoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest req) {
        Usuario u = usuarioRepository.findByUsername(req.username())
                .filter(Usuario::isActivo)
                .orElseThrow(() -> new BadCredentialsException("Usuario o contraseña incorrectos"));

        if (!encoder.matches(req.password(), u.getPassword())) {
            throw new BadCredentialsException("Usuario o contraseña incorrectos");
        }
        return new AuthResponse(jwtUtil.generar(u.getUsername(), u.getRol().name()),
                u.getUsername(), u.getRol().name());
    }
}