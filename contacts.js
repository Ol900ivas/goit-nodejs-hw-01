const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");
const { string } = require("yargs");

const contactsPath = path.join(__dirname, "db", "contacts.json");

async function listContacts() {
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
}

async function getContactById(contactId) {
  const stringContactId = String(contactId);
  const allContacts = await listContacts();
  const contact = allContacts.find((item) => item.id === stringContactId);
  return contact || null;
}

async function removeContact(contactId) {
  const stringContactId = String(contactId);
  const allContacts = await listContacts();
  const index = allContacts.findIndex((item) => item.id === stringContactId);
  if (index === -1) {
    return null;
  }
  const [result] = allContacts.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 1));
  return result;
}

async function addContact(name, email, phone) {
  const allContacts = await listContacts();
  const newContact = { id: nanoid(), name, email, phone };
  allContacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2));
  return newContact;
}

const contacts = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};

module.exports = contacts;
