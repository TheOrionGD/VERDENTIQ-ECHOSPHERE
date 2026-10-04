package com.verdantiq.gateway.config;

import io.minio.MinioClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MinioConfig {

    @Value("${minio.url:https://verdantiq-sb-gateway.onrender.com}")
    private String minioUrl;

    @Value("${minio.access.key:minioadmin}")
    private String minioAccessKey;

    @Value("${minio.secret.key:minioadmin}")
    private String minioSecretKey;

    @Bean
    public MinioClient minioClient() {
        return MinioClient.builder()
                .endpoint(minioUrl)
                .credentials(minioAccessKey, minioSecretKey)
                .build();
    }
}
