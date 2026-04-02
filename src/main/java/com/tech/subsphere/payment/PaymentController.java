package com.tech.subsphere.payment;

import com.tech.subsphere.subscription.PlanRepository;
import com.tech.subsphere.subscription.SubscriptionPlan;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final StripeService stripeService;
    private final PlanRepository planRepository; // We need this to find the PRO plan's Stripe ID

    @GetMapping("/checkout")
    public void createCheckout(@AuthenticationPrincipal OAuth2User principal, HttpServletResponse response) throws IOException {

        // 1. Get the currently logged-in user's email
        String email = principal.getAttribute("email");

        // 2. Fetch the PRO plan details from our database
        SubscriptionPlan proPlan = planRepository.findByName("PRO")
                .orElseThrow(() -> new RuntimeException("PRO plan not found in database!"));

        // 3. Ask the Cashier (StripeService) to generate the bill URL
        String checkoutUrl = stripeService.createCheckoutSession(email, proPlan.getStripePriceId());

        // 4. FORCED REDIRECT: Immediately send the user's browser to the Stripe page!
        response.sendRedirect(checkoutUrl);
    }
}