Feature: HTTP API
  As a frontend developer
  I want the backend to answer over HTTP
  So that a frontend can talk to it out of the box

  Scenario Outline: Report that the server is up
    Given the server runs with NODE_ENV "<environment>"
    When I request "/api/health"
    Then the response status is 200
    And the response body is '{"status":"ok"}'

    Examples:
      | environment |
      | development |
      | test        |
      | production  |

  Scenario Outline: Greet by name
    Given the server runs
    When I request "/api/greeting?name=<name>"
    Then the response status is 200
    And the response body is '{"message":"<message>"}'

    Examples:
      | name      | message     |
      | Ada       | Hello, Ada! |
      | %20Ada%20 | Hello, Ada! |

  Scenario: Greet without a name
    Given the server runs
    When I request "/api/greeting"
    Then the response status is 200
    And the response body is '{"message":"Hello!"}'

  Scenario: Answer an unknown address with 404
    Given the server runs
    When I request "/api/unknown"
    Then the response status is 404

  Scenario: Refuse to start with an unknown environment
    When I start the server with NODE_ENV "staging"
    Then the server fails with "Missing or invalid values in .env"
