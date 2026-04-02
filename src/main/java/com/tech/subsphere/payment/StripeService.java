package com.tech.subsphere.payment;

import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class StripeService {

    // This grabs the secret key we put in application.properties
    @Value("${stripe.api.key}")
    private String stripeApiKey;

    // @PostConstruct means "Run this tiny setup method right after Spring creates this class"
    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeApiKey; // This officially wakes up the Stripe tool
    }

    /**
     * This method talks to Stripe and asks for a unique Checkout URL.
     */
    public String createCheckoutSession(String customerEmail, String stripePriceId) {
        try {
            SessionCreateParams params = SessionCreateParams.builder()
                    // 1. What type of payment? It's a recurring monthly subscription!
                    .setMode(SessionCreateParams.Mode.SUBSCRIPTION)

                    // 2. Who is buying?
                    .setCustomerEmail(customerEmail)

                    // 3. Where should Stripe send them if payment is SUCCESSFUL?
                    .setSuccessUrl("http://localhost:5173/dashboard?payment=success")

                    // 4. Where should Stripe send them if they click "BACK" or CANCEL?
                    .setCancelUrl("http://localhost:5173/dashboard?payment=cancelled")

                    // 5. What are they buying? (The line item on the bill)
                    .addLineItem(
                            SessionCreateParams.LineItem.builder()
                                    .setQuantity(1L)
                                    .setPrice(stripePriceId) // The price_1PqR... ID from your database!
                                    .build()
                    )
                    .build();

            // Send the request to Stripe over the internet
            Session session = Session.create(params);

            // Return the secure URL Stripe generated for us
            return session.getUrl();

        } catch (Exception e) {
            throw new RuntimeException("Error creating Stripe Checkout Session: " + e.getMessage());
        }
    }
}