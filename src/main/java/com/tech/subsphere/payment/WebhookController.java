package com.tech.subsphere.payment;

import com.stripe.exception.EventDataObjectDeserializationException;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.StripeObject;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.tech.subsphere.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/webhook")
@RequiredArgsConstructor
public class WebhookController {

    private final UserService userService;

    @Value("${stripe.webhook.secret}")
    private String endpointSecret;

    @PostMapping("/stripe")
    public ResponseEntity<String> handleStripeWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader) throws EventDataObjectDeserializationException {

        System.out.println("DEBUG: Stripe is knocking on the webhook door...");
        Event event;

        try {
            event = Webhook.constructEvent(payload, sigHeader, endpointSecret);
        } catch (Exception e) {
            System.out.println("DEBUG: Hacker alert! Invalid Stripe signature.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid signature");
        }

        if ("checkout.session.completed".equals(event.getType())) {

            System.out.println("DEBUG: Payment confirmed by Stripe!");

            // THE FIX: Safe Extraction of the Stripe Object
            EventDataObjectDeserializer dataObjectDeserializer = event.getDataObjectDeserializer();
            StripeObject stripeObject;

            if (dataObjectDeserializer.getObject().isPresent()) {
                // If versions match, it opens perfectly
                stripeObject = dataObjectDeserializer.getObject().get();
            } else {
                // If versions don't match, we FORCE it to read the raw JSON
                System.out.println("DEBUG: API Version mismatch detected. Forcing deserialization...");
                stripeObject = dataObjectDeserializer.deserializeUnsafe();
            }

            // Now we can safely cast it to a Session
            Session session = (Session) stripeObject;

            String customerEmail = session.getCustomerDetails().getEmail(); // Safer way to get email
            String stripeCustomerId = session.getCustomer();

            System.out.println("DEBUG: Extracted Email from Webhook: " + customerEmail);

            if (customerEmail != null) {
                userService.upgradeUserToPro(customerEmail, stripeCustomerId);
            } else {
                System.out.println("DEBUG: CRITICAL ERROR - Stripe did not send an email back!");
            }
        }

        return ResponseEntity.ok("Success");
    }
}