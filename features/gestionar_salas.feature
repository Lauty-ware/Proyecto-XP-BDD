Feature: Gestión de salas
  Como administrador
  Quiero crear y eliminar salas
  Para mantener el catálogo actualizado

  Scenario: Crear sala exitosamente
    Given que soy administrador
    When creo la sala "Sala C" con capacidad 8 y precio 60
    Then la sala "Sala C" debe existir

  Scenario: Eliminar sala con reservas activas falla
    Given que soy administrador
    And que existe la sala "Sala A" con precio 50
    And que existe un usuario "juan@example.com" con saldo 100
    And que "juan@example.com" ya reservó la sala "Sala A" para el día "2026-10-15"
    When intento eliminar la sala "Sala A"
    Then la eliminación debe fallar con mensaje "No se puede eliminar una sala con reservas activas"