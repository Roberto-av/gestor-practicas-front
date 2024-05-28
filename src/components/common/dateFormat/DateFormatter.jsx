import React from 'react';

function DateFormatter({ dateString }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Agrega un cero inicial si es necesario
    const day = ('0' + date.getDate()).slice(-2); // Agrega un cero inicial si es necesario
    return `${year}-${month}-${day}`;
  };

  return <span>{formatDate(dateString)}</span>;
}

export default DateFormatter;
