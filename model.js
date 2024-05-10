const mongoose = require('mongoose')


const TransactionSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    description: {
         type: String,
         required: false
     },
}, {
    timestamps: true
});

const Transaction = mongoose.model('Transaction', TransactionSchema)


const userSchema = new mongoose.Schema({
    accountNumber: {
        type: Number,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        default: 0
    },
    transactions: {
        type: Array,
        default: []
    },
    withdrawLimit: {
        type: Number,
        default: 3000
    },
    deposit: {
        type: Number,
        select: false
    },
    withdraw: {
        type: Number,
        select: false
    }
},
    {
        timestamps: true
    }
);



const User = mongoose.model('User', userSchema);

module.exports = { 
    User,
    Transaction
}