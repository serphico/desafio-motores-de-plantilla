const express = require('express');
const multer = require('multer');

const app = express();

const productosApi = require('./controllers/products')

app.use(express.json());

app.use(express.urlencoded({extended:true}));

app.set('view engine', 'pug');
app.set('views', "./views");

app.use(express.static('uploads'))

app.get('/', (req,res) => {
    let message = "Ver Productos"
    let urlRedirect = "/productos"
    res.render('./layouts/index.pug',{message,urlRedirect})
})

/*-------------------------------------------------*/

const storage = multer.diskStorage({
    destination: function(req, file,cb){
        cb(null,'uploads')
    },
    filename:function(req,file,cb){
        cb(null,`${file.originalname}`)
    }
})
const upload = multer({storage: storage})
/*-------------------------------------------------*/

let finalProd = {};


app.post("/productos",upload.single('thumbnail'),  (req,res,next) => {
    const file = req.file;
    if(!file){
        const error = new Error('please upload a file')
        error.httpStatuscode = 400
        return next(error)
    }
     finalProd = {...req.body,thumbnail: file.filename}
     
     productosApi.save(finalProd);
     res.redirect('/')
})


app.get('/productos',(req, res) =>{
    let message = "Volver al formulario"
    let urlRedirect = "/"
    const data = productosApi.getAll();
    res.render('./layouts/productos',{data,message,urlRedirect});
    
})

/*servidor */

const PORT = 8080;

const server = app.listen(PORT, () => {
    console.log(`servidor http escuchando en el puerto ${server.address().port} `);
});

server.on('error', error => console.log(`Error en servidor ${error}`));

