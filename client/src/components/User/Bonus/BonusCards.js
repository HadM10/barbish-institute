import React from "react";

const BonusCards = () => {
  const cards = [
    {
      id: 1,
      image: "https://via.placeholder.com/150", // Replace with your image URLs
      name: "Product Name 1",
      priceBefore: "$30.00",
      priceAfter: "$25.00",
      location: "New York, USA",
    },
    {
      id: 2,
      image: "https://via.placeholder.com/150",
      name: "Product Name 2",
      priceBefore: "$50.00",
      priceAfter: "$40.00",
      location: "Los Angeles, USA",
    },
    {
      id: 3,
      image: "https://via.placeholder.com/150",
      name: "Product Name 3",
      priceBefore: "$20.00",
      priceAfter: "$15.00",
      location: "Chicago, USA",
    },
  ];

  return (
    <div className="bg-gray-100 py-10">
      <h1 className="text-center text-2xl font-bold text-primary mb-6">
        Bonus Cards
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4">
        {cards.map((card) => (
          <div key={card.id} className="bg-white p-4 rounded-lg shadow-md">
            <img
              src={card.image}
              alt={card.name}
              className="w-full h-48 object-cover rounded"
            />
            <div className="mt-4 text-center">
              <h2 className="text-lg font-semibold">{card.name}</h2>
              <p className="text-sm text-gray-500 line-through">{card.priceBefore}</p>
              <p className="text-lg font-bold text-secondary">{card.priceAfter}</p>
              <p className="text-sm text-gray-600 mt-2">{card.location}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BonusCards;
