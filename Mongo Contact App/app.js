const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const { body, validationResult, check } = require('express-validator');
const methodOverride = require('method-override')

const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')

require('./utils/db')
const Contact = require('./model/contact')

const app = express()
const port = 3000

//setup method override
app.use(methodOverride('_method'))

// setup ejs
app.set('view engine', 'ejs')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))


//configiration flash
app.use(cookieParser('session'));
app.use(session({
    cookie : {maxAge : 6000},
    secret : 'secret',
    resave : true,
    saveUninitialized : true
}));

app.use(flash());


// halaman home
app.get('/', (req, res) => {
    const mahasiswa = [
        {
            nama : 'Fuji Halim Rabbani',
            email : 'racun1601@gmail.com',
        },
        {
            nama : 'Walter Niholas',
            email : 'WalterEz12345@gmail.com',
        },
    ]
    res.render('index', {
        nama : 'Fuji',
        title : 'Home',
        mahasiswa,
        layout: 'layouts/main-layout'
})
    console.log('ini halaman home')
})

//  halaman about
app.get('/about',  (req, res) => {
    res.render('about',{
        title : 'about',
        layout: 'layouts/main-layout',
    },
    )
})

//halaman contact
app.get('/contact', async (req, res) => {

    const contacts = await Contact.find()
    res.render('contact',{
        title : 'Contact',
        layout: 'layouts/main-layout',
        contacts,
        msg: req.flash('msg')
    })
})

// page form add data contact
app.get('/contact/add', (req, res) => {
    res.render('add-contact',{
        title: "Form add data contact",
        layout: 'layouts/main-layout'
    })
})


//proces add data contact
app.post('/contact',  [
    body('nama').custom(async (value) => {
    const duplicate = await Contact.findOne({nama : value})
    if(duplicate){
        throw new error(('Kontak Sudah terdaftar'))
    }
        return true
    }),
check('email', 'Email Tidak Valid').isEmail(),
check('hp', 'No Handphone is not valid').isMobilePhone('id-ID'),
    ],
(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.render('add-contact',{
            title: 'form add data contact',
            layout: 'layouts/main-layout',
            errors: errors.array()
        })
    } else  {
        Contact.insertMany(req.body, (error, result) => {
            //send flash message
            req.flash('msg', 'data kontak berhasil di tambahkan')
            res.redirect('/contact')
        })
    }

})
// // delete contact
app.delete('/contact', (req, res) => {
    Contact.deleteOne({ nama : req.body.nama }).then((result) => {
        req.flash('msg', 'data kontak berhasil di hapus')
        res.redirect('/contact')
        })
})

// form edit contact
app.get('/contact/edit/:nama', async (req, res) => {
    const contact = await Contact.findOne({ nama: req.params.nama})
    res.render('edit-contact',{
        title: "Form edit data contact",
        layout: 'layouts/main-layout',
        contact,
    })
})


// process edit data
app.put('/contact',  [
    body('nama').custom(async (value, {req}) => {
    const duplicate = await Contact.findOne({ nama: value})
    if(value !== req.body.oldNama && duplicate){
        throw new error(('Nama kontak sudah digunakan'))
    }
        return true
    }),
check('email', 'Email Tidak Valid').isEmail(),
check('hp', 'No Handphone is not valid').isMobilePhone('id-ID'),
    ],
(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.render('edit-contact',{
            title: 'form edit data contact',
            layout: 'layouts/main-layout',
            errors: errors.array(),
            contact: req.body
        })
    } else  {
        Contact.updateOne(
        {_id: req.body._id }, 
        {
        $set : {
            nama : req.body.nama,
            email : req.body.email,
            hp: req.body.hp,
        }
    }).then((result) => {
        //send flash message
        req.flash('msg', 'data kontak berhasil di ubah')
        res.redirect('/contact')
    })
    }
})


//page detail contact
app.get('/contact/:nama', async (req, res) => {
    const contact = await Contact.findOne( {nama: req.params.nama})
    res.render('detail',{
        title : 'Detail_Contact',
        layout: 'layouts/main-layout',
        contact,
    })
})

app.listen(port, () => {
    console.log(`Mongo Contact App | listening a http://localhost:${port}`)
})

