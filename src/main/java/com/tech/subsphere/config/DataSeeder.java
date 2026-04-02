package com.tech.subsphere.config;

import com.tech.subsphere.subscription.PlanRepository;
import com.tech.subsphere.subscription.SubscriptionPlan;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner  {

    private final PlanRepository planRepository;

    @Override
    public void run(String... args) throws Exception {
        if (planRepository.count() == 0) {
            System.out.println("DEBUG: Database is empty. Seeding default subscription plans...");

            SubscriptionPlan freePlan = new SubscriptionPlan();
            freePlan.setName("FREE");
            freePlan.setPrice(0.0);
            freePlan.setStripePriceId("price_free_placeholder");
            freePlan.setMonthlyFeatureLimit(5);


            SubscriptionPlan proPlan = new SubscriptionPlan();
            proPlan.setName("PRO");
            proPlan.setPrice(9.99);
            proPlan.setStripePriceId("price_1TFWMBPstdXXeYaRkOyebndv");
            proPlan.setMonthlyFeatureLimit(100);

            planRepository.save(freePlan);
            planRepository.save(proPlan);
            System.out.println("DEBUG: Plans seeded successfully!");
        } else {
            System.out.println("DEBUG: Plans already exist in the database. Skipping seeder.");
        }



    }
}
