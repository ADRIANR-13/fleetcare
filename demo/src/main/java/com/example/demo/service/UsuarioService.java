package com.example.demo.service;

import com.example.demo.dto.UsuarioRequest;
import com.example.demo.dto.UsuarioResponse;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Usuario;
import com.example.demo.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository repository;
    private final PasswordEncoder encoder;

    public UsuarioService(UsuarioRepository repository, PasswordEncoder encoder) {
        this.repository = repository;
        this.encoder = encoder;
    }

    public List<UsuarioResponse> listar() {
        return repository.findAll().stream().map(this::aResponse).toList();
    }

    public UsuarioResponse crear(UsuarioRequest r) {
        if (repository.findByUsername(r.username()).isPresent()) {
            throw new IllegalArgumentException("El usuario " + r.username() + " ya existe");
        }
        if (r.password() == null || r.password().isBlank()) {
            throw new IllegalArgumentException("La contraseña es obligatoria");
        }
        Usuario u = new Usuario();
        u.setUsername(r.username());
        u.setPassword(encoder.encode(r.password()));
        u.setNombre(r.nombre());
        u.setRol(r.rol());
        u.setActivo(true);
        return aResponse(repository.save(u));
    }

    public UsuarioResponse actualizar(Long id, UsuarioRequest r) {
        Usuario u = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id " + id));
        u.setNombre(r.nombre());
        u.setRol(r.rol());
        u.setActivo(r.activo());
        if (r.password() != null && !r.password().isBlank()) {
            u.setPassword(encoder.encode(r.password()));
        }
        return aResponse(repository.save(u));
    }

    public void eliminar(Long id) {
        Usuario u = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id " + id));
        repository.delete(u);
    }

    private UsuarioResponse aResponse(Usuario u) {
        return new UsuarioResponse(u.getId(), u.getUsername(), u.getNombre(), u.getRol().name(), u.isActivo());
    }
}