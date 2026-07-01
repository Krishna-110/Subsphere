package com.tech.subsphere.config;

import com.tech.subsphere.user.UserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {

    private final UserService userService;
    private final JwtService jwtService;

    @Value("${app.frontend.redirect-url}")
    private String redirectUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws ServletException, IOException {

        System.out.println("DEBUG: INSIDE SUCCESS HANDLER!");

        OAuth2AuthenticationToken token = (OAuth2AuthenticationToken) authentication;
        String email = token.getPrincipal().getAttribute("email");
        String name = token.getPrincipal().getAttribute("name");
        String picture = token.getPrincipal().getAttribute("picture");

        System.out.println("DEBUG: Extracted Email: " + email);

        // 1. Save or update user in database
        userService.processOAuthPostLogin(email, name, picture);

        // 2. Generate stateless JWT
        String jwtToken = jwtService.generateToken(email);

        // 3. DYNAMIC REDIRECT: Add JWT token to URL for React Native to parse
        String finalUrl = redirectUrl.contains("?") ? redirectUrl + "&token=" + jwtToken : redirectUrl + "?token=" + jwtToken;
        System.out.println("DEBUG: Redirecting to: " + finalUrl);
        getRedirectStrategy().sendRedirect(request, response, finalUrl);
    }
}