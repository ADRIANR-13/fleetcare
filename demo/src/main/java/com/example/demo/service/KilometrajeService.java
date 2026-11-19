package com.example.demo.service;

import com.example.demo.dto.KilometrajeRequest;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.RegistroKilometraje;
import com.example.demo.model.Vehiculo;
import com.example.demo.repository.RegistroKilometrajeRepository;
import com.example.demo.repository.VehiculoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KilometrajeService {

    private final RegistroKilometrajeRepository repository;
    private final VehiculoRepository vehiculoRepository;

    public KilometrajeService(RegistroKilometrajeRepository repository, VehiculoRepository vehiculoRepository) {
        this.repository = repository;
        this.vehiculoRepository = vehiculoRepository;
    }

    public List<RegistroKilometraje> porVehiculo(Long vehiculoId) {
        return repository.findByVehiculoIdOrderByFechaDesc(vehiculoId);
    }

    public RegistroKilometraje registrar(KilometrajeRequest r) {
        Vehiculo v = vehiculoRepository.findById(r.vehiculoId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehículo no encontrado con id " + r.vehiculoId()));

        if (r.kilometraje() < v.getKilometraje()) {
            throw new IllegalArgumentException(
                    "El kilometraje no puede ser menor al actual (" + v.getKilometraje() + " km)");
        }

        RegistroKilometraje reg = new RegistroKilometraje();
        reg.setVehiculo(v);
        reg.setFecha(r.fecha());
        reg.setKilometraje(r.kilometraje());

        v.setKilometraje(r.kilometraje());
        vehiculoRepository.save(v);
        return repository.save(reg);
    }
}