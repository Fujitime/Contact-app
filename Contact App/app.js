const { response } = require('express')
const express = require('express')
const ExpressLayouts = require('express-ejs-layouts')
const { loadContact, FindContact, addContact, checkDuplicate, deleteContact, updateContacts } = require('./utils/contacts')
const { body, validationResult, check } = require('express-validator');
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const app = express()
const port = 3000


app.set('view engine', 'ejs')
app.use(ExpressLayouts)
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
})
app.get('/about',  (req, res) => {
    res.render('about',{
        title : 'about',
        layout: 'layouts/main-layout',
    },
    )
})

// page form add data contact
app.get('/contact/add', (req, res)=>{
    res.render('add-contact',{
        title: "Form add data contact",
        layout: 'layouts/main-layout'
    })
})


//proces add data contact
app.post('/contact',  [
    body('nama').custom((value) => {
    const duplicate = checkDuplicate(value)
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
        addContact(req.body)
        //send flash message
        req.flash('msg', 'data kontak berhasil di tambahkan')
        res.redirect('/contact')
    }

})


app.get('/contact', (req, res) => {
    const contacts = loadContact()
    res.render('contact',{
        title : 'Contact',
        layout: 'layouts/main-layout',
        contacts,
        msg: req.flash('msg')
    })
})

// delete contact
app.get('/contact/delete/:nama', (req, res )=> {
    const contact = FindContact(req.params.nama)
    if(!contact){
        res.status(404)
        res.send('<h1>404</h1>')
    }else{
        deleteContact(req.params.nama)
        req.flash('msg', 'data kontak berhasil di hapus')
        res.redirect('/contact')
    }
})

// form edit contact
app.get('/contact/edit/:nama', (req, res) => {
    const contact = FindContact(req.params.nama)
    res.render('edit-contact',{
        title: "Form edit data contact",
        layout: 'layouts/main-layout',
        contact,
    })
})

// process edit data
app.post('/contact/update',  [
    body('nama').custom((value, {req}) => {
    const duplicate = checkDuplicate(value)
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
        //send flash message
        req.flash('msg', 'data kontak berhasil di ubah')
        res.redirect('/contact')
        updateContacts(req.body)
    }

})

//page detail contact'
app.get('/contact/:nama', (req, res) => {
    const contact = FindContact(req.params.nama)
    res.render('detail',{
        title : 'Detail_Contact',
        layout: 'layouts/main-layout',
        contact,
    })
})

app.use((req, res) =>{
    res.status(404)
    res.send('<h1> 404 </h1>')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})