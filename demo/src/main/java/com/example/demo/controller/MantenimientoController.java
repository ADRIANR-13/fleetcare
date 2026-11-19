package com.example.demo.controller;

import com.example.demo.dto.MantenimientoRequest;
import com.example.demo.model.Mantenimiento;
import com.example.demo.service.MantenimientoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mantenimientos")
public class MantenimientoController {

    private final MantenimientoService service;

    public MantenimientoController(MantenimientoService service) { this.service = service; }

    @GetMapping
    public List<Mantenimiento> listar() { return service.listar(); }

    @GetMapping("/vehiculo/{vehiculoId}")
    public List<Mantenimiento> porVehiculo(@PathVariable Long vehiculoId) {
        return service.porVehiculo(vehiculoId);
    }

    @GetMapping("/{id}")
    public Mantenimiento obtener(@PathVariable Long id) { return service.obtener(id); }

    @PostMapping
    public ResponseEntity<Mantenimiento> crear(@Valid @RequestBody MantenimientoRequest r) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.crear(r));
    }

    @PutMapping("/{id}")
    public Mantenimiento actualizar(@PathVariable Long id, @Valid @RequestBody MantenimientoRequest r) {
        return service.actualizar(id, r);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}