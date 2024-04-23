class Useraccount {
    constructor(accountNumber, firstName, lastName){
        this._accountNumber = accountNumber;
        this._firstName = firstName;
        this._lastName = lastName;
        this._balance = 0;
        this._transaction = [];
        this._withdrawLimit = 3;
        this._counter = 0;   //withdrawal limit counter
    }
    get accountHolder() {
        return `${this._firstName} ${this._lastName}`;
    }

    get balance() {
        return this._balance;
    };

    deposit(amount) {
        this._balance += amount;
        this._transaction.push(new Transaction('deposit', amount));
    };

    withdraw(amount) {
        if (this._balance < amount) {
            this._balance -= 0;
            return `Not sufficient fund`; 
        }
        if (this._counter == this._withdrawLimit){
            return `You've reached your daily limit.`
        }else {
            this._balance -= amount;
            this._transaction.push(new Transaction('withdraw', amount));
            this._counter ++;
        };
    };
    
    get transactions() {
        return this._transaction;
    };

    transfer(amount, user) {
        if (amount > this._balance) {
            return `Not sufficient fund`;
        } if (typeof user !== `object`) {
            return `User does not exist!`;
        } else {
            return this._balance -= amount,
            user.deposit(amount);
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

user1.deposit(1000);

user1.withdraw(150);
console.log(user1.balance);

console.log(user1.transactions);

const user2 = new Useraccount(3364879867, "Johnson", "Goerge")

// Transfer 500 from user1 to user2.

user1.transfer(500, user2)
console.log(user2._balance)
console.log(user2.transactions)