package com.example.demo.repository;

import com.example.demo.dto.CostoPorVehiculo;
import com.example.demo.model.EstadoMantenimiento;
import com.example.demo.model.Mantenimiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface MantenimientoRepository extends JpaRepository<Mantenimiento, Long> {

    List<Mantenimiento> findByVehiculoIdOrderByFechaDesc(Long vehiculoId);

    long countByEstado(EstadoMantenimiento estado);

    List<Mantenimiento> findByEstadoAndFechaLessThanEqualOrderByFechaAsc(EstadoMantenimiento estado, LocalDate fecha);

    @Query("select sum(m.costo) from Mantenimiento m where m.estado = :estado")
    BigDecimal totalCostoPorEstado(@Param("estado") EstadoMantenimiento estado);

    @Query("select new com.example.demo.dto.CostoPorVehiculo(v.placa, sum(m.costo)) " +
           "from Mantenimiento m join m.vehiculo v " +
           "where m.estado = :estado group by v.placa order by sum(m.costo) desc")
    List<CostoPorVehiculo> costoPorVehiculo(@Param("estado") EstadoMantenimiento estado);
}