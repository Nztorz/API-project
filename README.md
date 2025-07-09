# SkillVault

- Users can register, login and create entries. Logs to keep track of their progress while learning any skill.
- This project make use of Node.js/Express. SQLite3 as database managed using Sequelize ORM. 
- Using bcrypt, JWT to keep user's data secure.

## Database Schema Design

![db-schema]

## API Documentation

- Base URL http://localhost:8000/api

| Method | Endpoint          | Description         | Auth Required |
|--------|-------------------|---------------------|---------------|
|**POST**|*/users/register*  | Register a new user |❌ No         |
|**POST**|*/users/login*     | Log in and receive JWT token |❌ No|
|**GET** |*/entries*         | Get all user entries|✅ Yes        |
|**POST**|*/entries*         | Create a new entry  |✅ Yes        |
|**PUT** |*/entries/:id*     | Update an entry by id|✅ Yes       |
|**Delete**|*/entries/:id*   | Delete an entry by Id|✅ Yes       |


[db-schema]: ./images/Database%20Schema%20Design.png
[base-url]: http://localhost:8000/api