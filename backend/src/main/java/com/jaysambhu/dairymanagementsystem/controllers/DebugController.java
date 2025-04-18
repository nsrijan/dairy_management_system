package com.jaysambhu.dairymanagementsystem.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/debug")
@Slf4j
public class DebugController {

    @GetMapping("/public")
    public String publicEndpoint() {
        log.info("Public endpoint accessed");
        return "This is a public endpoint";
    }

    @PostMapping("/echo")
    public String echo(@RequestBody String body) {
        log.info("Echo endpoint accessed with body: {}", body);
        return "Received: " + body;
    }
}