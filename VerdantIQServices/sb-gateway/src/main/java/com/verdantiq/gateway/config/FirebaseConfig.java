package com.verdantiq.gateway.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.FileSystemResource;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

@Configuration
public class FirebaseConfig {

    private static final Logger logger = LoggerFactory.getLogger(FirebaseConfig.class);

    @Value("${verdantiq.firebase.credentials-path:firebase-admin-key.json}")
    private String firebaseConfigPath;

    @PostConstruct
    public void initialize() {
        try {
            if (FirebaseApp.getApps().isEmpty()) {
                InputStream serviceAccount = null;
                FileSystemResource resource = new FileSystemResource(firebaseConfigPath);
                
                if (resource.exists()) {
                    serviceAccount = new FileInputStream(resource.getFile());
                } else {
                    logger.warn("Firebase credentials file not found at path: {}. Application might not be able to verify tokens.", firebaseConfigPath);
                    // For local development, if you don't have the key, we still want the app to start
                    // If Google App Default Credentials are set in env, it will use them:
                    FirebaseOptions options = FirebaseOptions.builder()
                            .setCredentials(GoogleCredentials.getApplicationDefault())
                            .build();
                    FirebaseApp.initializeApp(options);
                    logger.info("Firebase application initialized with Default Credentials.");
                    return;
                }

                FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                        .build();

                FirebaseApp.initializeApp(options);
                logger.info("Firebase application initialized successfully from credentials file.");
            }
        } catch (IOException e) {
            logger.error("Error initializing Firebase App", e);
        }
    }
}
