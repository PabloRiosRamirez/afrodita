package online.grisk.afrodita;

import online.grisk.afrodita.domain.entity.Role;
import online.grisk.afrodita.domain.entity.ServiceActivator;
import online.grisk.afrodita.domain.entity.TypeVariable;
import online.grisk.afrodita.domain.entity.Variable;
import online.grisk.afrodita.domain.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
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

    @LoadBalanced
    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder restTemplateBuilder) {
        return restTemplateBuilder
                .setConnectTimeout(Duration.ofHours(1))
                .setReadTimeout(Duration.ofHours(1))
                .build();
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

    @Bean
    ServiceActivator serviceActivatorArtemisa() {
        return new ServiceActivator("artemisa", HttpMethod.POST, "/api/artemisa", "artemisa", "GRisk.2019", new HashMap<>());
    }

    @Bean
    public Role roleWithCodeAdmin() {
        return roleService.findByCode("ADMIN");
    }

    @Bean
    public BCryptPasswordEncoder encoderPassword() {
        return new BCryptPasswordEncoder();
    }


    public static void main(String[] args) {
        SpringApplication.run(AfroditaApplication.class, args);
    }


    @Bean
    public List<Variable> getVariablesBureau() {
        List<Variable> variables = new ArrayList<>();
        variables.add(new Variable(1L, "Nombre", "name", null, "--", new TypeVariable(3L, "Palabra", "PA"), true));
        variables.add(new Variable(2L, "Apellido paterno", "apePad", null, "--", new TypeVariable(3L, "Palabra", "PA"), true));
        variables.add(new Variable(3L, "Apellido materno", "apeMat", null, "--", new TypeVariable(3L, "Palabra", "PA"), true));
        variables.add(new Variable(4L, "Edad", "indEdad", null, "0", new TypeVariable(1L, "Número entero", "NE"), true));
        variables.add(new Variable(5L, "Sexo", "indSexo", null, "--", new TypeVariable(3L, "Palabra", "PA"), true));
        variables.add(new Variable(63L, "Nacionalidad", "indNacionalidad", null, "--", new TypeVariable(3L, "Palabra", "PA"), true));
        variables.add(new Variable(64L, "Estado civil", "indEstCiv", null, "--", new TypeVariable(3L, "Palabra", "PA"), true));
        variables.add(new Variable(65L, "Número de hijos", "indNroHij", null, "0", new TypeVariable(1L, "Número entero", "NE"), true));
        variables.add(new Variable(6L, "Presenta fideicomiso financiero", "indTieneFDEF", null, "--", new TypeVariable(3L, "Palabra", "PA"), true));
        variables.add(new Variable(7L, "Cantidad de vehículos motorizados", "indTotVehs", null, "0", new TypeVariable(1L, "Número entero", "NE"), true));
        variables.add(new Variable(8L, "Monto total del avaluo fiscal de vehículos motorizados", "indMonVehs", null, "0", new TypeVariable(1L, "Número entero", "NE"), true));
        variables.add(new Variable(9L, "Cantidad de bienes raíces", "indTotBBRR", null, "0", new TypeVariable(1L, "Número entero", "NE"), true));
        variables.add(new Variable(10L, "Monto total del avaluo fiscal de los bienes raíces", "indMonBBRR", null, "0", new TypeVariable(1L, "Número entero", "NE"), true));
        variables.add(new Variable(11L, "Grupo socio económico", "indGrpSocEc", null, "--", new TypeVariable(3L, "Palabra", "PA"), true));
        variables.add(new Variable(12L, "Nivel educacional", "indNivelEduc", null, "--", new TypeVariable(3L, "Palabra", "PA"), true));
        variables.add(new Variable(13L, "Cantidad de documentos protestados dentro de los últimos 2 meses", "indCantDoc02", null, "0", new TypeVariable(1L, "Número entero", "NE"), true));
        variables.add(new Variable(14L, "Cantidad de documentos protestados dentro de los últimos 6 meses", "indCantDoc06", null, "0", new TypeVariable(1L, "Número entero", "NE"), true));
        variables.add(new Variable(15L, "Cantidad de documentos protestados dentro de los últimos 12 meses", "indCantDoc12", null, "0", new TypeVariable(1L, "Número entero", "NE"), true));
        variables.add(new Variable(16L, "Cantidad de documentos protestados dentro de los últimos 24 meses", "indCantDoc24", null, "0", new TypeVariable(1L, "Número entero", "NE"), true));
        variables.add(new Variable(17L, "Cantidad de documentos protestados dentro de los últimos 36 meses", "indCantDoc36", null, "0", new TypeVariable(1L, "Número entero", "NE"), true));
        variables.add(new Variable(18L, "Cantidad de documentos protestados aclarados dentro de los últimos 2 meses", "indCantDocA02", null, "0", new TypeVariable(1L, "Número entero", "NE"), true));
        variables.add(new Variable(19L, "Cantidad de documentos protestados aclarados dentro de los últimos 6 meses", "indCantDocA06", null, "0", new TypeVariable(1L, "Número entero", "NE"), true));
        variables.add(new Variable(20L, "Cantidad de documentos protestados aclarados dentro de los últimos 12 meses", "indCantDocA12", null, "0", new TypeVariable(1L, "Número entero", "NE"), true));
        variables.add(new Variable(21L, "Cantidad de documentos protestados aclarados dentro de los últimos 24 meses", "indCantDocA24", null, "0", new TypeVariable(1L, "Número entero", "NE"), true));
        variables.add(new Variable(22L, "Cantidad de documentos protestados aclarados dentro de los últimos 36 meses", "indCantDocA36", null, "0", new TypeVariable(1L, "Número entero", "NE"), true));
        variables.add(new Variable(23L, "Cantidad de documentos protestados no aclarados dentro de los últimos 2 meses", "indCantDocNA02", null, "0", new TypeVariable(1L, "Número entero", "NE"), true));
        variables.add(new Variable(24L, "Cantidad de documentos protestados no aclarados dentro de los últimos 6 meses", "indCantDocNA06", null, "0", new TypeVariable(1L, "Número entero", "NE"), true));
        variables.add(new Variable(25L, "Cantidad de documentos protestados no aclarados dentro de los últimos 12 meses", "indCantDocNA12", null, "0", new TypeVariable(1L, "Número entero", "NE"), true));
        variables.add(new Variable(26L, "Cantidad de documentos protestados no aclarados dentro de los últimos 24 meses", "indCantDocNA24", null, "0", new TypeVariable(1L, "Número entero", "NE"), true));
        variables.add(new Variable(27L, "Cantidad de documentos protestados no aclarados dentro de los últimos 36 meses", "indCantDocNA36", null, "0", new TypeVariable(1L, "Número entero", "NE"), true));
        variables.add(new Variable(28L, "Monto total de documentos protestados dentro de los últimos 2 meses", "indMonDoc02", null, "0,00", new TypeVariable(2L, "Número decimal", "ND"), true));
        variables.add(new Variable(29L, "Monto total de documentos protestados dentro de los últimos 6 meses", "indMonDoc06", null, "0,00", new TypeVariable(2L, "Número decimal", "ND"), true));
        variables.add(new Variable(30L, "Monto total de documentos protestados dentro de los últimos 12 meses", "indMonDoc12", null, "0,00", new TypeVariable(2L, "Número decimal", "ND"), true));
        variables.add(new Variable(31L, "Monto total de documentos protestados dentro de los últimos 24 meses", "indMonDoc24", null, "0,00", new TypeVariable(2L, "Número decimal", "ND"), true));
        variables.add(new Variable(32L, "Monto total de documentos protestados dentro de los últimos 36 meses", "indMonDoc36", null, "0,00", new TypeVariable(2L, "Número decimal", "ND"), true));
        variables.add(new Variable(33L, "Monto total de documentos protestados aclarados dentro de los últimos 2 meses", "indMonDocA02", null, "0,00", new TypeVariable(2L, "Número decimal", "ND"), true));
        variables.add(new Variable(34L, "Monto total de documentos protestados aclarados dentro de los últimos 6 meses", "indMonDocA06", null, "0,00", new TypeVariable(2L, "Número decimal", "ND"), true));
        variables.add(new Variable(35L, "Monto total de documentos protestados aclarados dentro de los últimos 12 meses", "indMonDocA12", null, "0,00", new TypeVariable(2L, "Número decimal", "ND"), true));
        variables.add(new Variable(36L, "Monto total de documentos protestados aclarados dentro de los últimos 24 meses", "indMonDocA24", null, "0,00", new TypeVariable(2L, "Número decimal", "ND"), true));
        variables.add(new Variable(37L, "Monto total de documentos protestados aclarados dentro de los últimos 36 meses", "indMonDocA36", null, "0,00", new TypeVariable(2L, "Número decimal", "ND"), true));
        variables.add(new Variable(38L, "Monto total de documentos protestados no aclarados dentro de los últimos 2 meses", "indMonDocNA02", null, "0,00", new TypeVariable(2L, "Número decimal", "ND"), true));
        variables.add(new Variable(39L, "Monto total de documentos protestados no aclarados dentro de los últimos 6 meses", "indMonDocNA06", null, "0,00", new TypeVariable(2L, "Número decimal", "ND"), true));
        variables.add(new Variable(40L, "Monto total de documentos protestados no aclarados dentro de los últimos 12 meses", "indMonDocNA12", null, "0,00", new TypeVariable(2L, "Número decimal", "ND"), true));
        variables.add(new Variable(41L, "Monto total de documentos protestados no aclarados dentro de los últimos 24 meses", "indMonDocNA24", null, "0,00", new TypeVariable(2L, "Número decimal", "ND"), true));
        variables.add(new Variable(42L, "Monto total de documentos protestados no aclarados dentro de los últimos 36 meses", "indMonDocNA36", null, "0,00", new TypeVariable(2L, "Número decimal", "ND"), true));
        variables.add(new Variable(43L, "Cantidad de cuentas corrientes canceladas dentro de los últimos 2 meses", "indCantCCC02", null, "0", new TypeVariable(1L, "Número entero", "NE"), true));
        variables.add(new Variable(44L, "Cantidad de cuentas corrientes canceladas dentro de los últimos 6 meses", "indCantCCC06", null, "0", new TypeVariable(1L, "Número entero", "NE"), true));
        variables.add(new Variable(45L, "Cantidad de cuentas corrientes canceladas dentro de los últimos 12 meses", "indCantCCC12", null, "0", new TypeVariable(1L, "Número entero", "NE"), true));
        variables.add(new Variable(46L, "Cantidad de cuentas corrientes canceladas dentro de los últimos 24 meses", "indCantCCC24", null, "0", new TypeVariable(1L, "Número entero", "NE"), true));
        variables.add(new Variable(47L, "Cantidad de cuentas corrientes canceladas dentro de los últimos 36 meses", "indCantCCC36", null, "0", new TypeVariable(1L, "Número entero", "NE"), true));
        variables.add(new Variable(48L, "Cantidad de tarjeta de crédito canceladas dentro de los últimos 2 meses", "indCantTCC02", null, "0", new TypeVariable(1L, "Número entero", "NE"), true));
        variables.add(new Variable(49L, "Cantidad de tarjeta de crédito canceladas dentro de los últimos 6 meses", "indCantTCC06", null, "0", new TypeVariable(1L, "Número entero", "NE"), true));
        variables.add(new Variable(50L, "Cantidad de tarjeta de crédito canceladas dentro de los últimos 12 meses", "indCantTCC12", null, "0", new TypeVariable(1L, "Número entero", "NE"), true));
        variables.add(new Variable(51L, "Cantidad de tarjeta de crédito canceladas dentro de los últimos 24 meses", "indCantTCC24", null, "0", new TypeVariable(1L, "Número entero", "NE"), true));
        variables.add(new Variable(52L, "Cantidad de tarjeta de crédito canceladas dentro de los últimos 36 meses", "indCantTCC36", null, "0", new TypeVariable(1L, "Número entero", "NE"), true));
        variables.add(new Variable(53L, "Puntaje score dentro de los últimos 2 meses", "indPuntScore02", null, "0", new TypeVariable(1L, "Número entero", "NE"), true));
        variables.add(new Variable(54L, "Puntaje score dentro de los últimos 6 meses", "indPuntScore06", null, "0", new TypeVariable(1L, "Número entero", "NE"), true));
        variables.add(new Variable(55L, "Puntaje score dentro de los últimos 12 meses", "indPuntScore12", null, "0", new TypeVariable(1L, "Número entero", "NE"), true));
        variables.add(new Variable(56L, "Puntaje score dentro de los últimos 24 meses", "indPuntScore24", null, "0", new TypeVariable(1L, "Número entero", "NE"), true));
        variables.add(new Variable(57L, "Puntaje score dentro de los últimos 36 meses", "indPuntScore36", null, "0", new TypeVariable(1L, "Número entero", "NE"), true));
        variables.add(new Variable(58L, "Presenta boletín concursal dentro de los últimos 2 meses", "indBolCon02", null, "--", new TypeVariable(3L, "Palabra", "PA"), true));
        variables.add(new Variable(59L, "Presenta boletín concursal dentro de los últimos 6 meses", "indBolCon06", null, "--", new TypeVariable(3L, "Palabra", "PA"), true));
        variables.add(new Variable(60L, "Presenta boletín concursal dentro de los últimos 12 meses", "indBolCon12", null, "--", new TypeVariable(3L, "Palabra", "PA"), true));
        variables.add(new Variable(61L, "Presenta boletín concursal dentro de los últimos 24 meses", "indBolCon24", null, "--", new TypeVariable(3L, "Palabra", "PA"), true));
        variables.add(new Variable(62L, "Presenta boletín concursal dentro de los últimos 36 meses", "indBolCon36", null, "--", new TypeVariable(3L, "Palabra", "PA"), true));
        return variables;
    }

    @Bean
    public List<TypeVariable> getTypesVariables(){
        List<TypeVariable> types = new ArrayList<>();
        types.add(new TypeVariable(1L, "Número entero", "NE"));
        types.add(new TypeVariable(2L, "Número decimal", "ND"));
        types.add(new TypeVariable(3L, "Palabra", "PA"));
        return types;
    }
}
