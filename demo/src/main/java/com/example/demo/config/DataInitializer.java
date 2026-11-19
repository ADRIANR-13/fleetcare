package com.example.demo.config;

import com.example.demo.model.*;
import com.example.demo.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final TipoMantenimientoRepository tipoRepository;
    private final VehiculoRepository vehiculoRepository;
    private final PasswordEncoder encoder;

    public DataInitializer(UsuarioRepository usuarioRepository,
                           TipoMantenimientoRepository tipoRepository,
                           VehiculoRepository vehiculoRepository,
                           PasswordEncoder encoder) {
        this.usuarioRepository = usuarioRepository;
        this.tipoRepository = tipoRepository;
        this.vehiculoRepository = vehiculoRepository;
        this.encoder = encoder;
    }

    @Override
    public void run(String... args) {
        if (usuarioRepository.count() == 0) {
            usuarioRepository.save(new Usuario(null, "admin", encoder.encode("admin123"), "Administrador", Rol.ADMIN, true));
            usuarioRepository.save(new Usuario(null, "jefe", encoder.encode("jefe123"), "Jefe de Mantenimiento", Rol.JEFE_MANTENIMIENTO, true));
            usuarioRepository.save(new Usuario(null, "tecnico", encoder.encode("tecnico123"), "Técnico", Rol.TECNICO, true));
        }

        if (tipoRepository.count() == 0) {
            tipoRepository.save(new TipoMantenimiento(null, "Cambio de aceite", CategoriaMantenimiento.PREVENTIVO, 10000, 90, "Aceite y filtro"));
            tipoRepository.save(new TipoMantenimiento(null, "Revisión de frenos", CategoriaMantenimiento.PREVENTIVO, 20000, 180, "Pastillas y discos"));
            tipoRepository.save(new TipoMantenimiento(null, "Reparación de motor", CategoriaMantenimiento.CORRECTIVO, null, null, "Falla de motor"));
        }

        if (vehiculoRepository.count() == 0) {
            vehiculoRepository.save(new Vehiculo(null, "ABC-123", "Volvo", "FH16", 2022, 45000, "OPERATIVO"));
            vehiculoRepository.save(new Vehiculo(null, "XYZ-789", "Scania", "R450", 2020, 98000, "OPERATIVO"));
        }
    }
}