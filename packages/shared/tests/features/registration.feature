Feature: Registration
  As a new user, I want to be registered as a new member on property logger

  @web
  Scenario: Successful member creation
    Given I am a new user
    When My user account is verified
    Then I am created as a new member
    And I am able to access the app

  @api
  Scenario: Create new member using the API
    Given I am a new user
    When I request to create a member account
    Then a new member account is created for me

  @api
  Scenario: Create and retrieve new member by email address using the API
    Given I am a new user
    When I request to create a member account
    Then I am able to retrieve that member account by email
