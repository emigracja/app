package com.example.backend.api;

import com.example.backend.domain.dto.AuthRequest;
import com.example.backend.domain.dto.UserDto;
import com.example.backend.domain.service.user.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/users/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;

    @PostMapping("/login")
    @Operation(
            summary = "Authenticate user and return JWT token",
            description = "Authenticates a user using provided credentials. Returns a JWT token if successful.",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    required = true,
                    content = @Content(schema = @Schema(implementation = AuthRequest.class))
            ),
            responses = {
                    @ApiResponse(responseCode = "200",
                            description = "Authentication successful – JWT token returned",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = String.class)
                            )),
                    @ApiResponse(responseCode = "401", description = "Authentication failed – invalid credentials"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    public ResponseEntity<String> loginUser(@Valid @RequestBody AuthRequest authRequest) {
        Optional<String> token = userService.authenticateUser(authRequest);
        return token.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(401).body("Invalid credentials"));
    }

    @PostMapping("/register")
    @Operation(
            summary = "Register a new user account",
            description = "Registers a new user with the provided details. Returns confirmation message if successful.",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    required = true,
                    content = @Content(schema = @Schema(implementation = UserDto.class))
            ),
            responses = {
                    @ApiResponse(responseCode = "200",
                            description = "User registered successfully",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = String.class)
                            )),
                    @ApiResponse(responseCode = "400", description = "Invalid request – missing or malformed data"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    public ResponseEntity<String> registerUser(@RequestBody UserDto userDto) {
        userService.registerUser(userDto);
        return ResponseEntity.ok("User registered successfully");
    }
}
