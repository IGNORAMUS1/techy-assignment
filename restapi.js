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
/* e.g;
{
    "accountNumber": 3678299923,
    "firstName": "Atinuke",
    "lastName": "Gbolagade"
}
*/
app.post('/createaccount/', async (req, res) => {
    const user = new User(req.body)
    
    if(user.firstName === "" || !user.firstName) {
        res.status(400).json({message: 'First name is required.'})
    } else if (user.lastName === "" || !user.lastName) {
        res.status(400).json({message: 'Last name is required.'})
    } else {
        user.accountNumber = Math.floor(Math.random() * 9999999999)
        const accountCheck = await User.findOne({accountNumber: user.accountNumber})
        if(accountCheck != null) {
            user.accountNumber = Math.floor(Math.random() * 9999999999)
        } else {
        while(user.accountNumber.toString().length < 10){
            user.accountNumber = Math.floor(Math.random() * 9999999999)
        }
        await user.save()
        res.status(201).json(user)
        }
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
/* e.g;
{
    "firstName": "Bimbo"
}
*/
app.put('/user/:id', async (req, res) => {
    const userValidation = mongoose.Types.ObjectId.isValid(req.params.id)
    const user = await User.findById(req.params.id)
    if (!userValidation) {
        res.status(400).json({message: 'Invalid user id'})
    } else if (!user) {
        res.status(400).json({message: 'Account does not exit!'})
    } else if(req.body.balance != null || req.body.transactions != null){
        res.status(400).json({message: `The specified field is not meant to be updated directly!`})
    } else {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true})
        res.status(201).json(user)
    }
})



// deposit api
/* e.g,
{
    "deposit": 5000
}
*/

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
/* e.g,
{
    "withdraw": 2000
}
*/
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

// Get all transactions id for a specific account
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

// Get single transaction by id
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

// Transfer from one Account to the other
/*
e.g 
{
    "transferAmount": 4000,
    "accountNumber": 3033865487
}
*/
app.put(`/user/Transfer/:id`, async (req, res) => {
    const userValidation = mongoose.Types.ObjectId.isValid(req.params.id)
    const from_user = await User.findById(req.params.id)
    const to_user = await User.findOne({accountNumber: req.body.accountNumber})
    const amount = req.body.transferAmount
    if (!userValidation) {
        res.status(400).json({message: `Invalid user id`})
    } else if (!from_user) {
        res.status(400).json({message: `Sender account does not exit!`})
    } else if(!to_user){
        res.status(400).json({message: `Receiver account does not exit!`})
    } else { 
            if(!amount) {
             res.status(400).json({message: `Input amount to transfer!`})
         } else if (amount > from_user.balance) {
             res.status(400).json({message: `Not sufficient fund`})
         } else if (amount > from_user.withdrawLimit) {
             res.status(400).json({message: `You've reach your daily limit`})
         } else {
            const transfer = new Transaction({type: `Tranfer`, amount: req.body.transferAmount});
            const receive = new Transaction({type: "Receive", amount: req.body.transferAmount});
            return from_user.balance -= amount,
            from_user.transactions.push(transfer._id),
            to_user.balance += amount,
            to_user.transactions.push(receive._id),
            res.status(201).json({message: `You've successfully transfered ${amount} to ${to_user.firstName} ${to_user.lastName}`}),
            transfer.save(),
            receive.save(),
            from_user.save(),
            to_user.save()
         }
    }

})

// Server
app.listen(port,() =>{
    console.log(`Server is running on port ${port}`)
})