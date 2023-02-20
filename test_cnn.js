const birthday = new Date();
const month = birthday.getMonth();
const year = birthday.getFullYear();

console.log(month + 1, year);
const newDate = new Date(year, month, -2);
console.log(newDate.toDateString());

// console.log((1 - 3) % 30);
