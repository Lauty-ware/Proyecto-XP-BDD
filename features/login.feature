Feature: Inicio de sesión
  Como usuario registrado
  Quiero iniciar sesión
  Para acceder a mis reservas

  Scenario: Login exitoso
    Given que existe un usuario "maria@example.com" con contraseña "Password123"
    When inicio sesión con email "maria@example.com" y contraseña "Password123"
    Then debo recibir un token JWT válido

  Scenario: Login fallido por contraseña incorrecta
    Given que existe un usuario "maria@example.com" con contraseña "Password123"
    When inicio sesión con email "maria@example.com" y contraseña "WrongPass"
    Then el login debe fallar con mensaje "Credenciales inválidas"