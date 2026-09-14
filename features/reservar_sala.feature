Feature: Reserva de espacios
  Como usuario registrado
  Quiero reservar una sala de reuniones
  Para tener un lugar privado de trabajo

  Scenario: Reserva exitosa de una sala disponible
    Given que existe un usuario "juan@example.com" con saldo 100
    And que existe la sala "Sala A" con precio 50
    When "juan@example.com" reserva la sala "Sala A" para el día "2026-10-15"
    Then la reserva debe confirmarse exitosamente
    And el saldo del usuario "juan@example.com" debe ser 50

  Scenario: Reserva fallida por saldo insuficiente
    Given que existe un usuario "pobre@example.com" con saldo 10
    And que existe la sala "Sala A" con precio 50
    When "pobre@example.com" reserva la sala "Sala A" para el día "2026-10-15"
    Then la reserva debe fallar con mensaje "Saldo insuficiente"

  Scenario: Reserva fallida por solapamiento
    Given que existe un usuario "juan@example.com" con saldo 200
    And que existe la sala "Sala A" con precio 50
    And que "juan@example.com" ya reservó la sala "Sala A" para el día "2026-10-15"
    When "juan@example.com" reserva la sala "Sala A" para el día "2026-10-15"
    Then la reserva debe fallar con mensaje "La sala no está disponible"