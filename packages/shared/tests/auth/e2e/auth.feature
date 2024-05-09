Feature: Login
  As a new user, I want to be registered as a new member on property logger

  @web
  Scenario: Successful member creation
    Given I am a new user
    When I am created as a new member
    Then I am able to access the app