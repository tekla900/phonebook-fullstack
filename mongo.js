const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>');
    process.exit(1);
} 

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.jsfdfqg.mongodb.net/?retryWrites=true&w=majority`
mongoose.connect(url)
console.log('connected')

const personSchema = new mongoose.Schema({
    name: String,
    number: Number,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length == 3) {
    Person.find({}).then(result => {
        result.forEach(person => {
          console.log(person)
        })
        mongoose.connection.close()
    })
} else {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    })

    person
        .save()
        .then(() => {
            console.log(`added ${name} number ${number} to phonebook`)
            return mongoose.connection.close()
        })
        .catch((err) => console.log(err))
}