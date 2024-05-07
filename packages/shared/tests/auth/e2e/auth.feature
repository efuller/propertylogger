Feature: Login
  As a user I should be able to login to the application

  @web
  Scenario: A registered member can login and access their dashboard
    Given I am on the homepage
    When I login
    Then I am redirected to my dashboard