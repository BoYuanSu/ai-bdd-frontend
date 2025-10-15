Feature: Add item to cart
  As a shopper
  I want to add items to my cart
  So that I can purchase them later

  Scenario: Add a new item to an empty cart
    Given the cart is empty
    When I add "New Item" with quantity 1
    Then I should see 1 item in the cart named "New Item" with quantity 1
