package com.example.demo.repository;

import com.example.demo.dto.FallasPorVehiculo;
import com.example.demo.model.Falla;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FallaRepository extends JpaRepository<Falla, Long> {

    List<Falla> findByVehiculoIdOrderByFechaDesc(Long vehiculoId);

    long countByResueltaFalse();

    @Query("select new com.example.demo.dto.FallasPorVehiculo(v.placa, count(f)) " +
           "from Falla f join f.vehiculo v group by v.placa order by count(f) desc")
    List<FallasPorVehiculo> fallasPorVehiculo();
}