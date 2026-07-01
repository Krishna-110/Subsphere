package com.tech.subsphere.user;

import com.tech.subsphere.subscription.PlanRepository;
import com.tech.subsphere.subscription.SubscriptionPlan;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    private final PlanRepository    planRepository;

    public User processOAuthPostLogin(String email, String name, String profileImageUrl) {

        System.out.println("DEBUG: INSIDE USER SERVICE. Checking email: " + email);

        Optional<User> existUser = userRepository.findByEmail(email);

        if (existUser.isPresent()) {
            System.out.println("DEBUG: User already exists in DB.");
            return existUser.get();
        }

        System.out.println("DEBUG: Creating brand new user!");

        User newUser = new User();
        newUser.setEmail(email);
        newUser.setName(name);
        newUser.setProfileImageUrl(profileImageUrl);
        newUser.setRole("ROLE_USER");
        newUser.setSubscriptionStatus("INACTIVE");

        SubscriptionPlan freePlan = planRepository.findByName("FREE")
                .orElseThrow(() -> new RuntimeException("CRITICAL ERROR: Default FREE plan not found in database!"));

        newUser.setPlan(freePlan);
        User savedUser = userRepository.save(newUser);
        System.out.println("DEBUG: User successfully saved to DB with ID: " + savedUser.getId());

        return savedUser;
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));
    }


    /**
     * Core SaaS Logic: Can this user use the premium feature right now?
     */
    @org.springframework.transaction.annotation.Transactional
    public boolean attemptToUseFeature(String email) {
        // 1. Find the user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        // 2. Find their plan limit and current usage
        int limit = user.getPlan().getMonthlyFeatureLimit();
        int currentUsage = user.getCurrentMonthUsage();

        System.out.println("DEBUG: User " + email + " has used " + currentUsage + " out of " + limit);

        // 3. The Big Check
        if (currentUsage < limit) {
            // Success! They are allowed. Increase their usage by 1.
            user.setCurrentMonthUsage(currentUsage + 1);
            userRepository.save(user); // Save the new count to MySQL
            return true;
        } else {
            // Failed! They hit their limit.
            System.out.println("DEBUG: User blocked. Limit reached.");
            return false;
        }
    }

    /**
     * Called by the Webhook when Stripe confirms they received the money.
     */
    public void upgradeUserToPro(String email, String stripeCustomerId) {

        System.out.println("DEBUG: Upgrading user " + email + " to PRO!");

        // 1. Find the User
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Webhook Error: User not found!"));

        // 2. Find the PRO Plan
        SubscriptionPlan proPlan = planRepository.findByName("PRO")
                .orElseThrow(() -> new RuntimeException("Webhook Error: PRO plan not found!"));

        // 3. Upgrade their account!
        user.setPlan(proPlan); // Change plan_id to 2
        user.setStripeCustomerId(stripeCustomerId); // Save their Stripe ID for future monthly renewals
        user.setSubscriptionStatus("ACTIVE"); // They are a paying customer now
        user.setCurrentMonthUsage(0); // Reset their usage counter to 0!

        // 4. Save to database
        userRepository.save(user);

        System.out.println("DEBUG: Upgrade successful! User saved.");
    }
}