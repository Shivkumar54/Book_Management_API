let books = [{
    ISBN: "12345Book",
    title: "50 days to learn Full Stack",
    pubDate: "2021-07-07",
    language: "en",
    numPage: 250,
    authors: [1, 2],
    publication:[1],
    category:["tech", "programing", "education", "thriller"],
},
];
const authors = [
    {
        id: 1,
        name: "Kumar",
        books:["12345Book", "123456NewOne"],
    },
    {
        id: 2,
        name: "Pavan",
        books:["12345Book"],
    }
];
const publications = [
    {
        id: 1,
        name: "writex",
        books:["12345Book"],
    },
    {
        id: 2,
        name: "Jeeveth Publication",
        books:[],
    },
];

module.exports = { books, authors, publications };
