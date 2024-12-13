import React, { useState, useEffect } from 'react';

const BonusCards = () => {
  const [bonusCards, setBonusCards] = useState([]);

  useEffect(() => {
    fetch('/api/bonus-cards')
      .then((response) => response.json())
      .then((data) => setBonusCards(data))
      .catch((error) => console.error('Error fetching bonus cards:', error));
  }, []);

  return (
    <div className="bonus-cards">
      <h2>Bonus Cards</h2>
      <ul>
        {bonusCards.map((card) => (
          <li key={card.id}>
            <p>{card.cardCode} - {card.value}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BonusCards;
