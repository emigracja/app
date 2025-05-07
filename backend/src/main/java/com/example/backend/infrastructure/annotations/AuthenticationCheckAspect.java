package com.example.backend.infrastructure.annotations;

import com.example.backend.api.response.CustomApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.apache.logging.log4j.util.Strings;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.security.Principal;

@Slf4j
@Aspect
@Component
public class AuthenticationCheckAspect {

    @Around("@within(com.example.backend.infrastructure.annotations.RequireNotEmptyEmail) || @annotation(com.example.backend.infrastructure.annotations.RequireNotEmptyEmail)")
    public Object checkAuthentication(ProceedingJoinPoint joinPoint) throws Throwable {
        for (Object arg : joinPoint.getArgs()) {
            if (arg instanceof Principal methodPrincipal) {
                if (Strings.isEmpty(methodPrincipal.getName())) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new CustomApiResponse(
                            "User email is empty. Please check your authentication.",
                            HttpStatus.FORBIDDEN.value()
                    ));
                }
                break;
            }
        }
        return joinPoint.proceed();
    }
}
