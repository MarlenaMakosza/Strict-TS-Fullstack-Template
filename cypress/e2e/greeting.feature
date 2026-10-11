Feature: Greeting
  As a user starting the app
  I want to see a greeting with the environment name
  So that I know the app started in the right environment

  Scenario Outline: Show the environment the app runs in
    When I start the app with NODE_ENV "<environment>"
    Then the app prints "Hello, world! (<environment>)"

    Examples:
      | environment |
      | development |
      | test        |
      | production  |

  Scenario: Refuse to start with an unknown environment
    When I start the app with NODE_ENV "staging"
    Then the app fails with "Missing or invalid values in .env"