require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const database = require("./database");

// models
const BookModel = require("./book");
const AuthorModel = require("./author")
const PublicationModels = require("./publication")


// initiationalizing micro services routes

const Books = require("./API/Book");

// Initialization
const booky = express();

// configuration
booky.use(express.json());
// establish database connection
mongoose.connect(process.env.MONGO_URL
).then(() => console.log("Established Database Connection"));


// Microservices initialize
booky.use("book", Books);

/* 
Route -       /author
Description - get all author
Access -      PUBLIC
Parameter -   None
Methods -     GET
*/
booky.get("/author", (req, res) => {
    return res.json({ authors: database.author });
});

/* 
Route -       /author/book
Description - get all author based on books
Access -      PUBLIC
Parameter -   ISBN
Methods -     GET
*/
booky.get("/author/book/:isbn", (req, res) => {
    const getSpecificAuthor = database.author.filter((author) => author.books.includes(req.params.isbn));
    if (getSpecificAuthor.length === 0) {
        return res.json({ error: `No Author found for the book of ${req.params.isbn}`, });
    }

    return res.json({authors: getSpecificAuthor});
})

/* 
Route -       /publication
Description - get all publication
Access -      PUBLIC
Parameter -   NONE
Methods -     GET
*/
booky.get("/publications", (req, res) => {
    return res.json({ publications: database.publication })
});




/* 
Route -       /author/add
Description - add new author
Access -      PUBLIC
Parameter -   NONE
Methods -     POST
*/
booky.post("/author/add", (req, res) => {
    console.log(req.body);
    const { newAuthor } = req.body;
    database.author.push(newAuthor);
    return res.json({ authors: database.author });
});



/* 
Route -      /publication/update/book
Description - update/ add new book to publication
Access -      PUBLIC
Parameter -   isbn
Methods -     PUT
*/
booky.put("/publication/update/book/:isbn", (req, res) => {
    // update the publication database
    database.publications.forEach((publication) => {
        if (publication.id === req.body.pubId) {
            return publication.books.push(req.params.isbn);
        }
    });

    // update the book database
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            book.publication = req.body.pubId;
            return;
        }
    });
    return res.json({
        books: database.books, publications: database.publications,
        message: "Updated Publications Successfully",
    });
});






/* 
Route -      /publication/delete/book
Description - delete a book from a publication
Access -      PUBLIC
Parameter -   isbn, publication id
Methods -     DELETE
*/
booky.delete("/publication/delete/book/:isbn/:pubId", (req, res) => {
    database.publications.forEach((publication) => {
        if (publication.id === parseInt(req.params.pubId)) {
            const newBookList = publication.books.filter(
                (book) => book !== req.params.isbn
            );
            publication.books = newBookList;
            return;
        }
    });
    // update book database
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            book.publication = 0;
            return;
        }
    });

    return res.json({ books: database.books, publications: database.publications, });
    
});


booky.listen(3000, () => console.log("hey server is running"));

