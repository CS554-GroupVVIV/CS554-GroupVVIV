import React from 'react';

export default function Chat({chat}) {
  return chat.map(({name, message}, index) => (
    <div key={index}>
      <h3>
        {name}: <span>{message}</span>
      </h3>
    </div>
  ));
}
