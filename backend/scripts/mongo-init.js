db = db.getSiblingDB('erictel');

db.createCollection('users');
db.createCollection('sessions');
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "isActive": 1 });
db.users.createIndex({ "createdAt": 1 });

db.users.insertOne({
  email: "admin@erictel.com",
  password: "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uDfm",
  name: "Admin User",
  description: "System administrator with full access to manage users and cryptocurrencies",
  profileImage: null,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

print('Database initialized successfully!');
