const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;

var app = express();

//nodemon app.js -e js,hbs
hbs.registerPartials(__dirname+'/views/partials');
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});
hbs.registerHelper('screamIt', (text)=>{
    return text.toUpperCase();
});

app.set('view engine', 'hbs');
//middleware 
app.use((req, res, next)=>{
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if(err)
        {
            console.log('Unable to append to server.log.');
        }
    });
    next();
});
// para mantenimiento del servidor!!!
// app.use((req, res, next) => {
//     res.render('maintenance.hbs', {
//         pageTitle: 'Maitenance'
//     });
// });

// paginas html estáticas que se mandan al servidor en un directorio
// de esta manera no hay necesidad de usar app.get() y escribir el codido
// html por cada página...
app.use(express.static(`${__dirname}/public`));

app.get('/', (req, res) =>{
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: 'Welcome to my page. Is created with the best HTML5 knowledge, and in the server I am using NodeJS and Express, which is fantastic!'
    });
});

app.get('/about', (req, res) => {
    res.render('about.hbs',{
        pageTitle: 'About Page',
    });
});

app.get('/bad', (req, res) => {
    res.send({
        errorMessage: 'Unable to fulfill the request'
    });
});

app.listen(port, () =>{
    console.log(`Server is up on port ${port}`);
});