Feature: Journaling
  As a user I should be able to create, edit, and delete journal entries

  @api
  Scenario Outline: Create a new journal
    Given I have created a new journal with a title of <newTitle> and content of <newContent>
    When I save the journal
    Then I should be able to retrieve the journal

    Examples:
      | newTitle    | newContent             |
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
