package com.example.demo.service;

import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.TipoMantenimiento;
import com.example.demo.repository.TipoMantenimientoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TipoMantenimientoService {

    private final TipoMantenimientoRepository repository;

    public TipoMantenimientoService(TipoMantenimientoRepository repository) {
        this.repository = repository;
    }

    public List<TipoMantenimiento> listar() { return repository.findAll(); }

    public TipoMantenimiento obtener(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tipo de mantenimiento no encontrado con id " + id));
    }

    public TipoMantenimiento crear(TipoMantenimiento t) {
        t.setId(null);
        return repository.save(t);
    }

    public TipoMantenimiento actualizar(Long id, TipoMantenimiento d) {
        TipoMantenimiento e = obtener(id);
        e.setNombre(d.getNombre());
        e.setCategoria(d.getCategoria());
        e.setIntervaloKm(d.getIntervaloKm());
        e.setIntervaloDias(d.getIntervaloDias());
        e.setDescripcion(d.getDescripcion());
        return repository.save(e);
    }

    public void eliminar(Long id) { repository.delete(obtener(id)); }
}