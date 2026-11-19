package com.example.demo.service;

import com.example.demo.dto.MantenimientoRequest;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.EstadoMantenimiento;
import com.example.demo.model.Mantenimiento;
import com.example.demo.model.Vehiculo;
import com.example.demo.repository.MantenimientoRepository;
import com.example.demo.repository.VehiculoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MantenimientoService {

    private final MantenimientoRepository repository;
    private final VehiculoRepository vehiculoRepository;
    private final TipoMantenimientoService tipoService;

    public MantenimientoService(MantenimientoRepository repository,
                                VehiculoRepository vehiculoRepository,
                                TipoMantenimientoService tipoService) {
        this.repository = repository;
        this.vehiculoRepository = vehiculoRepository;
        this.tipoService = tipoService;
    }

    public List<Mantenimiento> listar() { return repository.findAll(); }

    public List<Mantenimiento> porVehiculo(Long vehiculoId) {
        return repository.findByVehiculoIdOrderByFechaDesc(vehiculoId);
    }

    public Mantenimiento obtener(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mantenimiento no encontrado con id " + id));
    }

    public Mantenimiento crear(MantenimientoRequest r) { return aplicar(new Mantenimiento(), r); }

    public Mantenimiento actualizar(Long id, MantenimientoRequest r) { return aplicar(obtener(id), r); }

    public void eliminar(Long id) { repository.delete(obtener(id)); }

    private Mantenimiento aplicar(Mantenimiento m, MantenimientoRequest r) {
        Vehiculo v = vehiculoRepository.findById(r.vehiculoId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehículo no encontrado con id " + r.vehiculoId()));
        m.setVehiculo(v);
        m.setTipo(tipoService.obtener(r.tipoId()));
        m.setFecha(r.fecha());
        m.setKilometraje(r.kilometraje());
        m.setCosto(r.costo());
        m.setDescripcion(r.descripcion());
        m.setEstado(r.estado());

        if (r.estado() == EstadoMantenimiento.COMPLETADO && r.kilometraje() > v.getKilometraje()) {
            v.setKilometraje(r.kilometraje());
            vehiculoRepository.save(v);
        }
        return repository.save(m);
    }
}