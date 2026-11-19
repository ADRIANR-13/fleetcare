package com.example.demo.service;

import com.example.demo.dto.CostoPorVehiculo;
import com.example.demo.dto.DashboardResponse;
import com.example.demo.dto.FallasPorVehiculo;
import com.example.demo.model.EstadoMantenimiento;
import com.example.demo.repository.FallaRepository;
import com.example.demo.repository.MantenimientoRepository;
import com.example.demo.repository.VehiculoRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class DashboardService {

    private final VehiculoRepository vehiculoRepository;
    private final MantenimientoRepository mantenimientoRepository;
    private final FallaRepository fallaRepository;

    public DashboardService(VehiculoRepository vehiculoRepository,
                            MantenimientoRepository mantenimientoRepository,
                            FallaRepository fallaRepository) {
        this.vehiculoRepository = vehiculoRepository;
        this.mantenimientoRepository = mantenimientoRepository;
        this.fallaRepository = fallaRepository;
    }

    public DashboardResponse resumen() {
        BigDecimal costo = mantenimientoRepository.totalCostoPorEstado(EstadoMantenimiento.COMPLETADO);
        return new DashboardResponse(
                vehiculoRepository.count(),
                vehiculoRepository.countByEstado("OPERATIVO"),
                vehiculoRepository.countByEstado("EN_MANTENIMIENTO"),
                mantenimientoRepository.countByEstado(EstadoMantenimiento.PROGRAMADO),
                fallaRepository.countByResueltaFalse(),
                costo != null ? costo : BigDecimal.ZERO,
                mantenimientoRepository.findByEstadoAndFechaLessThanEqualOrderByFechaAsc(
                        EstadoMantenimiento.PROGRAMADO, LocalDate.now().plusDays(7)),
                costosPorVehiculo(),
                fallasPorVehiculo());
    }

    public List<CostoPorVehiculo> costosPorVehiculo() {
        return mantenimientoRepository.costoPorVehiculo(EstadoMantenimiento.COMPLETADO);
    }

    public List<FallasPorVehiculo> fallasPorVehiculo() {
        return fallaRepository.fallasPorVehiculo();
    }
}