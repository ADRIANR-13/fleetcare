package com.example.demo.controller;

import com.example.demo.dto.KilometrajeRequest;
import com.example.demo.model.RegistroKilometraje;
import com.example.demo.service.KilometrajeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/kilometraje")
public class KilometrajeController {

    private final KilometrajeService service;

    public KilometrajeController(KilometrajeService service) { this.service = service; }

    @GetMapping("/vehiculo/{vehiculoId}")
    public List<RegistroKilometraje> porVehiculo(@PathVariable Long vehiculoId) {
        return service.porVehiculo(vehiculoId);
    }

    @PostMapping
    public ResponseEntity<RegistroKilometraje> registrar(@Valid @RequestBody KilometrajeRequest r) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.registrar(r));
    }
}