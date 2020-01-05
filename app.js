const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
// const orderRoutes = require('./api/routes/orders');

mongoose.connect('mongodb+srv://Pragati:' + process.env.MONGO_ATLAS_PW + '@shop-rest-api-eexlz.mongodb.net/test?retryWrites=true&w=majority', 
{
				useNewUrlParser: true,
				useUnifiedTopology: true
}
);

mongoose.connection.once("open", () => {
	console.log("Connected to MongoDB");
}).on("error", (err) => {
	console.error(`Error connecting to MongoDB: ${err}`);
})


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/products',productRoutes);

/*
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');//not send the res just adjusts it //adding headers
    res.header(
        'Access-Control-Allow-Header',
        'Origin, X-Requested-With, Content-Type, Accept,Authorization'
    );
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});    
    }
});
*/


//app.use('/orders',orderRoutes);

app.use((req,res,next)=>{
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;
