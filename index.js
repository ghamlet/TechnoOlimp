let express = require(`express`);
let app = express();
let port = 3003;
app.listen(port, function () {
    console.log(`http://localhost:${port}`);
});
app.use(express.static(`public`));
app.use(express.urlencoded({ extended: true }))
let mongoose = require(`mongoose`);
mongoose.connect('mongodb://127.0.0.1:27017/Maket_cat');
app.use(express.urlencoded({ extended: true }))
const hbs = require('hbs'); // подключение
app.set('views','views');//в какой папке находится
app.set('view engine','hbs');//название шаблонизатора
let dronSchema = new mongoose.Schema({//cхема документа коллекции базы данных
        x:Number,
        y:Number,
        model:String,
        charge:Number,
        chargekm:Number,
        free:Boolean,
        archive:Boolean,
        akk:Number,
        speed:Number,
        Xind:Number,
        Yind:Number,
        Xoutd:Number,
        Youtd:Number,
        userid:String,
        distance:Number,
        time:Number,
        updatedAt:Date,
        description:String,
        cost:Number,
            costz:Number
        }, { 
            timestamps: true 
        });
        
        let Dron = mongoose.model('drons', dronSchema);//сохранение схеммы

        let userSchema = new mongoose.Schema({
            Xin:Number,
            Yin:Number,
            Xout:Number,
            Yout:Number,
            ide:String,
            archive:Boolean,
            firstName:String,
            lastName:String,
            tel:Number,
            time:Number,
            updatedAt:Date,
            number:String,
            
            
            }, { 
                timestamps: true 
            });
            
            let User = mongoose.model('users', userSchema);

        app.get(`/`, async function (req, res) {
            let uid = true;
            let drons = await Dron.find({archive:false})
            .sort({updatedAt:-1});
        try {
            res.render('index', {
                ide:Math.floor(Math.random() * (100000000000000000000000000 - 10000000000000000000000000) + 10000000000000000000000000),
                input:uid,
                drons: drons,
                main:true,
                variant:false,
                admin_view:true,
                oform:true
            });
         } catch (err) {
            // План Б (что-то пошло не так)
            res.send('error!');
        }
    });
    

        app.get(`/dron_view`, async function (req, res) {
            let drons = await Dron.find({archive:false})
            .sort({updatedAt:-1});
        try {
            res.render('index', {
                drons: drons,
                admin:true,
                admin_view:true
            });
         } catch (err) {
            // План Б (что-то пошло не так)
            res.send('error!');
        }
    });

    app.get(`/user_view`, async function (req, res) {
        let users = await User.find({archive:false}).sort({updatedAt:-1});
    try {
        res.render('index', {
            users: users,
            user:true,
            admin:false,
            admin_view:true
        });
     } catch (err) {
        // План Б (что-то пошло не так)
        res.send('error!');
    }
});

    app.get(`/dron_show`, async function (req, res) {
        let id = req.query.id;
        let show = await Dron.findOne({_id:id});
        let drons = await Dron.find({archive:false})
        .sort({updatedAt:-1});
    try {
        res.render('index', {
            drons: drons,
            admin: true,
            show: show,
            admin_view:true
        });
     } catch (err) {
        // План Б (что-то пошло не так)
        res.send('error!');
    }
});

app.get(`/dron_add`, async function (req, res) {
    let drons = await Dron.find({archive:false})
    .sort({updatedAt:-1});
try {
    res.render('index', {
        drons: drons,
        admin: true,
        add: true,
        admin_view:true
    });
 } catch (err) {
    // План Б (что-то пошло не так)
    res.send('error!');
}
});


app.get(`/users_add`, async function (req, res) {
    let ide = req.query.id;
    let uid = false
     //console.log(ide);
     let useru = await User.findOne({ide:ide,archive:false});
     //console.log(useru);
    let drond = await Dron.find({free:true,archive:false}).sort({updatedAt:-1});
    for(let i = 0;i<drond.length;i++){
        if(Number(drond[i].chargekm)<((Number(drond[i].distance)+4)*1.1)){
            drond[i].userid = ``;
            drond[i].distance = 0;
            drond[i].time = 0;
            try {
                await drond[i].save();
             } catch (err) {
                // План Б (что-то пошло не так)
                res.send('Ошибка создания');
            }
        }
    };

try {
    let drons = await Dron.find({free:true,archive:false, time:{$lte:useru.time,$gt:0}})
    .sort({time:-1}).limit(5);
    if(drons.length<5){drons = await Dron.find({free:true, time:{$gt:0},archive:false})
    .sort({time:1}).limit(5);}

    res.render('index', {
        input:uid,
        drons: drons,
        main:true,
        variant:true,
        admin_view:true,
        oform:true
    });
    ide = ``;
 } catch (err) {
    // План Б (что-то пошло не так)
    res.send('error!');
}
});



