Feature: Listar salas disponibles
  Como usuario
  Quiero consultar salas disponibles por fecha
  Para planificar mi reserva

  Scenario: Listar salas disponibles en fecha libre
    Given que existen las salas "Sala A" y "Sala B"
    When consulto salas disponibles para el día "2026-10-15"
    Then debo ver 2 salas disponibles

  Scenario: Filtrar salas ocupadas
    Given que existen las salas "Sala A" y "Sala B"
    And que existe un usuario "juan@example.com" con saldo 100
    And que "juan@example.com" ya reservó la sala "Sala A" para el día "2026-10-15"
    When consulto salas disponibles para el día "2026-10-15"
    Then debo ver 1 sala disponible