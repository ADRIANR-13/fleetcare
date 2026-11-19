package com.example.demo.service;

import com.example.demo.dto.FallaRequest;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Falla;
import com.example.demo.repository.FallaRepository;
import com.example.demo.repository.VehiculoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FallaService {

    private final FallaRepository repository;
    private final VehiculoRepository vehiculoRepository;

    public FallaService(FallaRepository repository, VehiculoRepository vehiculoRepository) {
        this.repository = repository;
        this.vehiculoRepository = vehiculoRepository;
    }

    public List<Falla> listar() { return repository.findAll(); }

    public List<Falla> porVehiculo(Long vehiculoId) {
        return repository.findByVehiculoIdOrderByFechaDesc(vehiculoId);
    }

    public Falla obtener(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Falla no encontrada con id " + id));
    }

    public Falla crear(FallaRequest r) { return aplicar(new Falla(), r); }

    public Falla actualizar(Long id, FallaRequest r) { return aplicar(obtener(id), r); }

    public void eliminar(Long id) { repository.delete(obtener(id)); }

    private Falla aplicar(Falla f, FallaRequest r) {
        f.setVehiculo(vehiculoRepository.findById(r.vehiculoId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehículo no encontrado con id " + r.vehiculoId())));
        f.setComponente(r.componente());
        f.setDescripcion(r.descripcion());
        f.setFecha(r.fecha());
        f.setGravedad(r.gravedad());
        f.setResuelta(r.resuelta());
        return repository.save(f);
    }
}