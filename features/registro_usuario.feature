Feature: Registro de usuario
  Como visitante
  Quiero registrarme con email y contraseña
  Para acceder a la plataforma

  Scenario: Registro exitoso con datos válidos
    Given que no existe un usuario con email "juan@example.com"
    When me registro con email "juan@example.com" y contraseña "Password123"
    Then el registro debe ser exitoso
    And debo recibir un usuario con email "juan@example.com"
    And la contraseña almacenada no debe ser "Password123"

  Scenario: Registro fallido por email duplicado
    Given que ya existe un usuario con email "juan@example.com"
    When me registro con email "juan@example.com" y contraseña "Password123"
    Then el registro debe fallar con mensaje "El email ya está registrado"

  Scenario: Registro fallido por contraseña corta
    Given que no existe un usuario con email "corto@example.com"
    When me registro con email "corto@example.com" y contraseña "123"
    Then el registro debe fallar con mensaje "La contraseña debe tener al menos 8 caracteres"