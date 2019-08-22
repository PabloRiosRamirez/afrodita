package online.grisk.afrodita.security.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.access.AccessDeniedHandler;

import online.grisk.afrodita.domain.handler.CustomAccessDeniedHandler;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

	@Autowired
	@Qualifier("customUserDetailsService")
	UserDetailsService userDetailsService;

	@Bean
	public BCryptPasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public AuthenticationProvider daoAuthenticationProvider() {
		DaoAuthenticationProvider impl = new DaoAuthenticationProvider();
		impl.setUserDetailsService(userDetailsService);
		impl.setHideUserNotFoundExceptions(false);
		impl.setPasswordEncoder(passwordEncoder());
		return impl;
	}

	@Bean
	public AccessDeniedHandler accessDeniedHandler() {
		return new CustomAccessDeniedHandler();
	}

	@Autowired
	public void configureGlobalSecurity(AuthenticationManagerBuilder auth) throws Exception {
		auth.authenticationProvider(daoAuthenticationProvider());
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.csrf().disable();
		http.authorizeRequests().antMatchers("/login", "/images/**", "/css/**", "/js/**", "/vendors/**", "/v1/rest/**", "/login/**")
				.permitAll();
		http.authorizeRequests().antMatchers("/", "/logout").authenticated();
		http.authorizeRequests().antMatchers("/users/**", "/dataintegration/**", "/indicators/**").hasAnyRole("ROLE_ADMIN").and().exceptionHandling().accessDeniedHandler(accessDeniedHandler())/*.accessDeniedPage("/errors/error-403")*/;
		http.authorizeRequests().antMatchers("/**").authenticated();
		http.authorizeRequests().and().formLogin()// Submit URL of login page.
				.loginProcessingUrl("/check_login") // Submit URL
				.loginPage("/login").defaultSuccessUrl("/", true).failureUrl("/login").usernameParameter("username")
				.passwordParameter("password").and().logout().deleteCookies("JSESSIONID").invalidateHttpSession(true)
				.logoutUrl("/logout").logoutSuccessUrl("/login?logout");
	}
}
