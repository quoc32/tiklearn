package com.example.demo.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties
public class ApiConfiguration {
    // This class enables custom properties in application.properties
    // No fields needed - just presence enables property resolution
}
