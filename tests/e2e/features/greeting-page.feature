Feature: Greeting page
  As a visitor
  I want to type my name and get a greeting
  So that I can see the app talk to the server

  Scenario: Greet by name
    Given I open the app
    When I type "Ada" as my name
    And I press "Greet"
    Then I see "Hello, Ada!"

  Scenario: Greet with the Enter key
    Given I open the app
    When I type "Ada" as my name and press Enter
    Then I see "Hello, Ada!"

  Scenario: Greet without a name
    Given I open the app
    When I press "Greet"
    Then I see "Hello!"

  Scenario: Greet using only the keyboard
    Given I open the app
    When I press Tab
    Then the name field has the focus
    When I type "Ada" on the keyboard
    And I press Tab
    Then the "Greet" button has the focus
    When I press Enter
    Then I see "Hello, Ada!"

  Scenario: Tell the user when the server cannot be reached
    Given I open the app
    And the server cannot be reached
    When I press "Greet"
    Then I see the error "The server cannot be reached. Try again in a moment."

  Scenario: The page is accessible
    Given I open the app
    Then the page has no accessibility violations
