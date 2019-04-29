$(document).ready(function(){
    if(auth) {
        fetchData('user',['ImageURL'], (data,err)=>{
            if(!err){
                $('.fetch.username').text(data.username);
                $('.fetch.userpic').attr('src',data.ImageURL);
            }
        });
    };
})
