package online.grisk.afrodita;

import online.grisk.afrodita.domain.pojo.Microservice;
import online.grisk.afrodita.domain.entity.Role;
import online.grisk.afrodita.domain.pojo.TypeVariable;
import online.grisk.afrodita.domain.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ImportResource;
import org.springframework.context.support.ResourceBundleMessageSource;
import org.springframework.http.HttpMethod;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.client.RestTemplate;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;

@EnableEurekaClient
@SpringBootApplication
@ImportResource("classpath:integration.cfg.xml")
public class AfroditaApplication {

    @Autowired
    RoleService roleService;

    public static void main(String[] args) {
        SpringApplication.run(AfroditaApplication.class, args);
    }

    @LoadBalanced
    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder restTemplateBuilder) {
        /*RestTemplate restTemplate = new RestTemplate(new BufferingClientHttpRequestFactory(new SimpleClientHttpRequestFactory()));
        List<ClientHttpRequestInterceptor> interceptors = new ArrayList<>();
        interceptors.add(new LoggingRequestInterceptor());
        restTemplate.setInterceptors(interceptors);*/
        return new RestTemplate();
    }

    @Bean
    UUID getUUID() {
        return UUID.randomUUID();
    }

    @Bean
    public String token() {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] messageDigest = md.digest(getUUID().toString().getBytes());
            BigInteger no = new BigInteger(1, messageDigest);
            String hashtext = no.toString(16);
            while (hashtext.length() < 32) {
                hashtext = "0" + hashtext;
            }
            return hashtext;
        } catch (NoSuchAlgorithmException e) {
            return getUUID().toString();
        }
    }

    @Bean
    public MessageSource messageSource() {
        ResourceBundleMessageSource messageSource = new ResourceBundleMessageSource();
        messageSource.setBasenames("message");
        messageSource.setDefaultEncoding("UTF-8");
        return messageSource;
    }

    @Value("ARTEMISA_USER")
    String artemisaUser;

    @Value("ARTEMISA_PASS")
    String artemisaPass;

    @Bean
    Microservice serviceActivatorArtemisa() {
        return new Microservice("artemisa", HttpMethod.POST, "/api/artemisa", artemisaUser, artemisaPass, new HashMap<>());
    }

    @Bean
    public Role roleWithCodeAdmin() {
        return roleService.findByCode("ADMIN");
    }

    @Bean
    public BCryptPasswordEncoder encoderPassword() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public List<TypeVariable> getTypesVariables() {
        List<TypeVariable> types = new ArrayList<>();
        types.add(new TypeVariable(1L, "Número entero", "NE"));
        types.add(new TypeVariable(2L, "Número decimal", "ND"));
        return types;
    }
}
