package com.egerton.projectmanagement.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwTokenUtil {
    @Value(value = "jwt.secret")
    private String SECRET_KEY;

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
        long expiryDate = System.currentTimeMillis() + 1000 * 60 * 60 * 7 ;
        return Jwts.builder().setClaims(claims).setSubject(subject).setIssuedAt( new Date( System.currentTimeMillis()))
                .setExpiration( new Date(expiryDate ))
                .signWith( SignatureAlgorithm.HS256, SECRET_KEY).compact();
    }

    public  Boolean validateToken( String token, UserDetails userDetails){
        final String username = getUsername(token);
        return ( username.equals( userDetails.getUsername()) && !isTokenExpired(token));
    }
}
