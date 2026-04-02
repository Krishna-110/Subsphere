package com.tech.subsphere;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@EnableCaching
@SpringBootApplication
public class SubsphereApplication {

	public static void main(String[] args) {
		SpringApplication.run(SubsphereApplication.class, args);
	}

}
