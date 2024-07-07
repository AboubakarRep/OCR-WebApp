package com.springjwt.spring;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.springjwt.spring.jwt.models.ERole;
import com.springjwt.spring.jwt.models.Role;
import com.springjwt.spring.jwt.models.User;
import com.springjwt.spring.jwt.repositories.RoleRepository;
import com.springjwt.spring.jwt.repositories.UserRepository;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@SpringBootApplication
public class SpringjwtApplication {

	public static void main(String[] args) {
		ConfigurableApplicationContext context = SpringApplication.run(SpringjwtApplication.class, args);
		initializeRoles(context.getBean(RoleRepository.class));
		createAdminUser(context.getBean(UserRepository.class), context.getBean(RoleRepository.class), context.getBean(PasswordEncoder.class));
	}

	private static void initializeRoles(RoleRepository roleRepository) {
		// Créer les rôles s'ils n'existent pas déjà
		insertRoleIfNotFound(roleRepository, ERole.ROLE_USER);
		insertRoleIfNotFound(roleRepository, ERole.ROLE_MODERATOR);
		insertRoleIfNotFound(roleRepository, ERole.ROLE_ADMIN);
	}

	private static void insertRoleIfNotFound(RoleRepository roleRepository, ERole roleName) {
		if (!roleRepository.findByName(roleName).isPresent()) {
			Role role = new Role(roleName);
			roleRepository.save(role);
		}
	}

	private static void createAdminUser(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
		if (!userRepository.existsByUsername("admin")) {
			// Récupérer le rôle "ROLE_ADMIN" de la base de données
			Optional<Role> adminRole = roleRepository.findByName(ERole.ROLE_ADMIN);

			// Créer le rôle s'il n'existe pas déjà
			Role adminRoleEntity = adminRole.orElseGet(() -> roleRepository.save(new Role(ERole.ROLE_ADMIN)));

			// Créer un nouvel utilisateur administrateur
			User admin = new User();
			admin.setUsername("admin");
			admin.setEmail("admin@example.com");
			admin.setPassword(passwordEncoder.encode("adminPassword"));

			// Associer le rôle "ROLE_ADMIN" à l'utilisateur administrateur
			Set<Role> roles = new HashSet<>();
			roles.add(adminRoleEntity);
			admin.setRoles(roles);

			// Sauvegarder l'utilisateur administrateur
			userRepository.save(admin);
		}
	}
}
