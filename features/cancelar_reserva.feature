Feature: Cancelación de reserva
  Como usuario
  Quiero cancelar mi reserva
  Para liberar la sala y recuperar mi saldo

  Scenario: Cancelación exitosa
    Given que existe un usuario "juan@example.com" con saldo 100
    And que existe la sala "Sala A" con precio 50
    And que "juan@example.com" ya reservó la sala "Sala A" para el día "2026-10-15"
    When "juan@example.com" cancela su reserva en "Sala A" para el día "2026-10-15"
    Then la cancelación debe ser exitosa
    And el saldo del usuario "juan@example.com" debe ser 100

  Scenario: Cancelación fallida por reserva inexistente
    Given que existe un usuario "juan@example.com" con saldo 100
    When "juan@example.com" cancela su reserva en "Sala A" para el día "2026-10-15"
    Then la cancelación debe fallar con mensaje "Reserva no encontrada"