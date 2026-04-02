package com.tech.subsphere.user;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

       @Cacheable(value = "users", key = "#email")
       Optional<User> findByEmail(String email);

       // 2. THE FIX: Whenever we save/update a user, kick the old version out of Redis!
       @CacheEvict(value = "users", key = "#user.email")
       User save(User user);
}
