package online.grisk.afrodita.controller.utils;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.security.Principal;
import java.util.Collection;

public class ControllerUtils {

    public static User getUserFromPrincipal(Principal principal) throws NullPointerException{
        final User user = (User) ((Authentication) principal).getPrincipal();
        return user;
    }

    public static String toString(User user) {
        StringBuilder sb = new StringBuilder();
        sb.append("username: ").append(user.getUsername());

        Collection<GrantedAuthority> authorities = user.getAuthorities();
        if (authorities != null && !authorities.isEmpty()) {
            sb.append(" (");
            boolean first = true;
            for (GrantedAuthority g : authorities){
                if(first){
                    sb.append(g.getAuthority());
                    first=false;
                }else{
                    sb.append(", ").append(g.getAuthority());
                }
            }
            sb.append(")");
        }
        return sb.toString();
    }
}
