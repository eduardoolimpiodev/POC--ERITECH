const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

const MONGODB_URI = 'mongodb://localhost:27017';
const DB_NAME = 'erictel';

async function seedUsers() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    const usersCollection = db.collection('users');
    
    await usersCollection.deleteMany({});
    console.log('Cleared existing users');
    
    const testUsers = [
      {
        email: 'admin@erictel.com',
        password: await bcrypt.hash('admin123', 10),
        name: 'Admin User',
        description: 'Administrator account',
        profileImage: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'user1@erictel.com',
        password: await bcrypt.hash('user123', 10),
        name: 'João Silva',
        description: 'Desenvolvedor Frontend com 3 anos de experiência',
        profileImage: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'user2@erictel.com',
        password: await bcrypt.hash('user123', 10),
        name: 'Maria Santos',
        description: 'Desenvolvedora Backend especialista em Node.js',
        profileImage: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'user3@erictel.com',
        password: await bcrypt.hash('user123', 10),
        name: 'Pedro Oliveira',
        description: 'DevOps Engineer com foco em containerização',
        profileImage: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'inactive@erictel.com',
        password: await bcrypt.hash('inactive123', 10),
        name: 'Usuário Inativo',
        description: 'Conta desativada para teste',
        profileImage: null,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    const result = await usersCollection.insertMany(testUsers);
    console.log(`Inserted ${result.insertedCount} users`);
    
    const users = await usersCollection.find({}, { projection: { password: 0 } }).toArray();
    console.log('\nCreated users:');
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Active: ${user.isActive}`);
    });
    
  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    await client.close();
    console.log('\nDisconnected from MongoDB');
  }
}

seedUsers();
