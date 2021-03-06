let token=localStorage.getItem("token"),
    site="https://reqres.in/api/login",
    login={
        email: "",
        password: ""    
    },
    butEntrar= document.getElementById("butEntrar"),
    butBuscar=document.getElementById("butBuscar"),
    inLabel=document.querySelector(".inLabel"),
    url,
    anoInLabel=document.getElementById("inAnoStartLabel"),
    mesInLabel=document.getElementById("inMesStartLabel"),
    diaInLabel=document.getElementById("inDiaStartLabel"),
    anoOutLabel=document.getElementById("inAnoEndLabel"),
    mesOutLabel=document.getElementById("inMesEndLabel"),
    diaOutLabel=document.getElementById("inDiaEndLabel"),
    ativo=document.getElementById("inAtivo"),
    anoIn=document.getElementById("inAnoStart"),
    mesIn=document.getElementById("inMesStart"),
    diaIn=document.getElementById("inDiaStart"),
    anoOut=document.getElementById("inAnoEnd"),
    mesOut=document.getElementById("inMesEnd"),
    diaOut=document.getElementById("inDiaEnd"),
    ativoLabel=document.getElementById("inAtivoLabel"),
    inEmail=document.getElementById("inEmail"),
    inSenha=document.getElementById("inSenha"),
    inEmailLabel=document.getElementById("lll"),
    inSenhaLabel=document.getElementById("sss"),
    butSair=document.getElementById("butSair")
;
    diaIn.addEventListener('input',()=>{ocultarLabel(diaIn,diaInLabel,"DIA - EXEMPLO: 01");});
    mesIn.addEventListener('input',()=>{ocultarLabel(mesIn,mesInLabel,"MES - EXEMPLO: 06");});
    anoIn.addEventListener('input',()=>{ocultarLabel(anoIn,anoInLabel,"ANO - EXEMPLO: 2015");});
    diaOut.addEventListener('input',()=>{ocultarLabel(diaOut,diaOutLabel,"DIA - EXEMPLO: 30");});
    mesOut.addEventListener('input',()=>{ocultarLabel(mesOut,mesOutLabel,"MES - EXEMPLO: 06");});
    anoOut.addEventListener('input',()=>{ocultarLabel(anoOut,anoOutLabel,"ANO - EXEMPLO: 2015");});
    ativo.addEventListener('input',()=>{ocultarLabel(ativo,ativoLabel,"CODIGO DE UM ATIVO DA NASDAQ - EXEMPLOS: AAPL, TSLA, FB...");});
    inEmail.addEventListener('input',()=>{ocultarLabel(inEmail,inEmailLabel,"Email:");});
    inSenha.addEventListener('input',()=>{ocultarLabel(inSenha,inSenhaLabel,"Password:");});
    butSair.addEventListener('click',()=>{
        token="";
        localStorage.clear();
        estado("grid","grid","none","none");
    });
    if (token==null){
        estado("grid","grid","none","none");
    }
   else{
        estado("none","none","flex","table");
   }    
    butEntrar.addEventListener('click', ()=>{autLogin();});
    butBuscar.addEventListener('click', ()=>{consultaAtivo();});
function autLogin(){
    let email=document.getElementById("inEmail");
    let senha=document.getElementById("inSenha");
    let avisoEmail=document.getElementById("avisoEmail");
    let avisoSenha=document.getElementById("avisoSenha");
    if(email.value.length<3){
        avisoEmail.style.display="block";
    }
    else{
        avisoEmail.style.display="none";
    }
    if(senha.value.length<3){
        avisoSenha.style.display="block";
    }
    else{
        avisoSenha.style.display="none";
    }
    login={email: email.value,
        password: senha.value
    };
    let dadoString= JSON.stringify(login);
    loadDoc(site,dadoString);
}
function loadDoc(url,valor){
    var httpReq= new XMLHttpRequest();
    httpReq.open("POST",url,true);
    httpReq.setRequestHeader("Content-Type","application/json");
    httpReq.onreadystatechange= function(){
        let dado, jdado;
        if(httpReq.readyState==4 && httpReq.status==200){
            dado= httpReq.responseText;
            jdado= JSON.parse(dado);
            localStorage.setItem("token",jdado.token);
            estado("none","none","flex","table");
        }
        else if(httpReq.readyState==4){
            alert("Login ou senha incorreto, tente novamente.");
        }
    }
    httpReq.send(valor);
}
function ocultarLabel(dadoIn,labelIn,texto){
    if(dadoIn.value!="")
        labelIn.innerHTML="";
    else
        labelIn.innerHTML=texto;
}
function consultaAtivo(){
    var inData, outData;
    inData=`${anoIn.value}-`;
    inData=`${inData}${mesIn.value}-`;
    inData=`${inData}${diaIn.value}`;
    outData=`${anoOut.value}-`;
    outData=`${outData}${mesOut.value}-`;
    outData=`${outData}${diaOut.value}`;
    url=`https://data.nasdaq.com/api/v3/datasets/WIKI/${ativo.value}.json?start_date=${anoIn.value}-${mesIn.value}-${diaIn.value}&end_date=${anoOut.value}-${mesOut.value}-${diaOut.value}&api_key=8D1vXonNH2mHyLz3huVa`;
    var httpreq=new XMLHttpRequest();
    httpreq.open("GET",url,true);
    httpreq.setRequestHeader("Content-Type","applicantion/json");
    httpreq.onreadystatechange=function(){
        let resposta;
        if(httpreq.readyState==4 && httpreq.status==200){
            resposta=httpreq.responseText;
            localStorage.setItem("nasdaq",resposta);
            let respostaJSON=JSON.parse(resposta);
            respostaJSON.dataset.data.forEach((dolar)=>{
                let item=document.getElementById("listaResultado");
                item.innerHTML=`${item.innerHTML}<tr><td>${dolar[0]}</td><td>${dolar[1]}</td><td>${dolar[4]}</td></tr>`;
            }); 
        }
        else if(httpreq.readyState==4)
            alert("Algum dado incorreto! Verificar dados que constam na API");
    }
    httpreq.send();
}
function estado(stat1,stat2,stat3,stat4){
    document.getElementById("principal").style.display= stat1;
    document.getElementById("cabecalo").style.display= stat2;
    document.getElementById("busca").style.display= stat3;
    document.querySelector("table").style.display= stat4;
}
