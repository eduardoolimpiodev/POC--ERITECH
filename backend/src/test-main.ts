console.log('Testing basic TypeScript compilation...');

try {
  console.log('Environment variables:');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('PORT:', process.env.PORT);
} catch (error) {
  console.error('Error:', error);
}
