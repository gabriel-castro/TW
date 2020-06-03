var jogadas = [23].fill(0);
var ltab=0;
var ctab=0;
var p1 = 0;
var p2 = 0;
var player=1;
var tTot1;
var tTot2;
var now;
var tSwitch;
var dif = [[],[],[],[]];
var esconde = true;
var aux=0;
var texto;
var gamover = false;
var nrjogo=0;
var displayTime;
var modojogo=0;
var game, key;
var user, pw;

function Jogador(pontos, tempo, nome, numjogo){
	this.pontos=pontos;
	this.tempo=tempo;
	this.nome=nome + " " + numjogo;
}

function hide(eid){
	document.getElementById(eid).style.display = 'none';
}

function show(eid){
	document.getElementById(eid).style.display = 'inline-block';
}

window.onload = function() {
	hide("juntar");
	hide("top");
	hide("jogo");
	hide("wait");
	document.getElementById("breset").disabled = true;
	document.getElementById("bsair").disabled = true;
};

function hide_login() {
	hide("top");
	if (esconde) hide("jogo");
	else show("jogo");
	show("juntar");
	hide("login");
	if(modojogo==1) hide("bsair");
	return false;
}

function top10(){
	show("top");
	hide("login");
	hide("juntar");
	hide("jogo");
	clearTop();
	lista();
	return false;
}

function clearTop(){
	var j,i;
	for(i=0;i<4;i++){
		var ol = document.getElementById("list" + parseInt(i+1));
		while (ol.firstChild) {
			ol.removeChild(ol.firstChild);
		}
	}
}

function lista(){
	if(modojogo==2){
		beginner();
		intermediate();
		advanced();
		expert();
		return;
	}
	//modo offline
	var j,i;
	var li;
	for(i=0;i<4;i++){
		dif[i].sort(function(a,b){if(a.pontos === b.pontos) return a.tempo-b.tempo; else return b.pontos - a.pontos;});
		var ol = document.getElementById("list" + parseInt(i+1));
		for (j=0;j<dif[i].length && j<10;j++){
			li=document.createElement("li");
			li.innerHTML = dif[i][j].nome  + "|| Pontos - " + dif[i][j].pontos + " || Segundos - " + dif[i][j].tempo ;
			ol.appendChild(li);
		}
	}
}

