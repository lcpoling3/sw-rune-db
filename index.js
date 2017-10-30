var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var exphbs = require('express-handlebars');
//var dataUtil = require("./data-util");
var _ = require('underscore');
var mongoose = require('mongoose');
var dotenv = require('dotenv');

var app = express();

dotenv.load();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use('/public', express.static('public'));



console.log(process.env.MONGODB);
mongoose.connect(process.env.MONGODB);

mongoose.connection.on('error', function(){
	console.log("and u fail");
	process.exit(1);
})

/*
    These are the lists of valid rune types and stats.
    Bogus input (i.e. not in these lists) will be added for now
    but the input won't show up in the search by fields.

    Eventually will implement system to not allow submission for
    fake input

	This monster list is incomplete since there are like >500 monsters in
	this game and I didn't want to type all of that out by hand.
*/
/* var monList = {

	'Galleon': {
		element: 'Water',
		family: 'Pirate Captain'
	},
	'Rakan': {
		element: 'Fire',
		family: 'Chimera'
	},
	'Seara': {
		element: 'Wind',
		family: 'Oracle'
	},
} */

var runeList = [

    'Energy',
    'Fatal',
    'Blade',
    'Swift',
    'Focus',
    'Guard',
    'Endure',
    'Shield',
    'Revenge',
    'Will',
    'Nemesis',
    'Vampire',
    'Destroy',
    'Despair',
    'Violent',
    'Rage',
    'Fight',
    'Determination',
    'Enhance',
    'Accuracy',
    'Tolerance',
];

var statList = [

    'SPD',
    'ATK',
    'FlATK',
    'HP',
    'FlHP',
    'DEF',
    'FlDEF',
    'CD',
    'CDMG',
    'CRITDAMAGE',
    'CR',
    'CRATE',
    'CRITRATE',
    'ACC',
    'RES'
]

var Rec = require('./models/Recommendation');

app.get('/', function(req, res){

    Rec.find({}, function(err, recs){
    	if (err) throw err;
        var r = recs.reverse();
    	res.render('home', {recs: r});
    })

});

app.get('/api/getRecommendations', function(req, res){

    Rec.find({}, function(err, recs){
    	if (err) throw err;
    	res.send(recs);
    })
});

app.get('/api/getRecommendations/:monster', function(req, res){
	
	var m = req.params.monster;
    Rec.find({monster: m}, function(err, recs){
    	if (err) throw err;
    	res.send(recs);
    })
});

app.post('/api/recommendations', function(req, res) {


	//console.log(req.body);
	//touch up monster names
	var monster = req.body.monster;

	monster = monster.charAt(0).toUpperCase() + monster.substring(1, monster.length).toLowerCase();
    
    //create sets array

    var sets = [];
    var set = req.body.set1.charAt(0).toUpperCase() + req.body.set1.substring(1, req.body.set1.length).toLowerCase();
    sets.push(set);
    set = req.body.set2.charAt(0).toUpperCase() + req.body.set2.substring(1, req.body.set2.length).toLowerCase();
    sets.push(set);
    if (req.body.set3 != ''){
    	set = req.body.set3.charAt(0).toUpperCase() + req.body.set3.substring(1, req.body.set3.length).toLowerCase();
    	sets.push(set);
    } else{
    	sets.push('');
    }

    //create stats array

    var stats = [];

    var stat;
    var spl = req.body.slot2.split(/[\s,]+/);
    for (var i in spl){
    	if (statList.includes(spl[i].toUpperCase())){
    		spl[i] = spl[i].toUpperCase();
    	}
    }

    stat = spl.join(' ');


    stats.push(stat);

    spl = req.body.slot4.split(/[\s,]+/);
    for (var i in spl){
    	if (statList.includes(spl[i].toUpperCase())){
    		spl[i] = spl[i].toUpperCase();
    	}
    }

    stat = spl.join(' ');

    stats.push(stat);

    spl = req.body.slot6.split(/[\s,]+/);
    for (var i in spl){
    	if (statList.includes(spl[i].toUpperCase())){
    		spl[i] = spl[i].toUpperCase();
    	}
    }

    stat = spl.join(' ');

    stats.push(stat);

    var rec = new Rec({
   		monster: monster,
   		sets: sets,
   		stats: stats,
   		rating: parseInt(req.body.rating),
   		description: req.body.description
   	});

    rec.save(function(err){
    	if (err) throw err;
    	return res.render('recform', {saved: true});
    });

});

