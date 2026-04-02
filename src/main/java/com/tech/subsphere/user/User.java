package com.tech.subsphere.user;

import com.tech.subsphere.subscription.SubscriptionPlan;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User implements Serializable {

    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true) // Email must be unique, no two users can have the same email
    private String email;

    private String profileImageUrl;

    private String role;

    private String stripeCustomerId;

    private String subscriptionStatus;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "plan_id")
    private SubscriptionPlan plan;

    // How many times has this user used the core feature this month?
    @Column(nullable = false)
    private Integer currentMonthUsage = 0;

}
