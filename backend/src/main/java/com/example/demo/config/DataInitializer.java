package com.example.demo.config;

import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserService userService;

    @Override
    public void run(String... args) throws Exception {
        // Create default admin user if not exists
        if (!userService.existsByUsername("admin")) {
            userService.createUser("admin", "admin123", "ADMIN");
            System.out.println("✅ Default admin user created:");
            System.out.println("   Username: admin");
            System.out.println("   Password: admin123");
        }

        // Create additional test users
        if (!userService.existsByUsername("user")) {
            userService.createUser("user", "user123", "USER");
            System.out.println("✅ Default user created:");
            System.out.println("   Username: user");
            System.out.println("   Password: user123");
        }
    }
}
