package qdtt.tiklearn.controllers;


import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import qdtt.tiklearn.dto.LoginRequest;
import qdtt.tiklearn.dto.LoginResponse;
import qdtt.tiklearn.entity.User;
import qdtt.tiklearn.services.UserService;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    /**
     * Login endpoint
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest request,
            HttpSession session) {
        
        Optional<User> userOpt = userService.authenticate(request.getUsername(), request.getPassword());
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            
            // Store user info in session
            session.setAttribute("userId", user.getId());
            session.setAttribute("username", user.getUsername());
            session.setAttribute("role", user.getRole());
            
            // Create response with user info (without password)
            LoginResponse.UserInfo userInfo = new LoginResponse.UserInfo(
                user.getId(),
                user.getUsername(),
                user.getRole()
            );
            
            LoginResponse response = new LoginResponse(true, "Login successful", userInfo);
            return ResponseEntity.ok(response);
        } else {
            LoginResponse response = new LoginResponse(false, "Invalid username or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    /**
     * Logout endpoint
     * POST /api/auth/logout
     */
    @PostMapping("/logout")
    public ResponseEntity<LoginResponse> logout(HttpSession session) {
        session.invalidate();
        LoginResponse response = new LoginResponse(true, "Logout successful");
        return ResponseEntity.ok(response);
    }

    /**
     * Check session endpoint
     * GET /api/auth/check
     */
    @GetMapping("/check")
    public ResponseEntity<LoginResponse> checkSession(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        String username = (String) session.getAttribute("username");
        String role = (String) session.getAttribute("role");
        
        if (userId != null && username != null) {
            LoginResponse.UserInfo userInfo = new LoginResponse.UserInfo(userId, username, role);
            LoginResponse response = new LoginResponse(true, "Session valid", userInfo);
            return ResponseEntity.ok(response);
        } else {
            LoginResponse response = new LoginResponse(false, "No active session");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    /**
     * Get current user info
     * GET /api/auth/me
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new LoginResponse(false, "Not authenticated"));
        }
        
        String username = (String) session.getAttribute("username");
        String role = (String) session.getAttribute("role");
        
        LoginResponse.UserInfo userInfo = new LoginResponse.UserInfo(userId, username, role);
        return ResponseEntity.ok(userInfo);
    }
}
