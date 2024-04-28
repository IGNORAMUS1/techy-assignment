class Useraccount {
    constructor(accountNumber, firstName, lastName){
        this._accountNumber = accountNumber;
        this._firstName = firstName;
        this._lastName = lastName;
        this._balance = 0;
        this._transaction = [];
        this._withdrawLimit = 3000;
        this._totalWithdraw = 0;
    }
    get accountHolder() {
        return `${this._firstName} ${this._lastName}`;
    }

    get balance() {
        return this._balance;
    };

    // allow user to change their daily limit
    set changeLimit (amount) {
        this._withdrawLimit = amount;
    }

    // Deposite function

    deposit(amount) {
        this._balance += amount;
        this._transaction.push(new Transaction('deposit', amount));
    };

    // transfer receiver

    set receive(amount) {
        this._balance += amount;
        this._transaction.push(new Transaction('receive', amount));
    }

    // Withdraw function

    withdraw(amount) {
        if (this._balance < amount) {
            this._balance -= 0;
            console.log(`Not sufficient fund`); 
        } else if (amount > this._withdrawLimit) {
            console.log(`This amount have exceeded your limit!`)
        } else if (this._totalWithdraw == this._withdrawLimit){
            console.log(`You've reached your daily limit.`)
        } else {
            this._balance -= amount;
            this._transaction.push(new Transaction('withdraw', amount));
            return this._totalWithdraw += amount;
        };
    };
    
    // get transactions function
    get transactions() {
        return this._transaction;
    };

    // transfer function
    transfer(amount, user) {
        if (amount > this._balance) {
            console.log(`Not sufficient fund`);
        } else if (typeof user !== `object`) {
            console.log(`User does not exist!`);
        } else if (amount > this._withdrawLimit) {
            console.log(`This amount have exceeded your limit!`);
        } else if(this._totalWithdraw == this._withdrawLimit) {
            console.log(`You've reached your daily limit.`)
        } else {
            return this._balance -= amount,
            this._transaction.push(new Transaction('Transfer', amount)),
            user.receive = amount,
            this._totalWithdraw += amount;
        }
    }
 
}

class Transaction {
    constructor(type, amount) {
        this._type = type;
        this._amount = amount;
        this._date = new Date();
    };

    get type() {
        return this._type;
    };

    get amount() {
        return this._amount;
    };

    get date() {
        return this._date.toString;
    };
}



const user1 = new Useraccount(3588495039, 'John', 'Doe');

// console.log(user1.accountHolder);
// console.log(user1.balance);

user1.deposit(4000);

// user1.withdraw(150);
// console.log(user1.balance);

// console.log(user1.transactions);

const user2 = new Useraccount(3364879867, "Johnson", "Goerge")

// Transfer from user1 to user2.

user1.transfer(1500, user2);
user1.transfer(1500, user2);
//user1.transfer(4000, user2) // this line will console 'This amount have exceeded your limit'.
console.log(user2._balance);
user1.transfer(500, user2); // this line will console 'You've reached your daily limit.
console.log(user2.transactions);
console.log(user1.transactions);