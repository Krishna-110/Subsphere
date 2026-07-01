package com.tech.subsphere.payment;

import com.tech.subsphere.subscription.PlanRepository;
import com.tech.subsphere.subscription.SubscriptionPlan;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final StripeService stripeService;
    private final PlanRepository planRepository; // We need this to find the PRO plan's Stripe ID

    @GetMapping("/checkout")
    public ResponseEntity<Map<String, String>> createCheckout(@AuthenticationPrincipal Object principal) {
        String email;
        if (principal instanceof OAuth2User oauth2User) {
            email = oauth2User.getAttribute("email");
        } else if (principal instanceof String s) {
            email = s;
        } else {
            return ResponseEntity.status(401).body(Map.of("error", "Authentication failed."));
        }

        try {
            // 2. Fetch the PRO plan details from our database
            SubscriptionPlan proPlan = planRepository.findByName("PRO")
                    .orElseThrow(() -> new RuntimeException("PRO plan not found in database!"));

            // 3. Ask the Cashier (StripeService) to generate the bill URL
            String checkoutUrl = stripeService.createCheckoutSession(email, proPlan.getStripePriceId());

            // 4. Safely hand the URL back to React Native
            return ResponseEntity.ok(Map.of("url", checkoutUrl));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Failed to construct billing terminal."));
        }
    }
}