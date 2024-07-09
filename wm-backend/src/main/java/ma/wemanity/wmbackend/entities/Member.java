package ma.wemanity.wmbackend.entities;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.wemanity.wmbackend.enums.Role;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Document @Data @NoArgsConstructor @AllArgsConstructor
public class Member implements UserDetails {
    @Id
    private String id;
    @NotNull @Indexed(unique = true)
    private String username;
    @NotNull
    private String password;
    @NotNull
    private Set<Role> role = new HashSet<>();
    @DBRef
    private Set<Board> ownerOf = new HashSet<>();
    @DBRef
    private Set<Board> memberOf = new HashSet<>();
    @DBRef
    private Set<Comment> authorOf = new HashSet<>();

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public boolean isAccountNonExpired() {
        return UserDetails.super.isAccountNonExpired();
    }

    @Override
    public boolean isAccountNonLocked() {
        return UserDetails.super.isAccountNonLocked();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return UserDetails.super.isCredentialsNonExpired();
    }

    @Override
    public boolean isEnabled() {
        return UserDetails.super.isEnabled();
    }
}
