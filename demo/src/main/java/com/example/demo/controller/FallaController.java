package com.example.demo.controller;

import com.example.demo.dto.FallaRequest;
import com.example.demo.model.Falla;
import com.example.demo.service.FallaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fallas")
public class FallaController {

    private final FallaService service;

    public FallaController(FallaService service) { this.service = service; }

    @GetMapping
    public List<Falla> listar() { return service.listar(); }

    @GetMapping("/vehiculo/{vehiculoId}")
    public List<Falla> porVehiculo(@PathVariable Long vehiculoId) { return service.porVehiculo(vehiculoId); }

    @GetMapping("/{id}")
    public Falla obtener(@PathVariable Long id) { return service.obtener(id); }

    @PostMapping
    public ResponseEntity<Falla> crear(@Valid @RequestBody FallaRequest r) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.crear(r));
    }

    @PutMapping("/{id}")
    public Falla actualizar(@PathVariable Long id, @Valid @RequestBody FallaRequest r) {
        return service.actualizar(id, r);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}