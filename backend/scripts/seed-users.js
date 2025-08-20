const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

const MONGODB_URI = 'mongodb://localhost:27017';
const DB_NAME = 'erictel';

async function seedUsers() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    
    const db = client.db(DB_NAME);
    const usersCollection = db.collection('users');
    
    await usersCollection.deleteMany({});
    
    const testUsers = [
      {
        email: 'user@example.com',
        password: await bcrypt.hash('password123', 10),
        name: 'Eduardo Olimpio',
        description: 'Test user account',
        profileImage: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
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
    
    const users = await usersCollection.find({}, { projection: { password: 0 } }).toArray();
    
  } catch (error) {
  } finally {
    await client.close();
  }
}

seedUsers();
