package com.jaysambhu.modulynx;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@EnableJpaAuditing
@ComponentScan(basePackages = {
        "com.jaysambhu.modulynx.core",
        "com.jaysambhu.modulynx.modules",
        "com.jaysambhu.modulynx.common",
        "com.jaysambhu.modulynx.config",
        "com.jaysambhu.modulynx.context"
})
public class ModulynxApplication {

    public static void main(String[] args) {
        SpringApplication.run(ModulynxApplication.class, args);
    }

}
