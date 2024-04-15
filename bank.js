class Useraccount {
    constructor(accountNumber, firstName, lastName){
        this._accountNumber = accountNumber;
        this._firstName = firstName;
        this._lastName = lastName;
        this._balance = 0;
        this._transaction = [];   
    }
    get accountHolder() {
        return `${this._firstName} ${this._lastName}`;
    }

    get balance() {
        return this._balance;
    };

    set deposit(amount) {
        this._balance += amount;
        this._transaction.push(new Transaction('deposit', amount));
    };

    set withdraw(amount) {
            if (this._balance < amount) {
                this._balance -= 0;
            } else {
                this._balance -= amount;
                this._transaction.push(new Transaction('withdraw', amount));
            }
    };
    
    get transactions() {
        return this._transaction;
    };
    
}

class Transaction {
    constructor(type, amount) {
        this._type = type;
        this._amount = amount;
        this._date = new Date();
    };

    get type() {
        return this._type;
    }

    get amount() {
        return this._amount;
    }

    get date() {
        return this._date.toString;
    }
}



const user1 = new Useraccount(3588495039, 'John', 'Doe');

// console.log(user1.accountHolder);
// console.log(user1.balance);

// user1.deposit = 100;
// console.log(user1.balance);

// user1.withdraw = 150;
// console.log(user1.balance);

// console.log(user1.transactions);

const user2 = new Useraccount(3364879867, "Johnson", "Goerge")
console.log(user2.transactions)