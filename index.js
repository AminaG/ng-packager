require('@aminadav/aminode')
var index_html;
css()
// js()
html();

process.exit()
function html(){
	index_html=fs.readFileSync('../frontend/indexdev.html','utf-8')

	index_html=index_html.replace(/<script[^<]+\.js.*\/script>/gi,'')
	index_html=index_html.replace(/<link[^>]+\.css.*>/gi,'')
	var htmls={};
	var s='';
	for(var i=0;i<6;i++)
		index_html=index_html.replace(/<.*?ng-include=['"]+([^'"]*\.html?).*?<\/.*>/gi,function(r,r1,r2){
			console.log('ng-include:' , r,'=',r1)
			if(!htmls[r1]){
				var nc='xu' + parseInt(Math.random()*10000000)
				// var nc=r1
				htmls[r1]=nc
				s+='<script type="text/ng-template" id="' + nc + '">'
				s+=fs.readFileSync('../frontend/' + r1,'utf-8')
				s+='</script>'				
			}
			return  '<div ng-include="\'' + htmls[r1] + '\'"></div>' 
		})
	index_html=index_html.replace(/(<body.*?>)/, '$1' + s + '<script src=output.js></script><link rel=stylesheet href=output.css><link rel=stylehsett href=https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css>') 
	index_html=index_html.replace(/[\r\n\t]/g, ' ') 
	index_html=index_html.replace(/  +/g, ' ') 
	index_html=index_html.replace(/<!--.*?-->/g, '') 

	_.each(htmls,function(v,k){
		index_html=replaceAll(index_html,k,v)

	})
	fs.writeFileSync('../frontend/index.html',index_html)

	index_html=fs.readFileSync('../frontend/output.before_html_replace.js','utf-8')
	_.each(htmls,function(v,k){
		index_html=replaceAll(index_html,k,v)

	})
	fs.writeFileSync('../frontend/output.js',index_html)


	console.log(htmls)

	// fs.writeFileSync('../frontend/index.html',index_html)
	// index_html=index_html.replace(/\r|\n/g,' ');
	// index_html=index_html.replace(/ +/g,' ');
	// index_html=index_html.replace(/\t+/g,'');
	// index_html=index_html.replace(/<!--.*?-->/g,'');
	// var str=_.reduce(scripts,function(old,script_name){
	// 	try{
	// 		console.log('now:',script_name)
	// 		 var str= fs.readFileSync('../frontend/' + script_name,'utf-8')
	// 		 // return old + ';\r/*filename + ' + script_name + '*/' + str
	// 		 // str=require('ng-annotate')(str,{add:true})
	// 		 // require("uglify-js").minify(str.src,{fromString: true})
	// 		 return old += ';\r\n' + str.src
	// 	}
	// 	catch(err){
	// 		console.log('file not found:',script_name)
	// 		return old;
	// 	}
	// },'')
	// console.log('bef',str.length)
	// str = require("uglify-js").minify(str,{fromString: true}).code;
	// console.log('aft',str.length)
	// fs.writeFileSync('../frontend/output.js',str)	
}
function js(){
	var index_html=fs.readFileSync('../frontend/indexdev.html','utf-8')
	var scripts=[]
	index_html.replace(/([^'"=]*\.js)('|"|>)/gi,function(r,r1,r2){
		scripts.push(r1)
	})

	var str=_.reduce(scripts,function(old,script_name){
		try{
			console.log('now:',script_name)
			 var str= fs.readFileSync('../frontend/' + script_name,'utf-8')
			 // return old + ';\r/*filename + ' + script_name + '*/' + str
			 str=require('ng-annotate')(str,{add:true})
			 // require("uglify-js").minify(str.src,{fromString: true})
			 return old += ';\r\n' + str.src
		}
		catch(err){
			console.log('file not found:',script_name)
			return old;
		}
	},'')
	console.log('bef',str.length)
	str = require("uglify-js").minify('(function(){' + str + '})()',{fromString: true}).code;
	console.log('aft',str.length)
	fs.writeFileSync('../frontend/output.js',str)
	fs.writeFileSync('../frontend/output.before_html_replace.js',str)
}
function css(){
	var css_array=[];
	var index_html=fs.readFileSync('../frontend/indexdev.html','utf-8')
	index_html.replace(/([^'"=]*\.css)('|"|>)/gi,function(r,r1,r2){
		css_array.push(r1)
	})

	str=_.reduce(css_array,function(old,script_name){
		try{
			console.log('now:',script_name)
			 var str= fs.readFileSync('../frontend/' + script_name,'utf-8')
			 return old + ' ' + str
		}
		catch(err){
			console.log('file not found:',script_name)
			return old;
		}
	},'')
	str = require('uglifycss').processString(str)
	fs.writeFileSync('../frontend/output.css',str)
	// Uglify CSS + Uglify JS and show how much compare
	// Build HTML
}



function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}
function replaceAll(str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}