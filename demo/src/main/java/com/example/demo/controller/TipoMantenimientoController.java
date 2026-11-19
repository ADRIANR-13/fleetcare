package com.example.demo.controller;

import com.example.demo.model.TipoMantenimiento;
import com.example.demo.service.TipoMantenimientoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tipos-mantenimiento")
public class TipoMantenimientoController {

    private final TipoMantenimientoService service;

    public TipoMantenimientoController(TipoMantenimientoService service) { this.service = service; }

    @GetMapping
    public List<TipoMantenimiento> listar() { return service.listar(); }

    @GetMapping("/{id}")
    public TipoMantenimiento obtener(@PathVariable Long id) { return service.obtener(id); }

    @PostMapping
    public ResponseEntity<TipoMantenimiento> crear(@Valid @RequestBody TipoMantenimiento t) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.crear(t));
    }

    @PutMapping("/{id}")
    public TipoMantenimiento actualizar(@PathVariable Long id, @Valid @RequestBody TipoMantenimiento t) {
        return service.actualizar(id, t);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}