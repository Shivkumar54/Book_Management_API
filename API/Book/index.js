const Router = require("express").Router();
/* 
Route -       /
Description - get All books 
Access -      PUBLIC
Parameter -   None
Methods -     GET
*/ 
Router.get("/", async (req, res) => {
    const getAllBooks = await BookModel.find();
    return res.json({ getAllBooks });
});


/* 
Route -       /
Description - get Specific books based on ISBN 
Access -      PUBLIC
Parameter -   ISBN
Methods -     GET
*/
Router.get("/is/:isbn", async (req, res) => {
    const getSpecificBook = await BookModel.findOne({ ISBN: req.params.isbn });

    if (!getSpecificBook.length) {
        return res.json({ error: `No book found for the isbn of ${req.params.isbn}`, });
    }

    return res.json({book: getSpecificBook});
});

/* 
Route -       /c
Description - get Specific books based on category 
Access -      PUBLIC
Parameter -   category
Methods -     GET
*/
Router.get("/c/:category", (req, res) => {
    const getSpecificBook = database.books.filter((book) => book.category.includes(req.params.category));
    if (getSpecificBook.length === 0) {
        return res.json({ error: `No book found for the category of ${req.params.category}`, });
    }

    return res.json({book: getSpecificBook});

});

/* 
Route -       /book/add
Description - add new book
Access -      PUBLIC
Parameter -   NONE
Methods -     POST
*/
Router.post("/add", (req, res) => {
    console.log(req.body);
    const { newBook } = req.body;
    database.books.push(newBook);
    return res.json({ books: database.books });
});

/* 
Route -      /book/delete
Description - delete a book
Access -      PUBLIC
Parameter -   isbn
Methods -     DELETE
*/
Router.delete("/delete/:isbn", (req, res) => {
    const updatedBookDatabase = database.books.filter(
        (book) => book.ISBN !== req.params.isbn);
    
    database.books = updatedBookDatabase;
    return res.json({ books: database.books });
});


/* 
Route -      /book/update/title
Description - update book title
Access -      PUBLIC
Parameter -   isbn
Methods -     PUT
*/
Router.put("/update/title/:isbn", (req, res) => {
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            book.title = req.body.newBookTitle;
            return;
        }
    });
    return res.json({ books: database.books });
});

/* 
Route -      /book/update/author
Description - update/ add new author for a book
Access -      PUBLIC
Parameter -   isbn
Methods -     PUT
*/

Router.put("/update/author/:isbn/:authorId", (req, res) => {

    //update book database
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            return book.author.push(parseInt(req.params.authorId));
        }
    });

    //update author database
    database.author.forEach((author) => {
        if (author.id === parseInt(req.params.authorId)) {
            return author.books.push(req.params.isbn);
        }
    });
    return res.json({books: database.books, author: database.author});
});

/* 
Route -      /book/delete/author
Description - delete a author from a book
Access -      PUBLIC
Parameter -   isbn, authorId
Methods -     DELETE
*/
Router.delete("/delete/author/:isbn/:authorId", (req, res) => {

    // update book database
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            const newAuthorList = book.authors.filter(
                (author) => author !== parseInt(req.params.authorId));
            book.authors = newAuthorList;
            return;
        }
    });

    // update author database
    database.authors.forEach((author) => {
        if (author.id === parseInt(req.params.authorId)) {
            const newBooksList = author.books.filter((book) => book != req.params.isbn);

            author.books = newBooksList;
            return;
        }
    });

    res.json({ book: database.books, author: database.authors, message: "AUthor was deleted", });

});

module.exports = Router;