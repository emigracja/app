package com.example.backend.infrastructure.webpush;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import nl.martijndwars.webpush.PushService;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.springframework.context.annotation.Bean;
import java.security.GeneralSecurityException;
import java.security.Security;

    @Configuration
    public class WebPushConfig {

        @Value("${vapid.public.key}")
        private String vapidPublicKey;

        @Value("${vapid.private.key}")
        private String vapidPrivateKey;

        @Value("${vapid.subject}")
        private String vapidSubject;

        @PostConstruct
        private void init() {
            if (Security.getProvider(BouncyCastleProvider.PROVIDER_NAME) == null) {
                Security.addProvider(new BouncyCastleProvider());
            }
        }

        @Bean
        public PushService pushService() throws GeneralSecurityException {
            PushService pushService = new PushService();
            pushService.setPublicKey(vapidPublicKey);
            pushService.setPrivateKey(vapidPrivateKey);
            pushService.setSubject(vapidSubject);
            return pushService;
        }
    }

