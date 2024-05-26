Feature: Registration
  As a new user, I want to be registered as a new member on property logger

  @web
  Scenario: Successful member creation
    Given I am a new user
    When My user account is verified
    Then I am created as a new member
    And I am able to access the app