app.post(`/users_add`, async function (req, res) {
    let {lastName,firstName} = req.body;
let ide = req.query.ide;
    let Xin = Number(req.body.Xin);
    let Yin = Number(req.body.Yin);
    let Xout = Number(req.body.Xout);
    let Yout = Number(req.body.Yout);
    let tel = Number(req.body.tel);
    let time = Number(req.body.time);
    let distanceM = Math.ceil(Math.sqrt((((Xin-Xout)*110)**2)+(((Yin-Yout)*111)**2)));
    
    

    console.log(`23  `,ide );
    let user = new User({
        archive:false,
        ide:ide,
        Xin:Xin,
        Yin:Yin,
        Xout:Xout,
        Yout:Yout,
        tel:tel,
        firstName:firstName,
        lastName:lastName,
        time:time
});
try {
    await user.save();
 } catch (err) {
    // План Б (что-то пошло не так)
    res.send('Ошибка создания');
}
let useid = await User.findOne({tel:tel});
if (ide == `undefined`){useid.ide = useid.id;
ide = useid.id;};
console.log(useid)
try {
    await useid.save();
 } catch (err) {
    // План Б (что-то пошло не так)
    res.send('Ошибка создания');
}

let drons = await Dron.find({free:true,archive:false});
for(let i = 0;i<drons.length;i++){
    let distance = distanceM + Math.ceil(Math.sqrt((((Xin-drons[i].x)*110)**2)+(((Yin-drons[i].y)*111)**2)));
    
    drons[i].distance = distance;
    drons[i].costz = distance * Number(drons[i].cost);


drons[i].time = Math.ceil(Number(drons[i].distance)/((Number(drons[i].speed)/60)));

    try {

        await drons[i].save();
        
     } catch (err) {
        // План Б (что-то пошло не так)
        res.send('Ошибка создания1');
    }
};


res.redirect(`/users_add?id=${ide}`);
});


app.get(`/user_show`, async function (req, res) {
    let id = req.query.id;
    let show_user = await User.findOne({_id:id});
    let users = await User.find({archive:false}).sort({updatedAt:-1});
try {
    res.render('index', {
        users: users,
        user:true,
        show_user: show_user,
        admin_view:true
    });
 } catch (err) {
    // План Б (что-то пошло не так)
    res.send('error!');
}
});


app.get(`/dron_remove`, async function (req, res) {
    let id = req.query.id;
let dron =await Dron.findOne({_id:id});
if(dron.archive == true){
dron.archive = false;
dron.description = ``;} else {
    dron.archive = true;
}

try {
    await dron.save();
    res.redirect('back');

 } catch (err) {
    // План Б (что-то пошло не так)
    res.send('Ошибка архивации');
}
});

app.get(`/user_remove`, async function (req, res) {
    let id = req.query.id;
let user = await User.findOne({_id:id});
if(user.archive == true){
    user.archive = false;} else {
        user.archive = true;
    }
try {
    await user.save();
    res.redirect('back');
 } catch (err) {
    // План Б (что-то пошло не так)
    res.send('Ошибка архивации');
}
});

app.post(`/dron_add`, async function (req, res) {
    let id = req.query.id;
    let {x,y,model,charge,free,akk,speed} = req.body;
    let cost = Number(req.body.cost);
    if (free == `on`){
        free = true;
    } else {
        free = false;
    }
    let dron = new Dron({
        chargekm: Math.floor(Number(charge)/100*Number(akk)),
        time:0,
        x:x,
        y:y,
        archive:false,
        model:model,
        charge:charge,
        free:free,
        akk:akk,
        speed:speed,
        description:``,
        cost:cost,
});



try {
    await dron.save();
    res.redirect('back');
 } catch (err) {
    // План Б (что-то пошло не так)
    res.send('Ошибка создания');
}
});

