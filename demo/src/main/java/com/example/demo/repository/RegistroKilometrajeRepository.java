package com.example.demo.repository;

import com.example.demo.model.RegistroKilometraje;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RegistroKilometrajeRepository extends JpaRepository<RegistroKilometraje, Long> {
    List<RegistroKilometraje> findByVehiculoIdOrderByFechaDesc(Long vehiculoId);
}