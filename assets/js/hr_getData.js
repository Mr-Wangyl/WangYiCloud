
function getIndexData(arrInfo){
    var arr = [];
   for(var i=1;i<=2;i++){
       for(var j=1;j<=6;j++){
          (function(i,j){
            $.ajax({
             "url": "./server/data/"+i+"/"+j+".json",
             "method": "GET",
             "dataType": "json"
         }).done(function (data) {
             insertDom(data.info,i,j)
         }).fail(function (err) {
             console.log(err);
            })
          })(i,j);
       }
   }
 
}
function insertDom(arr,i,j){

    var oLi = document.querySelectorAll('.hr_musicList>ul>li>div>ol>li')[(i-1)*6+j-1];
    var oA = oLi.querySelector("a");
    var str1 = "./server/data/"+i+"/"+j+".json";
    oA.href = "./play.html?ur="+str1+"&id=1";
    var oImg = oLi.querySelector("img")
    oImg.src = "./"+arr[1];
    var oP = oLi.querySelector("p");
    var str = arr[2];
    oP.innerHTML = str.slice(15,-4)

}