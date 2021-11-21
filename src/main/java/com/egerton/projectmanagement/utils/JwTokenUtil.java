package com.egerton.projectmanagement.utils;

import com.egerton.projectmanagement.models.Login;
import com.egerton.projectmanagement.repositories.LoginRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;

@Service
public class JwTokenUtil {
    @Value(value = "jwt.secret")
    private String SECRET_KEY;

    public static final long JWT_TOKEN_VALIDITY = 7 * 24 * 60 * 60;

    @Autowired
    private LoginRepository loginRepository;

    public String getUsername( String token){
        return extractClaim( token, Claims::getSubject);
    }
    public Date getExpiration(String token){
        return extractClaim( token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsFunction){
        final Claims claims = extractAllClaims(token);
        return claimsFunction.apply(claims);
    }

    private Claims extractAllClaims( String token){
        return Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token).getBody();
    }

    private  Boolean isTokenExpired( String token){
        return  getExpiration(token).before(new Date());

    }

    public String generateToken(UserDetails userDetails){
        Map<String, Object> claims = new HashMap<>();
        return createToken( claims, userDetails.getUsername());
    }

    private String createToken( Map<String, Object> claims, String subject){
        long currentTime = System.currentTimeMillis() ;
        long expiryDate = currentTime + (JWT_TOKEN_VALIDITY * 1000);
        return Jwts.builder().setClaims(claims).setSubject(subject).setIssuedAt( new Date( currentTime))
                .setExpiration( new Date(expiryDate ))
                .signWith( SignatureAlgorithm.HS256, SECRET_KEY).compact();
    }

    public  Boolean validateToken( String token, UserDetails userDetails){
        final String username = getUsername(token);
        Optional<Login> login = loginRepository.findLoginByEmail( username);
        if( login.isPresent()){
            return ( username.equals( userDetails.getUsername()) && !isTokenExpired(token));
        }
        return false;
    }
}
