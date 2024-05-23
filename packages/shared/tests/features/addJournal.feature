Feature: Journaling
  As a user I should be able to create, edit, and delete journal entries

  @api
  Scenario Outline: User sends data to create a new journal
    Given the backend API is accessible
    When a user sends a POST request to the "/journal" endpoint with a title of <title> and content of <content>
    Then the API should respond with a success of true
    And the response should contain title of <title> and content of <content>

    Examples:
      | title       | content                |
      | Test Journal| Sample journal content |

  @web
  Scenario Outline: User creates a new journal
    Given the user is on the homepage page
    And the form for adding a new journal is visible
    When the user enters a title of <title> and content of <content> and clicks the submit button
    Then the page should display the title of <title> and content of <content>

    Examples:
      | title       | content                |
      | Test Journal| Sample journal content |
