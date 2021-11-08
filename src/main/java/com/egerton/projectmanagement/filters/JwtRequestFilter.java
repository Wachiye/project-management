package com.egerton.projectmanagement.filters;

import com.egerton.projectmanagement.services.JwtStudentDetailsService;
import com.egerton.projectmanagement.utils.JwTokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.persistence.Column;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {
    @Autowired
    private JwtStudentDetailsService studentDetailsService;
    @Autowired
    private JwTokenUtil jwTokenUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        final  String authHeader = request.getHeader("Authorization");
        String username = null;
        String jwtToken = null ;

        if( authHeader != null && authHeader.startsWith("Bearer")){
            jwtToken = authHeader.substring(7);
            username = jwTokenUtil.getUsername( jwtToken);
        }

        if( username != null & SecurityContextHolder.getContext().getAuthentication() == null){
            UserDetails userDetails = this.studentDetailsService.loadUserByUsername(username);
            if(jwTokenUtil.validateToken(jwtToken, userDetails)){
                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities()
                );
                authenticationToken.setDetails( new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication( authenticationToken);
            }
        }
        filterChain.doFilter( request, response);
    }
}
