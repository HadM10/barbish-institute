// Import necessary libraries and hooks
import React, { useState, useEffect } from 'react';

// Define the BonusCards component
const BonusCards = () => {
  // State to store the list of bonus cards
  const [bonusCards, setBonusCards] = useState([]);

  // Fetch bonus cards from the API when the component is mounted
  useEffect(() => {
    fetch('/api/bonus-cards') // API endpoint for fetching bonus cards
      .then((response) => response.json()) // Parse the response as JSON
      .then((data) => setBonusCards(data)) // Update the state with the fetched bonus cards
      .catch((error) => console.error('Error fetching bonus cards:', error)); // Handle any errors
  }, []); // Empty dependency array ensures this effect runs only once

  return (
    <div className="bonus-cards">
      {/* Page heading */}
      <h2>Bonus Cards</h2>
      {/* List of bonus cards */}
      <ul>
        {bonusCards.map((card) => (
          <li key={card.id}> {/* Unique key for each card */}
            <p>
              {card.cardCode} - {card.value} {/* Display the card code and its value */}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Export the BonusCards component for use in other parts of the app
export default BonusCards;
