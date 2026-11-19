package com.example.demo.controller;

import com.example.demo.model.Vehiculo;
import com.example.demo.service.VehiculoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehiculos")
public class VehiculoController {

    private final VehiculoService service;

    public VehiculoController(VehiculoService service) {
        this.service = service;
    }

    @GetMapping
    public List<Vehiculo> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public Vehiculo obtener(@PathVariable Long id) {
        return service.obtener(id);
    }

    @PostMapping
    public ResponseEntity<Vehiculo> crear(@Valid @RequestBody Vehiculo vehiculo) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.crear(vehiculo));
    }

    @PutMapping("/{id}")
    public Vehiculo actualizar(@PathVariable Long id, @Valid @RequestBody Vehiculo vehiculo) {
        return service.actualizar(id, vehiculo);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}