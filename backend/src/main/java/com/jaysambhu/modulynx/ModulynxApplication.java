package com.jaysambhu.modulynx;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@EnableJpaAuditing
@ComponentScan(basePackages = {
        "com.jaysambhu.modulynx.*"
})
public class ModulynxApplication {

    public static void main(String[] args) {
        SpringApplication.run(ModulynxApplication.class, args);
    }

}