app.get('/newrecommendation', function(req, res){
	res.render('recform');
});

app.get('/monsters', function(req, res){
    //gets full monster list
    //contains links to indivdual endpoints

    Rec.find({}, function(err, recs){
        var ml = [];
        var uniq = [];

        for (var i in recs){
            ml.push(recs[i].monster);
            if (!uniq.includes(recs[i].monster)) uniq.push(recs[i].monster);
        };


        uniq = uniq.sort(function(a,b){
        	if (a > b){
        		return 1;
        	}
        	return -1;
        });

        res.render('list', {toList: uniq, monster: true});
    })
});

app.get('/monsters/:m_id', function(req, res){
	//gets specific monster
	var _id = req.params.m_id;
	Rec.find({monster: _id}, function(err, recs){
		res.render('monlist', {monlist: recs, mon: _id});
	});
});

app.get('/runes', function(req, res){


    Rec.find({}, function(err, recs){
        var rl = [];
        var uniq = [];

        for (var i in recs){
            var curr = recs[i].sets;
            for (var j = 0; j < 3; j++){

                rl.push(curr[j]);
                if (!uniq.includes(curr[j]) && runeList.includes(curr[j])) uniq.push(curr[j]);
            }
            
        };
        
        uniq = uniq.sort(function(a,b){
        	if (a > b){
        		return 1;
        	}
        	return -1;
        });

        res.render('list', {toList: uniq, rune: true});
    })
});

app.get('/runes/:r_id', function(req, res){
	var _id = req.params.r_id;
	Rec.find({sets: { $in: [_id] } }, function(err, recs){
		if (err) throw err;
		res.render('monlist', {monlist: recs, rune: _id});
	})
});

app.get('/stats', function(req, res){

    Rec.find({}, function(err, recs){
        var sl = [];
        var uniq = [];

        for (var i in recs){
            var curr = recs[i].stats;
            for (var j = 0; j < 3; j++){

                var parsed = curr[j].split(/[\s,]+/);
                for (var k in parsed){
                    if (statList.includes(parsed[k].toUpperCase())){
                        sl.push(parsed[k]);
                        if (!uniq.includes(parsed[k]) && parsed[k] != "") uniq.push(parsed[k]);
                    }
                }
                
            }
            
        };

        uniq = uniq.sort(function(a,b){
        	if (a > b){
        		return 1;
        	}
        	return -1;
        });

        res.render('list', {toList: uniq, stat: true});
    })
});

app.get('/stats/:s_id', function(req, res){
	var _id = req.params.s_id;
	Rec.find({}, function(err, recs){
		
		var sl = [];
		var uniq = [];
		var stat = _id;
		for (var i in recs){
			var curr = recs[i].stats;
			for (var j=0; j < 3; j++){

				var parsed = curr[j].split(/[\s,]+/);
				if (parsed.includes(stat)){
					sl.push(recs[i]);
					if (!uniq.includes(recs[i]) && recs[i] != "") uniq.push(recs[i]);
				}
			}
		}

		res.render('monlist', {monlist: uniq, stat: _id});
	})
});

app.get('/random', function(req, res){


    Rec.find({}, function(err, recs){
        var len = recs.length;
        var i = Math.floor(Math.random() * len);
        var mon = recs[i].monster;
        Rec.find({monster: mon}, function(err, recs2){
        	res.render('monlist', {monlist: recs2, mon: mon});
        })
        
    })
});

app.get('/rating/:gt', function(req, res){

	var min = req.params.gt;
	//sorted by rating

    Rec.find({rating: { $gt: min }}, function(err, recs){
    	var sorted = recs.sort(function(a,b){
    		return parseInt(b.rating) - parseInt(a.rating);
    	})
        res.render('monlist', {monlist: sorted});
    })
});


app.listen(3000, function() {
    console.log('Listening on port 3000!');
});
