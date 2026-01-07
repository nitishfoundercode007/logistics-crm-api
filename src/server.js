require('dotenv').config();
const app = require('./app');

// const PORT = process.env.PORT;
// console.log('port',PORT);
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });

const PORT = process.env.PORT || 4600;
console.log('port',PORT);
const HOST = '0.0.0.0'; // public access
app.listen(PORT, HOST, () => console.log(`🚀 Server running on ${HOST}:${PORT}`));