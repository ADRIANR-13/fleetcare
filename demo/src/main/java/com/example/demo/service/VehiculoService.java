package com.example.demo.service;

import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Vehiculo;
import com.example.demo.repository.VehiculoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VehiculoService {

    private final VehiculoRepository repository;

    public VehiculoService(VehiculoRepository repository) {
        this.repository = repository;
    }

    public List<Vehiculo> listar() {
        return repository.findAll();
    }

    public Vehiculo obtener(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehículo no encontrado con id " + id));
    }

    public Vehiculo crear(Vehiculo vehiculo) {
        if (repository.existsByPlaca(vehiculo.getPlaca())) {
            throw new IllegalArgumentException("Ya existe un vehículo con la placa " + vehiculo.getPlaca());
        }
        vehiculo.setId(null);
        return repository.save(vehiculo);
    }

    public Vehiculo actualizar(Long id, Vehiculo datos) {
        Vehiculo existente = obtener(id);
        existente.setPlaca(datos.getPlaca());
        existente.setMarca(datos.getMarca());
        existente.setModelo(datos.getModelo());
        existente.setAnio(datos.getAnio());
        existente.setKilometraje(datos.getKilometraje());
        existente.setEstado(datos.getEstado());
        return repository.save(existente);
    }

    public void eliminar(Long id) {
        repository.delete(obtener(id));
    }
}