// Returns a random number between min (inclusive) and max (exclusive)
function getRandom(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clr_change(element, color,type) {
	var i,j;
	if(typeof(element.move) !== "undefined"){
		i= parseInt(element.move.row);
		j= parseInt(element.move.col);
		if(element.move.orient=="h"){i=2*(i-1);j=2*j-1;}
		else if(element.move.orient=="v"){i=2*i-1;j=2*(j-1);}
		element = document.getElementById( i + " " + j);
	}else if(typeof(element.id) !== "undefined"){
		var str = element.id.split(" ");
		i = parseInt(str[0]);
		j = parseInt(str[1]);
	}
	if (type==="click" && jogadas[i][j]===0){
		if (element.style.backgroundColor!="black") element.style.backgroundColor = color;
		jogadas[i][j] = 1;
		player=1;
		calcpont(i,j);
		if(player==2) if(!isOver()) pc_play();
	}else if(type==="out"){
		if(jogadas[i][j]!==1) element.style.backgroundColor = color;
	}else{
		if (jogadas[i][j]!==1) element.style.backgroundColor = color;
	}
}

function jog_play(element){
	if (modojogo==2){  jogada(element); }
	if (modojogo!=2) clr_change(element, 'black','click');
	if(isOver()) gamover=true;
}

function quemGanhou(){
	var i;
	aux++;
	if (ltab===4 && ctab===6) i=0;
	else if (ltab===8 && ctab===10) i=1;
	else if (ltab===12 && ctab===16) i=2;
	else if (ltab===18 && ctab===22) i=3;
	var j1;
	if(p1>p2){
		j1=new Jogador(p1, parseInt(displayTime/ 1000),"Convidado" , nrjogo);
		dif[i].push(j1);
		//alert("Jogo acabou! Ganhou o Jogador 1 !");
	}
	else if (p1<p2){
		j1=new Jogador(p2, aux,"Computador", nrjogo);
		dif[i].push(j1);
		//alert("Jogo acabou! Ganhou o Computador !");
	}
	else if(parseInt(displayTime/ 1000) >= aux) {
		j1=new Jogador(p1, parseInt(displayTime/ 1000),"Convidado" , nrjogo);
		dif[i].push(j1);
	}
	else{
		j1=new Jogador(p2, aux,"Computador", nrjogo);
		dif[i].push(j1);
	}

}


function pc_play(){
	if(modojogo==2) return;
	var rnd1 = getRandom(0,ltab);
	var rnd2 = getRandom(0,ctab);
	while(((jogadas[rnd1][rnd2]===1) || (rnd1%2===0 && rnd2%2===0) || (rnd1%2!==0 && rnd2%2!==0))){
		rnd1 = getRandom(0,ltab);
		rnd2 = getRandom(0,ctab);
	}
	document.getElementById(rnd1 + " " + rnd2).style.backgroundColor = 'gray';
	jogadas[rnd1][rnd2] = 1;
	player=2;
	calcpont(rnd1,rnd2);
}

function isOver(){
	if (gamover) return true;
	var i,j;
	for(i=0;i<=ltab;i++){
		for(j=0;j<=ctab;j++){
			if(i%2===0) j++;
			if(jogadas[i][j]===0) return false;
			if(i%2!==0) j++;
		}
	}
	quemGanhou();
	gamover = true;
	return true;
}

function calcpont(l, c){
	if(modojogo===2) return;
	if(l%2!==0){// border vertical
		if ((l>0) && (c>1) && (l<ltab))
		if((jogadas[l-1][c-1]===1) && (jogadas[l+1][c-1]===1) && (jogadas[l][c-2]===1))//parte esquerda
		if(((player===1) || (player===3)) && (document.getElementById(l + " " + parseInt(c-1)).style.backgroundColor !== 'black'))    {
			p1++;
			document.getElementById(l + " " + parseInt(c-1)).style.backgroundColor = 'black';
			player=3;
		}
		else if((player===2) && (document.getElementById(l + " " + parseInt(c-1)).style.backgroundColor !== 'gray'))    {
			p2++;
			document.getElementById(l + " " + parseInt(c-1)).style.backgroundColor = 'gray';
			if(!isOver()) pc_play();
		}
		if ((l>0) && ((c+1)<ctab) && (l<ltab))
		if((jogadas[l-1][c+1]===1) && (jogadas[l+1][c+1]===1) && (jogadas[l][c+2]===1))//parte direita
		if(((player===1) || (player===3)) && (document.getElementById(l + " " + parseInt(c+1)).style.backgroundColor !== 'black' ))    {
			p1++;
			document.getElementById(l + " " + parseInt(c+1)).style.backgroundColor = 'black';
			player=3;
		}
		else if((player===2) && (document.getElementById(l + " " + parseInt(c+1)).style.backgroundColor !== 'gray' ))    {
			p2++;
			document.getElementById(l + " " + parseInt(c+1)).style.backgroundColor = 'gray';
			if(!isOver()) pc_play();
		}
	}else{// border horizontal
		if ((l>1) && (c>0) && (c<ctab) )
		if((jogadas[l-1][c-1]===1) && (jogadas[l-1][c+1]===1) && (jogadas[l-2][c]===1))//parte baixo
		if(((player===1) || (player===3)) && ( document.getElementById(parseInt(l-1) + " " + c).style.backgroundColor !== 'black'))    {
			p1++;
			document.getElementById(parseInt(l-1) + " " + c).style.backgroundColor = 'black';
			player=3;
		}
		else if((player===2) && (document.getElementById(parseInt(l-1) + " " + c).style.backgroundColor !== 'gray'))    {
			p2++;
			document.getElementById(parseInt(l-1) + " " + c).style.backgroundColor = 'gray';
			if(!isOver()) pc_play();
		}
		if ((c>0) && ((l+1)<ltab) && (c<ctab) )
		if((jogadas[l+1][c-1]===1) && (jogadas[l+1][c+1]===1) && (jogadas[l+2][c]===1))//parte cima
		if(((player===1) || (player===3)) && (document.getElementById(parseInt(l+1) + " " + c).style.backgroundColor !== 'black'))    {
			p1++;
			document.getElementById(parseInt(l+1) + " " + c).style.backgroundColor = 'black';
			player=3;
		}
		else if((player===2) && (document.getElementById(parseInt(l+1) + " " + c).style.backgroundColor !== 'gray'))    {
			p2++;
			document.getElementById(parseInt(l+1) + " " + c).style.backgroundColor = 'gray';
			if(!isOver()) pc_play();
		}
	}
	if(player==1){
		now=Date.now();
		player=2;
		tTot1+=now-tSwitch;
		tSwitch=now;
		tCurMove = Date.now() - tSwitch;
		displayTime = tTot1 + tCurMove;
		updateCounter(1,parseInt(displayTime/ 1000));
	}
	else if(player==3){
		player=1;
		now=Date.now();
		tTot1+=now-tSwitch;
		tSwitch=now;
		tCurMove = Date.now() - tSwitch;
		displayTime = tTot1 + tCurMove;
		updateCounter(1,parseInt(displayTime/ 1000));
	}
	else{
		now=Date.now();
		tTot2+=now-tSwitch;
		tSwitch=now;
		tCurMove = Date.now() - tSwitch;
		displayTime = tTot2 + tCurMove;
		updateCounter(2,aux++);
	}
	if(modojogo!==2){document.getElementById("score_jg1").innerHTML = p1;
	document.getElementById("score_jg2").innerHTML = p2;}
}

function updateCounter(i,time){
	if(i==1){ document.getElementById("tempo_jg1").innerHTML = time ;  return time;}
	else{ document.getElementById("tempo_jg2").innerHTML = time ;  return time;}
}

function reset(lin, col, text){
	nrjogo++;
	displayTime=0;
	gamover = false;
	texto = text;
	aux=0;
	p1 = 0;
	p2 = 0;
	tTot1 = 0;
	tTot2 = 0;
	tSwitch=Date.now();
	now = tSwitch;
	player=1;
	ltab=(lin*2);
	ctab=(col*2);
	esconde= false;
	document.getElementById("score_jg1").innerHTML = p1;
	document.getElementById("score_jg2").innerHTML = p2;
	document.getElementById("tempo_jg1").innerHTML = tTot1;
	document.getElementById("tempo_jg2").innerHTML = tTot2;
	document.getElementById("botao_jgr").innerHTML = text;
	show("jogo");
	document.getElementById("game").innerHTML = "";
	document.getElementById("breset").disabled = true;
	document.getElementById("btop").disabled = true;
	document.getElementById("botao_jgr").disabled = true;
	var ccc=document.getElementById("progressCanvas");
	var ctxx=ccc.getContext("2d");
	ctxx.clearRect(0,0,100,100);
	var cccc=document.getElementById("loadingCanvas");
	var ctxxx=cccc.getContext("2d");
	ctxxx.clearRect(0,0,200,100);
	document.getElementById("breset").style.backgroundImage = "url('reset2.png')";
	document.getElementById("bsair").disabled = true;
	document.getElementById("bsair").style.backgroundImage = "url('exit2.png')";
}

function converter(text){
	if(text=='Beginner (2x3)') return "beginner";
	else if(text=='Intermediate (4x5)') return "intermediate";
	else if(text=='Advanced (6x8)') return "advanced";
	else if(text=='Expert (9x11)') return "expert";
}

function table(lin, col, text){
	reset(lin,col,text);
	var dificuldade=converter(text);
	if(modojogo==2){
		hide("jogo");
		document.getElementById("wait").style.display = 'block';
		canvas();
		user = document.getElementById("user").value.toString();
		pw = document.getElementById("pw").value.toString();
		junta(24,user,pw,dificuldade);
	}

	game = document.getElementById("game");
	var i=0,j=0;
	var linhas = [];
	var cell = [];
	for(i=0;i<=(lin*2);i++){
		jogadas[i] = [ctab+1];
		linhas[i]=document.createElement("tr");
		for(j=0;j<=(col*2);j++){
			jogadas[i][j]=0;
			if((j % 2 !== 0) && (i % 2 !== 0)) { //criar celula
				cell[j] = document.createElement("td");
				cell[j].setAttribute("class","cell");
				cell[j].setAttribute("id",i + " " + j);

			}
			else if((j % 2 === 0) && (i % 2 === 0)){
				cell[j] = document.createElement("td");
				cell[j].setAttribute("class","edge");
			}
			else  { //criar border
				cell[j] = document.createElement("td");
				cell[j].setAttribute("class","border");
				cell[j].setAttribute("id",i + " " + j);
				cell[j].setAttribute("onMouseOver","clr_change(this, 'black',' ')");
				cell[j].setAttribute("onMouseOut","clr_change(this, 'white','out')");
				cell[j].setAttribute("onclick","jog_play(this)");
			}
			game.appendChild(cell[j]);
		}
		game.appendChild(linhas[i]);
	}
	if (modojogo==2)hide("jogo");
	return false;
}

function restart(){
	table(ltab/2, ctab/2, texto);
}

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function dd2click() {
	document.getElementById("myDropdown2").classList.toggle("show");
	return false;
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
	if (!event.target.matches('.dropbtn')) {
		var dropdowns = document.getElementsByClassName("dropdown-content");
		var i;
		for (i = 0; i < dropdowns.length; i++) {
			var openDropdown = dropdowns[i];
			if (openDropdown.classList.contains('show')) {
				openDropdown.classList.remove('show');
			}
		}
	}
	return false;
};
/*______________________________ETAPA2_________________*/

function registar(){
	user = document.getElementById("user").value.toString();
	pw = document.getElementById("pw").value.toString();
	document.getElementById("ply1").innerHTML = user;
	var url= "http://twserver.alunos.dcc.fc.up.pt:8024/register";
	var xhr = new XMLHttpRequest();
	xhr.open("post", url, true);
	xhr.setRequestHeader("Content-type", "application/json");
	xhr.onreadystatechange = function(){
		if (xhr.readyState != 4) {return;}
		var resText = xhr.responseText;
		if(resText === "{}"){ modojogo=2; hide_login();}
		else if (resText.includes("different password")) { window.alert("Utilizador registado com password diferente!");}
		else window.alert("Erro: "+resText);
	};
	xhr.send(JSON.stringify({name: user , pass: pw}));
}

function junta(group, user, pass, level){
	var url= "http://twserver.alunos.dcc.fc.up.pt:8024/join";
	var xhr = new XMLHttpRequest();
	xhr.open("post", url, true);
	xhr.setRequestHeader("Content-type", "application/json");
	xhr.onreadystatechange = function(){
		if (xhr.readyState != 4) {return;}
		if (xhr.status != 200) { return;}
		console.log("response text " + xhr.responseText);
		var obj = JSON.parse(xhr.responseText);
		game=obj.game;
		key=obj.key;
		atualiza();
	};
	xhr.send(JSON.stringify({name: user , pass: pass, level: level , group: group }));
}

function atualiza(){
	esrc = new EventSource("http://twserver.alunos.dcc.fc.up.pt:8024/update?name=" + user + "&game=" + game + "&key=" + key);
	esrc.onmessage = function(e) {
		if(typeof(e.data) !== "undefined") {// tudo ok
			hide("wait");
			show("jogo");
			var obj = JSON.parse(e.data);
			if(e.data.includes("opponent")){
				document.getElementById("ply2").innerHTML = obj.opponent;
				console.log(e.data);
			}
			else if(e.data.includes("move")){
				console.log("Tempo " + obj.move.time );
				if(obj.move.name===user) document.getElementById("tempo_jg1").innerHTML=Math.round(obj.move.time)+'s';
				else { document.getElementById("tempo_jg2").innerHTML=Math.round(obj.move.time)+'s'; }
				if(typeof(obj.move.boxes) !== "undefined"){
					var l,c,i;
					if(obj.move.name===user){// user
						var aux = parseInt(document.getElementById("score_jg1").innerHTML);
						aux+=obj.move.boxes.length;
						document.getElementById("score_jg1").innerHTML=aux;
						for(i=0;i<obj.move.boxes.length;i++)
						{
							l=parseInt(obj.move.boxes[i][0]);
							c=parseInt(obj.move.boxes[i][1]);
							l=2*l-1;
							c=2*c-1;
							document.getElementById(l + " " + c).style.backgroundColor = 'black';
							document.getElementById("tempo_jg1").innerHTML=Math.round(obj.move.time)+'s';
							console.log("moves " + obj.move.time);
						}
					}else{ //oponente
						var aux2 = parseInt(document.getElementById("score_jg2").innerHTML);
						aux2+=obj.move.boxes.length;
						document.getElementById("score_jg2").innerHTML=aux2;
						for(i=0;i<obj.move.boxes.length;i++)
						{
							l=parseInt(obj.move.boxes[i][0]);
							c=parseInt(obj.move.boxes[i][1]);
							l=2*l-1;
							c=2*c-1;
							document.getElementById(l + " " + c).style.backgroundColor = 'grey';
							document.getElementById("tempo_jg2").innerHTML=Math.round(obj.move.time)+'s';
							console.log("moves " + obj.move.time);
						}
					}
					if(e.data.includes("winner")){
						document.getElementById("botao_jgr").disabled = false;
						document.getElementById("btop").disabled = false;
						document.getElementById("breset").style.backgroundImage = "url('reset.png')";
						document.getElementById("breset").disabled = false;
						document.getElementById("bsair").style.backgroundImage = "url('exit.png')";
						document.getElementById("bsair").disabled = false;
						alert("VENCEDOR: " + obj.winner);
					}
				}
				progressCan();
				clr_change(obj, 'grey','click');
			}
		} else {//  ERRO
			console.log("ERRO: " + e.data);
		}
	};
}

function sair(){
	leave();
	window.location.reload();
}

function jogada(element){
	var r,c,o;
	console.log("jogada:");
	console.log("element id " + element.id);
	var str = element.id.split(" ");
	var url= "http://twserver.alunos.dcc.fc.up.pt:8024/notify";
	var xhr = new XMLHttpRequest();
	xhr.open("post", url, true);
	xhr.setRequestHeader("Content-type", "application/json");
	xhr.onreadystatechange = function(){
		if (xhr.readyState != 4) {return;}
		var resText = xhr.responseText;
		if(resText === "{}") {  clr_change(element, 'black','click');  }
		else if(resText.includes("Not your turn")){ alert("Não é a tua vez de jogar!"); console.log("nao é a tua vez!"); 	}
		else if(resText.includes("already drawn")){ alert("Essa jogada já foi feita!"); console.log("aresta ja foi usada!");}
		else{ console.log("Erro: "+resText); }
	};
	var linha=parseInt(str[0]);
	var coluna=parseInt(str[1]);
	if((linha%2===0) && (coluna%2!==0)) { r=Math.round(1+linha/2); c=Math.round((coluna+1)/2); o='h';}
	if((linha%2!==0) && (coluna%2===0)) { r= Math.round((linha+1)/2); c=Math.round(1+coluna/2); o='v';}
	xhr.send(JSON.stringify({name: user, game: game, key: key, orient: o, row: r, col: c}));
}

function leave() {
	var url= "http://twserver.alunos.dcc.fc.up.pt:8024/leave";
	var xhr = new XMLHttpRequest();
	xhr.open("post", url, true);
	xhr.setRequestHeader("Content-type", "application/json");
	xhr.onreadystatechange = function(){
		if(xhr.readyState !== 4){return;}
		if(xhr.status !== 200){return;}
		console.log(xhr.responseText);
	};
	xhr.send(JSON.stringify({name: user, game: game, key: key}));
}

function beginner(){
	var url= "http://twserver.alunos.dcc.fc.up.pt:8024/ranking";
	var xhr = new XMLHttpRequest();
	xhr.open("post", url, true);
	xhr.setRequestHeader("Content-type", "application/json");
	xhr.onreadystatechange = function(){
		if(xhr.readyState !== 4){return;}
		if(xhr.status !== 200){return;}
		console.log("ranking: " + xhr.responseText);
		var obj = JSON.parse(xhr.responseText);
		var ol = document.getElementById("list1");
		for (j=0;j<obj.ranking.length && j<10;j++){
			li=document.createElement("li");
			li.innerHTML = obj.ranking[j].name  + " || Pontos - " + obj.ranking[j].boxes + " || Segundos - " + obj.ranking[j].time ;
			ol.appendChild(li);
		}
	};
	xhr.send(JSON.stringify({level: "beginner"}));
}


function intermediate(){
	var url= "http://twserver.alunos.dcc.fc.up.pt:8024/ranking";
	var xhr = new XMLHttpRequest();
	xhr.open("post", url, true);
	xhr.setRequestHeader("Content-type", "application/json");
	xhr.onreadystatechange = function(){
		if(xhr.readyState !== 4){return;}
		if(xhr.status !== 200){return;}
		console.log("ranking: " + xhr.responseText);
		var obj = JSON.parse(xhr.responseText);
		var ol = document.getElementById("list2");
		for (j=0;j<obj.ranking.length && j<10;j++){
			li=document.createElement("li");
			li.innerHTML = obj.ranking[j].name  + " || Pontos - " + obj.ranking[j].boxes + " || Segundos - " + obj.ranking[j].time ;
			ol.appendChild(li);
		}
	};
	xhr.send(JSON.stringify({level: "intermediate"}));
}


function advanced(){
	var url= "http://twserver.alunos.dcc.fc.up.pt:8024/ranking";
	var xhr = new XMLHttpRequest();
	xhr.open("post", url, true);
	xhr.setRequestHeader("Content-type", "application/json");
	xhr.onreadystatechange = function(){
		if(xhr.readyState !== 4){return;}
		if(xhr.status !== 200){return;}
		console.log("ranking: " + xhr.responseText);
		var obj = JSON.parse(xhr.responseText);
		var ol = document.getElementById("list3");
		for (j=0;j<obj.ranking.length && j<10;j++){
			li=document.createElement("li");
			li.innerHTML = obj.ranking[j].name  + " || Pontos - " + obj.ranking[j].boxes + " || Segundos - " + obj.ranking[j].time ;
			ol.appendChild(li);
		}
	};
	xhr.send(JSON.stringify({level: "advanced"}));
}

function expert(){
	var url= "http://twserver.alunos.dcc.fc.up.pt:8024/ranking";
	var xhr = new XMLHttpRequest();
	xhr.open("post", url, true);
	xhr.setRequestHeader("Content-type", "application/json");
	xhr.onreadystatechange = function(){
		if(xhr.readyState !== 4){return;}
		if(xhr.status !== 200){return;}
		console.log("ranking: " + xhr.responseText);
		var obj = JSON.parse(xhr.responseText);
		var ol = document.getElementById("list4");
		for (j=0;j<obj.ranking.length && j<10;j++){
			li=document.createElement("li");
			li.innerHTML = obj.ranking[j].name  + " || Pontos - " + obj.ranking[j].boxes + " || Segundos - " + obj.ranking[j].time ;
			ol.appendChild(li);
		}
	};
	xhr.send(JSON.stringify({level: "expert"}));
}



// CANVAS
function canvas(){
	var c=document.getElementById('loadingCanvas'),
	ctx=c.getContext('2d'),
	pi = Math.PI,
	xCenter = c.width/2,
	yCenter = c.height/2,
	radius = c.width/10,
	startSize = radius/3,
	num=5,
	posX=[],posY=[],angle,size,i;
	window.setInterval(function() {
		num++;
		ctx.clearRect ( 0 , 0 , xCenter*2 , yCenter*2 );
		for (i=0; i<9; i++){
			ctx.beginPath();
			ctx.fillStyle = 'rgba(69,99,255,'+0.1*i+')';
			if (posX.length==i){
				angle = pi*i*0.25;
				posX[i] = xCenter + radius * Math.cos(angle);
				posY[i] = yCenter + radius * Math.sin(angle);
			}
			ctx.arc(
				posX[(i+num)%8],
				posY[(i+num)%8],
				startSize/9*i,
				0, pi*2, 1);
				ctx.fill();
			}
		}, 100);
	}


	function progressCan(){
		var p1 = parseInt(document.getElementById('score_jg1').innerHTML);
		var p2 = parseInt(document.getElementById('score_jg2').innerHTML);
		var total = (ctab/2)*(ltab/2);
		console.log("canvas- colunas, linhas: " + ctab/2 + " " + ltab/2);
		var percent = Math.round(((p1+p2)/total)*100);
		var ctx = document.getElementById('progressCanvas').getContext('2d');
		var al = 0;
		var start = 4.72;
		var cw = 70;
		var ch = 70;
		var diff;
		diff = ((percent / 100) * Math.PI*2*10).toFixed(2);
		ctx.clearRect(0, 0, cw, ch);
		ctx.lineWidth = 10;
		ctx.fillStyle = '#3b45c4';
		ctx.strokeStyle = "#3b45c4";
		ctx.textAlign = 'center';
		ctx.fillText(percent+'%', cw*0.5, ch*0.5+2, cw);
		ctx.beginPath();
		ctx.arc(35, 35, 30, start, diff/10+start, false);
		ctx.stroke();
	}
