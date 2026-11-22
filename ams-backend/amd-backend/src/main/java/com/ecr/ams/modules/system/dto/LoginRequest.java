package com.ecr.ams.modules.system.dto;
import lombok.Data;
@Data
public class LoginRequest {
    private String email;
    private String password;
}
