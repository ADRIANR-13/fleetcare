package com.example.demo.service;

import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Repuesto;
import com.example.demo.repository.RepuestoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RepuestoService {

    private final RepuestoRepository repository;

    public RepuestoService(RepuestoRepository repository) { this.repository = repository; }

    public List<Repuesto> listar() { return repository.findAll(); }

    public Repuesto obtener(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Repuesto no encontrado con id " + id));
    }

    public Repuesto crear(Repuesto r) {
        r.setId(null);
        return repository.save(r);
    }

    public Repuesto actualizar(Long id, Repuesto d) {
        Repuesto e = obtener(id);
        e.setNombre(d.getNombre());
        e.setCodigo(d.getCodigo());
        e.setStock(d.getStock());
        e.setPrecioUnitario(d.getPrecioUnitario());
        e.setProveedor(d.getProveedor());
        return repository.save(e);
    }

    public void eliminar(Long id) { repository.delete(obtener(id)); }
}