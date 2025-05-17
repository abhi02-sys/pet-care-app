require('dotenv').config();

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const groupRoutes = require('./routes/groupRoutes');
const petRoutes = require('./routes/petRoutes');
const todoRoutes = require('./routes/todoRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const healthRecordsRoutes = require('./routes/healthRecordsRoutes');
const cgtodoRoutes = require('./routes/cgtodoRoutes');
const cgAppointmentRoutes = require('./routes/cgAppointmentRoutes');
const cgHealthRecordsRoutes = require('./routes/cgHealthRecordsRoutes');

const groupMembersRoutes = require('./routes/groupMembersRoutes');






//for other members
const groupJoinRoutes = require('./routes/groupJoinRoutes');

const app = express();
const PORT = 3000;

app.use(cors());  // This will allow all domains; you can configure it to allow specific domains

app.use(bodyParser.json());
//for forms
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '..', 'public')));

// Auth routes
app.use('/api', authRoutes);

//Group routes
app.use('/api', groupRoutes);

app.use('/api/pets', petRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/health-records', healthRecordsRoutes);

app.use('/api', groupJoinRoutes);
app.use('/api', groupMembersRoutes);
app.use('/api/cg/todos', cgtodoRoutes);
app.use('/api/cg/appointments', cgAppointmentRoutes);
app.use('/api/cg/health-records', cgHealthRecordsRoutes);

// Default routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
});

app.get('/role',(req,res)=>{
  res.sendFile(path.join(__dirname, '..', 'public', 'role.html'));
})

app.get('/pet-profile',(req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'pet-profile.html'));
});

app.get('/todo', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'todo.html'));
});

app.get('/allPets', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'allPets.html'));
});




// 404 handler


app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