app.get(`/dron_oform`, async function (req, res) {
    let drons = await Dron.find()
    .sort({free:-1});
try {
    res.render('index', {
        admin_view:true,
        drons: drons,
        oform: true,
        add: true
    });
 } catch (err) {
    // План Б (что-то пошло не так)
    res.send('error!');
}
});

app.get(`/contact`, async function (req, res) {
    let drons = await Dron.find()
    .sort({free:-1});
try {
    res.render('index', {
        contact:true,
        admin_view:true
    });
 } catch (err) {
    // План Б (что-то пошло не так)
    res.send('error!');
}
});

app.post(`/dron_edit`, async function (req, res) {
    let id = req.query.id;
    let {x,y,charge,free} = req.body;
    let dron = await Dron.findOne({_id:id});
    dron.chargekm = Math.floor(Number(charge)/100*Number(dron.akk));
    dron.x = Number(x);
    dron.y = Number(y);
    dron.charge = Number(charge);
    dron.free = free;
    console.log(x,y,charge,free)
    try {
        if(userId = id){
        res.send(Xind, Yind, Xoutd, Youtd);
        }
     } catch (err) {
        res.send('error!');
    }
});

app.get(`/dron_avalible`, async function (req, res) {
    let id = req.query.id;
    let drons = await Dron.find();
    for(let i = 0;i<drons.length;i++){
        if(drons[i].id!=id){
            drons[i].userid = ``;
            drons[i].distance = 0;
            drons[i].time = 0;
            try {
                await drons[i].save();
             } catch (err) {
                // План Б (что-то пошло не так)
                res.send('Ошибка создания');
            }
        }
    };
    let dron = await Dron.findOne({_id:id});
    dron.free = false;
    await dron.save();
try {
    res.render('index', {
        admin_view:true,
        dronm: dron,
    });
 } catch (err) {
    // План Б (что-то пошло не так)
    res.send('error!');
}
});

app.get(`/dron_success`, async function (req, res) {
    let id = req.query.id;
    let dron = await Dron.findOne({_id:id});
    dron.free = true;
    dron.userid = ``;
    dron.distance = 0;
    dron.time = 0;
try {
    await dron.save();
    res.render('index', {
        admin_view:true,
        thank: true,
    });
 } catch (err) {
    // План Б (что-то пошло не так)
    res.send('error!');
}
});


app.get(`/dron_view_archive`, async function (req, res) {
    let drons = await Dron.find({archive:true})
    .sort({updatedAt:-1});
try {
    res.render('index', {
        drons: drons,
        admin_archive:true,
        admin_view:true
    });
 } catch (err) {
    // План Б (что-то пошло не так)
    res.send('error!');
}
});

app.get(`/user_view_archive`, async function (req, res) {
let users = await User.find({archive:true}).sort({updatedAt:-1});
try {
res.render('index', {
    users: users,
    user_archive:true,
    admin:false,
    admin_view:true
});
} catch (err) {
// План Б (что-то пошло не так)
res.send('error!');
}
});

app.get(`/dron_show_archive`, async function (req, res) {
let id = req.query.id;
let show = await Dron.findOne({_id:id});
let drons = await Dron.find({archive:true})
.sort({updatedAt:-1});
try {
res.render('index', {
    drons: drons,
    admin_archive: true,
    show_archive: true,
    show: show,
    admin_view:true
});
} catch (err) {
// План Б (что-то пошло не так)
res.send('error!');
}
});

app.get(`/user_show_archive`, async function (req, res) {
    let id = req.query.id;
    let show_user = await User.findOne({_id:id});
    let users = await User.find({archive:true}).sort({updatedAt:-1});
try {
    res.render('index', {
        users: users,
        user_archive:true,
        show_user_archive:true,
        show_user: show_user,
        admin_view:true
    });
 } catch (err) {
    // План Б (что-то пошло не так)
    res.send('error!');
}
});

app.post(`/dron_util`, async function (req, res) {
    let id = req.query.id;
    let description = req.body.description;
let dron =await Dron.findOne({_id:id});
dron.description = description;
try{
await dron.save();
res.redirect(`back`);
} catch (err){
    res.send(`ошибка добавления описания`);
}

});