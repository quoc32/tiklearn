package com.example.demo.config;

import com.example.demo.entity.Gift;
import com.example.demo.repository.GiftRepository;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserService userService;

    @Autowired(required = false)
    private GiftRepository giftRepository;

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

        // Initialize sample gifts (if repository available and empty)
        if (giftRepository != null) {
            long count = giftRepository.count();
            if (count == 0) {
                giftRepository.save(new Gift("Đồng hồ Casio", 800, "/product/casio.webp", 5));
                giftRepository.save(new Gift("Áo Thun", 300, "/product/ao.png", 10));
                giftRepository.save(new Gift("Balo gấu", 500, "/product/cap.webp", 3));
                giftRepository.save(new Gift("Hộp bút", 200, "/product/hopbut.webp", 8));
                System.out.println("✅ Sample gifts inserted (gifts table)");
            }
        }
    }
}
