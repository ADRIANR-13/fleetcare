package com.example.demo.dto;

import com.example.demo.model.Mantenimiento;

import java.math.BigDecimal;
import java.util.List;

public record DashboardResponse(
        long totalVehiculos,
        long vehiculosOperativos,
        long vehiculosEnMantenimiento,
        long mantenimientosProgramados,
        long fallasAbiertas,
        BigDecimal costoTotal,
        List<Mantenimiento> alertas,
        List<CostoPorVehiculo> costosPorVehiculo,
        List<FallasPorVehiculo> fallasPorVehiculo) {}