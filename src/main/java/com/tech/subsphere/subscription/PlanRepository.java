package com.tech.subsphere.subscription;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PlanRepository extends JpaRepository<SubscriptionPlan, Long> {

               Optional<SubscriptionPlan>  findByName(String name);
}
