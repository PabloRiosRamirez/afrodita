package online.grisk.afrodita.security.service.details.impl;

import online.grisk.afrodita.domain.entity.Role;
import online.grisk.afrodita.persistence.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.SpringSecurityMessageSource;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service("customUserDetailsService")
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        List<GrantedAuthority> grantList = new ArrayList<>();
        online.grisk.afrodita.domain.entity.User user = userRepository.findByUsernameOrEmail(username.toUpperCase(), username.toLowerCase());
        if (user == null) {
            throw new UsernameNotFoundException(SpringSecurityMessageSource.getAccessor()
                    .getMessage("AbstractUserDetailsAuthenticationProvider.UserUnknown", new Object[]{username}, "{0} no está registrado"));
        }
        Role role = user.getRole();
        if (role != null) {
            grantList.add(new SimpleGrantedAuthority("ROLE_" + role.getCode().toUpperCase()));
        }
        return new User(user.getUsername().toUpperCase(), user.getPass(), user.isEnabled(), true, true, user.isNonLocked(), grantList);
    }
}