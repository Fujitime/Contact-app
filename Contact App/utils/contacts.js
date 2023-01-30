const { deepStrictEqual } = require('assert')
const fs = require('fs')

const dirPath = './data'
if(!fs.existsSync(dirPath)){
fs.mkdirSync(dirPath)
}

// Create file contacts.json if not exist
const dataPath = './data/contacts.json'
if(!fs.existsSync(dataPath)){
    fs.writeFileSync(dataPath, '[]', 'utf-8')
}

const loadContact = () => {
    const fileBuffer = fs.readFileSync('data/contacts.json', 'utf-8')
    const contacts = JSON.parse(fileBuffer)
    return contacts
}

// find contact based on name
const FindContact = (nama) =>{
    
const contacts = loadContact()
const contact = contacts.find(
    (contact) => contact.nama.toLowerCase() === nama.toLowerCase())
    return contact
}

// replace file contacts.json with new data
const saveContacts = (contacts) => {
    fs.writeFileSync('data/contacts.json', JSON.stringify(contacts))
}
// add new data
const addContact = (contact)=> {
    const contacts = loadContact() //loadContacs
    contacts.push(contact)
    saveContacts(contacts)
}

// check duplicate name
const checkDuplicate = (nama)=>{
    const contacts = loadContact()
    return contacts.find((contact)=> contact.nama === nama)
}

//delete contact
const deleteContact = (nama) => {
    const contacts = loadContact()
    const filteredContacts = contacts.filter((contact) => contact.nama !== nama)
    saveContacts(filteredContacts)
}   

// update contact
const updateContacts = (contactBaru) =>{
    const contacts = loadContact()
    //delete contact oldName
    const filteredContacts = contacts.filter((contact) => contact.nama !== contactBaru.oldNama)
    delete contactBaru.oldNama
    filteredContacts.push(contactBaru)
    saveContacts(filteredContacts)
}
module.exports = {loadContact, FindContact, addContact, checkDuplicate, deleteContact, updateContacts }