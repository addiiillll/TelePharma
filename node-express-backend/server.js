const app = require('./src/app');
require('./src/config/firebase'); // Initialize Firebase

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🚀 TelePharma Backend is ready!`);
});