var flag = true;
var listNum = 1;
var musicNum = 1;
var media = new Audio();
var timer = null;
var id = 1;
function init(){
    
    var str = sp(location.href);  //ur=\server\data\1\1.json&id=1
    var str1 = str.split('&')[0].split('=')[1];
    id = str.split('&')[1].split('=')[1];
    console.log(str1)

    var num = str1.split('/')[4];

    console.log(num)
    
    var musicNum1 = num.split('.')[0];
    var listNum1 =  str1.split('/')[3];
    // console.log(musicNum1)
    // console.log(listNum1)
    rego();
    $.ajax({
        type:'GET',
        cache:false,
        url:'.'+str1,
        dataType:'json'
    }).done(function(data){
       musicNum = musicNum1;
       listNum = listNum1;
       addEle(data);
       addMusic(data);
    }).fail(function(err){
        // alert(err)
        console.log(123)
    });

}

function addEle(data){
    var strList = data.info[2].split('/');
    var str = strList[strList.length-1].split('.')[0];
    // console.log(str);
    $('.wrapper .header h4').html(str);
    $('.wrapper .header h5').html("");
    $('.bg').css({
        'backgroundImage':'url('+data.info[1]+')'
    }); 
    $('.wrapper .outline .heiquan .CD img').attr('src',data.info[1]); 

}

function addMusic(data){
    var str = data.info[2];
    media.src = str ;
    media.autoplay = true;
    // console.log(str)
    timer = setInterval(function(){
        // console.log(media.currentTime/media.duration*$('.div2').outerWidth());
        $('.div1').css({
            "left":media.currentTime/media.duration*$('.div2').outerWidth()
        })
    },2000);
    // console.log(data.num)
    bindStatus(media);
    // console.log(musicNum)
    // console.log(listNum)
    var num = Number(musicNum);
    // console.log('hello')
    bindSlider();
    bindNext(data);
    bindPre(data);
    bindEnde(data);
    bindTouchSl();
    
}

function sp(str){
    
    return str.split('?')[1];

}

function bindStatus(media){
    $('.status').off('touchend').on('touchend',function(){
        if(flag){
             $(this).addClass('icon-play3');
             $(this).removeClass('icon-pause2');
             media.pause();
             flag = false;
             $('.wrapper .run').css({
                'animationPlayState':'paused'
             });
             $('.gan img').removeClass('moveoff');
             $('.gan img').addClass('moveon');
             
        }else{
             $(this).removeClass('icon-play3');
             $(this).addClass('icon-pause2');
             media.play();
             flag = true;
             $('.wrapper .outline').css({
                'animationPlayState':'running'
             });
             $('.gan img').removeClass('moveon');
             $('.gan img').addClass('moveoff');
        }
     });
}

function bindNext(data){
    $('.next').off('touchend').on('touchend',function(){

        musicNum++;
        if(musicNum > data.info[3]){
           musicNum = 1;
        }
        $.ajax({
            type:'GET',
            cache:false,
            url:'./server/data/'+listNum+'/'+musicNum+'.json',
            dataType:'json'
        }).done(function(data){
           addEle(data);
           addMusic(data);
           timer = null;
        }).fail(function(err){
            // alert(err)
            musicNum--;
        });
     });
}

function bindPre(data){
    $('.pre').off('touchend').on('touchend',function(){
        musicNum--;
        if(musicNum < 1){
            musicNum = data.info[3];
        }
        $.ajax({
            type:'GET',
            cache:false,
            url:'./server/data/'+listNum+'/'+musicNum+'.json',
            dataType:'json'
        }).done(function(data){
           addEle(data);
           addMusic(data);
           timer = null;
        }).fail(function(err){
            // alert(err)
            musicNum++;
        });
     });
}

// function bindSlider(){
//     $('.wrapper .div2 .div1').off('touchmove').on('touchmove',function(e){
//         //父元素x轴位置
//         var fp = $(this).position().left;
//         var fw =  $(this).parent().outerWidth();
       
//        if(fp > fw){
//           $(this).css({
//             'left':fw
//           });
//           return;
//        }
//        if(fp < 0){
//            $(this).css({
//             'left':0
//           });
//           return;
//        }
//        console.log()
//        $(this).css({
//         'left': 1000
//       });
//         console.log(fp);
//     });
// }


function bindSlider(){
    $('.wrapper .div2 .div1')[0].addEventListener("touchmove", function(e) {
        //父元素x轴位置
        var fp = $(this).position().left;
        var fw =  $(this).parent().outerWidth();
        var fpo = $(this).parent().offset().left;
        if(fp > fw){
            $(this).css({
                'left':fw
            });
            media.currentTime = media.duration;
            return;
        }
        if(fp < 0){
            $(this).css({
                'left':0
            });
            media.currentTime = 0;
            return;
        }
        var x =  e.touches[0].pageX -fpo;
        // console.log(e.touches[0].pageX)
        // console.log(fpo)
        $(this).css({
            'left': x
        });
        media.currentTime = media.duration*(x/fw);
        // console.log(fp);
    });
}


function bindEnde(data){
    media.addEventListener('ended',function(){
        musicNum++;
        if(musicNum > data.info[3]){
           musicNum = 1;
        }
        $.ajax({
            type:'GET',
            cache:false,
            url:'./server/data/'+listNum+'/'+musicNum+'.json',
            dataType:'json'
        }).done(function(data){
           addEle(data);
           addMusic(data);
           timer = null;
        }).fail(function(err){
            // alert(err)
            musicNum--;
        });
    },false);

}


function bindTouchSl(){
    // console.log('hello')
    $('.div2')[0].addEventListener("touchstart", function(e) {
        console.log('hello')
        //父元素x轴位置
        var div = $('.div1');
        var fp = div.position().left;
        var fw =  div.parent().outerWidth();
        var fpo = div.parent().offset().left;
        var x =  e.touches[0].pageX -fpo;
        // console.log(x)
        media.currentTime = media.duration*(x/fw);
        $('.div1').css({
            'left': x
        });

        // media.currentTime = media.duration*(x/fw);
    });
}

function rego(){
    $('.wrapper .header span').on('touchend',function(){
        if(id == 1){
            window.location.href = './index.html';
        }else{
            window.location.href = './list.html?listId='+listNum;
        }
        
        
        
    });
   
}