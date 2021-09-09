const express = require("express");

const database = require("./database");
// Initialization
const booky = express();

// configuration
booky.use(express.json());

/* 
Route -       /
Description - get All books 
Access -      PUBLIC
Parameter -   None
Methods -     GET
*/ 
booky.get("/", (req, res) => {
    return res.json({ books: database.books });
});


/* 
Route -       /
Description - get Specific books based on ISBN 
Access -      PUBLIC
Parameter -   ISBN
Methods -     GET
*/
booky.get("/is/:isbn", (req, res) => {
    const getSpecificBook = database.books.filter((book) => book.ISBN === req.params.isbn);

    if (getSpecificBook.length === 0) {
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
booky.get("/c/:category", (req, res) => {
    const getSpecificBook = database.books.filter((book) => book.category.includes(req.params.category));
    if (getSpecificBook.length === 0) {
        return res.json({ error: `No book found for the category of ${req.params.category}`, });
    }

    return res.json({book: getSpecificBook});

});

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
Route -       /book/add
Description - add new book
Access -      PUBLIC
Parameter -   NONE
Methods -     POST
*/
booky.post("/book/add", (req, res) => {
    console.log(req.body);
    const { newBook } = req.body;
    database.books.push(newBook);
    return res.json({ books: database.books });
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
Route -      /book/update/title
Description - update book title
Access -      PUBLIC
Parameter -   isbn
Methods -     PUT
*/
booky.put("/book/update/title/:isbn", (req, res) => {
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

booky.put("/book/update/author/:isbn/:authorId", (req, res) => {

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
Route -      /book/delete
Description - delete a book
Access -      PUBLIC
Parameter -   isbn
Methods -     DELETE
*/
booky.delete("/book/delete/:isbn", (req, res) => {
    const updatedBookDatabase = database.books.filter(
        (book) => book.ISBN !== req.params.isbn);
    
    database.books = updatedBookDatabase;
    return res.json({ books: database.books });
});

/* 
Route -      /book/delete/author
Description - delete a author from a book
Access -      PUBLIC
Parameter -   isbn, authorId
Methods -     DELETE
*/
booky.delete("/book/delete/author/:isbn/:authorId", (req, res) => {

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

// HTTP client to handle other request