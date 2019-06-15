package online.grisk.afrodita.security.configuration;

import online.grisk.afrodita.repository.ModuleRepository;
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


@Configuration
@EnableWebSecurity
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Autowired
    @Qualifier("customUserDetailsService")
    UserDetailsService userDetailsService;

    @Autowired
    ModuleRepository moduleRepository;

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider daoAuthenticationProvider() {
        DaoAuthenticationProvider impl = new DaoAuthenticationProvider();
        impl.setUserDetailsService(userDetailsService);
        impl.setHideUserNotFoundExceptions(false) ;
        impl.setPasswordEncoder(passwordEncoder());
        return impl ;
    }

    @Autowired
    public void configureGlobalSecurity(AuthenticationManagerBuilder auth) throws Exception {
        auth.authenticationProvider(daoAuthenticationProvider());
    }


    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable();
        // The pages does not require login
        http.authorizeRequests().antMatchers("/login", "/dashboard").permitAll();

        http.authorizeRequests().antMatchers("/logout").authenticated();

        http.authorizeRequests().antMatchers("/").access("hasAnyRole('ROLE_ROOT', 'ROLE_ADMIN', 'ROOT_BASIC')");

//        User Gestor
        http.authorizeRequests().antMatchers("/register-users").access("hasAnyRole('ROLE_ADMIN', 'ROLE_ADMIN')");
        http.authorizeRequests().antMatchers("/edit-users").access("hasAnyRole('ROLE_ADMIN', 'ROLE_ADMIN')");
        http.authorizeRequests().antMatchers("/register-users").access("hasAnyRole('ROLE_ADMIN', 'ROLE_ADMIN')");


        http.authorizeRequests().antMatchers("/data-integration").access("hasAnyRole('ROLE_ADMIN')");
        http.authorizeRequests().antMatchers("/tree-business").access("hasAnyRole('ROLE_ADMIN')");
        http.authorizeRequests().antMatchers("/risk-ratios").access("hasAnyRole('ROLE_ADMIN')");
        http.authorizeRequests().antMatchers("/risk-score").access("hasAnyRole('ROLE_ADMIN')");

        // When the user has logged in as XX.
        // But access a page that requires role YY,
        // AccessDeniedException will be thrown.
        http.authorizeRequests().and().exceptionHandling().accessDeniedPage("/error-403");
        configureLoginProccess(http);
    }


    private void configureLoginProccess(HttpSecurity http) throws Exception {
        http.authorizeRequests()
                .and()
                .formLogin()// Submit URL of login page.
                .loginProcessingUrl("/check_login") // Submit URL
                .loginPage("/login")
                .defaultSuccessUrl("/dashboard")
                .failureUrl("/login?error")
                .usernameParameter("username")
                .passwordParameter("password")
                // Config for Logout Page
                .and().logout().logoutUrl("/logout").logoutSuccessUrl("/login?logout");
    }
}
