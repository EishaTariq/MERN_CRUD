const express=require("express")
const mongoose=require("mongoose")
const cors=require('cors')
const UserModel=require('./models/Users')
const app=express();
app.use(cors())
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/crud")

app.get('/',(req,res)=>{
    UserModel.find({})
    .then(users=>res.json(users))
    .catch(err=>res.json(err))
})

app.post('/createUser', async (req, res) => {
    try {
        console.log("Received Data:", req.body);

        const user = await UserModel.create(req.body);

        res.status(201).json(user);
    } catch (err) {
        console.log("Database Error:", err);

        res.status(500).json({
            message: err.message
        });
    }
});

app.get('/getUser/:id', (req, res) => {
    const id = req.params.id;

    UserModel.findById(id)
    .then(user => res.json(user))
    .catch(err => {
        console.log(err);
        res.status(500).json({ message: err.message });
    });
});
app.put('/updateUser/:id', (req, res) => {
    const id = req.params.id;

    UserModel.findByIdAndUpdate(
        id,
        {
            name: req.body.name,
            email: req.body.email,
            age: req.body.age
        },
        { new: true }
    )
    .then(user => res.json(user))
    .catch(err => {
        console.log(err);
        res.status(500).json({ message: err.message });
    });
});
app.delete('/deleteUser/:id', (req, res) => {
    const id = req.params.id;

    UserModel.findByIdAndDelete(id)
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json({ message: 'User deleted successfully' });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: err.message });
        });
});
app.listen(3000,()=>{
    console.log("Sever is running")
})               