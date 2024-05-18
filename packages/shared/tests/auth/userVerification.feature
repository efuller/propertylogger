Feature: User Verification
  As a new user,
  I want to be verified
  So I can be created as a new member

  @web
  Scenario: New user is verified and becomes member
    Given I am a new user
    When My user account is verified
    Then I am created as a new member

  @web
  Scenario: New user fails verification
    Given I am a new user
    When My user account fails verification
    Then I am not created as a new member
