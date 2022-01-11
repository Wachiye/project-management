package com.egerton.projectmanagement;

import net.bytebuddy.utility.RandomString;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ProjectmanagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProjectmanagementApplication.class, args);
    }

//    @Bean
//    public WebMvcConfigurer corsConfigurer(){
//        return new WebMvcConfigurer() {
//            @Override
//            public void addCorsMappings( CorsRegistry registry){
//                registry.addMapping("/**").allowedOrigins("*");
//            }
//        };
//    }
}
