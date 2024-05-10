const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')


const {User, Transaction} = require('./model')

const app = express()

app.use(bodyParser.json())

const port = 4500;

const DBUri = "mongodb://localhost:27017/Users"

mongoose.connect(DBUri)
.then(() => {
    console.log(`Database is connected`)
})
.catch(() => {
    console.log(`Database is not connected`)
});

// Create an account
app.post('/Createaccount/', async (req, res) => {
    try {
        const user = new User(req.body)
        await user.save()
        res.status(201).json(user)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
});

// Get all user
app.get('/users/', async (req, res) => {
    try {
        const users = await User.find({});
        res.status(201).json(users)
    }
    catch(error) {
        res.status(409).json({message: error})
    }
});

// Get single user
app.get('/user/:id', async (req, res) => {
    const userValidation = mongoose.Types.ObjectId.isValid(req.params.id)
    const user = await User.findById(req.params.id)
    if(!userValidation) {
        res.status(400).json({message: 'Invalid user id'})
    } else if (!user) {
        res.status(400).json({message: 'Account does not exit!'})
    } else {
        const user = await User.findById(req.params.id)
        res.status(201).json(user)
    }
});

// Update an account
app.put('/user/:id', async (req, res) => {
    const userValidation = mongoose.Types.ObjectId.isValid(req.params.id)
    const user = await User.findById(req.params.id)
    if (!userValidation) {
        res.status(400).json({message: 'Invalid user id'})
    } else if (!user) {
        res.status(400).json({message: 'Account does not exit!'})
    } else {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true})
        res.status(201).json(user)
    }
})

// deposit api

app.put(`/user/deposit/:id`, async (req, res) => {
    const userValidation = mongoose.Types.ObjectId.isValid(req.params.id)
    const user = await User.findById(req.params.id)
    const amount = req.body.deposit
    if (!userValidation) {
        res.status(400).json({message: 'Invalid user id'})
    } else if (!user) {
        res.status(400).json({message: 'Account does not exit!'})
    } else { 
            if(!amount) {
             res.status(400).json({message: 'Input amount to deposit!'})
         } else {
            const transact = new Transaction({type: `deposit`, amount: req.body.deposit});
            return user.balance += amount,
            user.transactions.push(transact._id),
            res.status(201).json({message: `You've successfully deposited ${amount}`}),
            transact.save(),
            user.save()
         }
    }
    
})

// withdraw api
app.put(`/user/withdraw/:id`, async (req, res) => {
    const userValidation = mongoose.Types.ObjectId.isValid(req.params.id)
    const user = await User.findById(req.params.id)
    const amount = req.body.withdraw
    if (!userValidation) {
        res.status(400).json({message: `Invalid user id`})
    } else if (!user) {
        res.status(400).json({message: `Account does not exit!`})
    } else { 
            if(!amount) {
             res.status(400).json({message: `Input amount to withdraw!`})
         } else if (amount > user.balance) {
             res.status(400).json({message: `Not sufficient fund`})
         } else if (amount > user.withdrawLimit) {
             res.status(400).json({message: `You've reach your daily limit`})
         } else {
            const transact = new Transaction({type: `withdraw`, amount: req.body.withdraw});
            return user.balance -= amount,
            user.transactions.push(transact._id),
            res.status(201).json({message: `You've successfully withdrawn ${amount}`}),
            transact.save(),
            user.save()
         }
    }
})

// Delete an account
app.delete('/user/:id', async (req, res) => {
    const userValidation = mongoose.Types.ObjectId.isValid(req.params.id)
    const user = await User.findById(req.params.id)
    if (!userValidation) {
        res.status(400).json({message: 'Invalid user id'})
    } else if (!user) {
        res.status(400).json({message: 'Account does not exit!'})
    } else {
        const user = await User.findByIdAndDelete(req.params.id)
        res.status(201).json({message: 'User deleted successfully'})
    }
});

// Get all transactions
app.get(`/user/alltransactions/:id`, async (req, res) => {
    const userValidation = mongoose.Types.ObjectId.isValid(req.params.id)
    const user = await User.findById(req.params.id)
    if (!userValidation) {
        res.status(400).json({message: 'Invalid user id'})
    } else if (!user) {
        res.status(400).json({message: 'Account does not exit!'})
    } else {
        const user = await User.findById(req.params.id)
        res.status(201).json(user.transactions)
    }
})

// Get single transaction
app.get(`/transaction/:id`, async (req, res) => {
    const onetransacton = await Transaction.findById(req.params.id)
    const tranValidation =mongoose.Types.ObjectId.isValid(req.params.id)
    if (!onetransacton) {
        res.status(400).json({message: 'Invalid transaction id'})
    } else if (!tranValidation) {
        res.status(400).json({message: 'Transaction does not exit!'})
    } else {
        res.status(201).json(onetransacton)
    }
})

// Server
app.listen(port,() =>{
    console.log(`Server is running on port ${port}`)
})