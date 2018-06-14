/**
* 页面选项卡组件
* @author CBJ
* @param aLiList {collection} 选项卡的节点列表
* @param aDivList {collection} 选项卡内容的节点列表
* @param evType {string} 事件类型, 可选
* @param curIndex {number} 当前卡的索引, 可选
* @param callback {function} 回调函数, 可选
* @returns null
* @last modify by: JZY
*/
var tab=(function(){
    var params={

    }
    // function cutTab(index){
    //     for(var i=0;i<params.aLiList.length;i++){
    //         if(i!=index&&params.aLiList[i].class!=''){
    //             params.aLiList[i].className='';
    //         }
    //         else{
    //             params.aLiList[index].className='selected';
    //         }
    //     }
    // }
    function cutTab(index){
        params.aLiList.eq(index).addClass('selected').siblings().removeClass('selected');
    }

    // function getLiCid(){
    //     return params.aLiList.eq(curIndex).attr('data-cid');
    // }
    function getData(index, callback){
        $.ajax({
            type: 'GET',
            url: './server/data/lists/list'+index+'.json',
            dataType: 'json',
            cache: false,
        }).done(function(data){           
            if (data.err == 1){
                callback && callback(data.info);            
            } else {
                alert(data.message);
            }
        }).fail(function(error){ 
        });
    }
    function insertDom(index,arr){
        params.aDivList.eq(index).children().first().attr("src","./assets/img/pic.jpg")
        var LiNum = arr[2]
        var listId = parseInt(arr[0]) + 1
        var str = '';
        for (var i = 0; i < LiNum; i++){
            // str += '<li><a href="'+ arr[i].url +'"><img src="'+ arr[i].img_src +'"><h5>'+ arr[i].title +'</h5></a></li>';
            var tmp = [
                '<a href="./play.html?ul=./server/data/'+(listId)+'/'+arr[i+3]+'.json&id=2" class="songs">',
                    '<img class="songs-img" src="" alt="">',
                    '<h5 class="songs-name"></h5>',
                    '<h4 class="songs-info"></h4>',
                '</a>'
            ];
            str += tmp.join('');
        }

        params.aDivList.eq(index).append(str);      
        getSongs(arr,function(divIndex, aIndex, list){
            insertSongs(divIndex, aIndex, list);
        })
    }
    function getSongs(arr, callback){
        var i = arr[2]
        var aIndex = 0
        var divIndex = arr[0]
        var index = 3;
        while(i > 0){
            $.ajax({
                type: 'GET',
                url: './server/data/songs/'+arr[index]+'.json',
                dataType: 'json',
                cache: false,
            }).done(function(data){
                if (data.err == 1){
                    callback && callback(divIndex, aIndex++, data.info);
                } else {
                    alert(data.message);
                }
            }).fail(function(error){
    
            });
            index++;
            i--;
        }
    }
    function insertSongs(divIndex, aIndex, arr){
        var $a = params.aDivList.eq(divIndex).children(".songs").eq(aIndex)
        $a.children(".songs-img").attr("src", arr[0])
        $a.children(".songs-name").html(arr[1])
        $a.children(".songs-info").html(arr[2])
    }
    function cutTabCont(index){
        params.aDivList.eq(index).show().siblings().hide();
        if(!params.aDivList.eq(index).children().is("a")){
            getData(index, function(list){
                insertDom(index,list);
            });
        }
    }
    function bindEvent(){
        for(var i=0;i<params.aLiList.length;i++){
            params.aLiList[i].index=i;
            params.aLiList[i][params.evType]=function(ev){
                var k=this.index
                cutTab(k);
                cutTabCont(k);
                params.callback && params.callback(k);
            }
        }
    }
    function setParaments(options){
        params.aLiList=options.aLiList
        params.aDivList=options.aDivList
        if(!params.aLiList||!params.aDivList){
            console.error('传参有误')
        }
        params.callback=options.callback||null;
        params.curIndex = options.curIndex || 0;
        // 判断是否越界
        params.curIndex = params.curIndex < 0 ? 0 : params.curIndex;
        params.curIndex = params.curIndex > (params.aLiList.length - 1) ? (params.aLiList.length - 1) : params.curIndex;
        params.evType=options.evType||'onclick';
    }
      function goBack(){
        $('.header span').on('touchend',function(){
            window.location.href = './index.html';
        }) 
    }
    function install(options){
        setParaments(options)
        cutTab(params.curIndex)
        cutTabCont(params.curIndex)
        bindEvent(params.evType)
        goBack();
    }
  
    return install;
})();
