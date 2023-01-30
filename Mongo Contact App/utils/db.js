const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/wpu', {
    useNewUrlParser: true,
    useUnifiedTopology : true,
    useCreateIndex: true
})



// // menambah satu data
// const contact1 = new Contact({
//     nama: 'Walter Nicho',
//     hp: '087897527344',
//     email: 'ecaun1601@gmail.com',
// })

// // simpan ke collection
// contact1.save().then((contact) => console.log(contact))