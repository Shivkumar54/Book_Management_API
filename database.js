const books = [{
    ISBN: "12345Book",
    title: "50 days to learn Full Stack",
    pubDate: "2021-07-07",
    language: "en",
    numPage: 250,
    author: [1, 2],
    publication:[1],
    category:["tech", "programing", "education", "thriller"],
},
];
const author = [
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
const publication = [
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

module.exports = { books, author, publication };
