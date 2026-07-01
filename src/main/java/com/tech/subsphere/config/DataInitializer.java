package com.tech.subsphere.config;

import com.tech.subsphere.subscription.PlanRepository;
import com.tech.subsphere.subscription.SubscriptionPlan;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final PlanRepository planRepository;

    @Override
    public void run(String... args) throws Exception {
        // Seed FREE Plan if not present
        if (planRepository.findByName("FREE").isEmpty()) {
            SubscriptionPlan free = new SubscriptionPlan();
            free.setName("FREE");
            free.setMonthlyFeatureLimit(5); // 5 Roasts per month
            free.setPrice(0.0);
            free.setStripePriceId("free_plan");
            planRepository.save(free);
            System.out.println("✅ DataInitializer: Seeded FREE plan.");
        }

        // Seed PRO Plan if not present
        if (planRepository.findByName("PRO").isEmpty()) {
            SubscriptionPlan pro = new SubscriptionPlan();
            pro.setName("PRO");
            pro.setMonthlyFeatureLimit(1000); // Basically unlimited
            pro.setPrice(9.99);
            // Replace this with your actual Stripe Price ID from your Dashboard!
            pro.setStripePriceId("price_1PqRq7L3y4q5r6t7u8v9w0x1"); 
            planRepository.save(pro);
            System.out.println("✅ DataInitializer: Seeded PRO plan.");
        }
    }
}
