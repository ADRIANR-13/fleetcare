package com.example.demo.controller;

import com.example.demo.model.Repuesto;
import com.example.demo.service.RepuestoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/repuestos")
public class RepuestoController {

    private final RepuestoService service;

    public RepuestoController(RepuestoService service) { this.service = service; }

    @GetMapping
    public List<Repuesto> listar() { return service.listar(); }

    @GetMapping("/{id}")
    public Repuesto obtener(@PathVariable Long id) { return service.obtener(id); }

    @PostMapping
    public ResponseEntity<Repuesto> crear(@Valid @RequestBody Repuesto r) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.crear(r));
    }

    @PutMapping("/{id}")
    public Repuesto actualizar(@PathVariable Long id, @Valid @RequestBody Repuesto r) {
        return service.actualizar(id, r);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}