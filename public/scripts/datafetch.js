$(document).ready(function(){
    if("<%-typeof auth%>"!=undefined) {
        $('#head-login-btn').hide();
        $('#head-user-badge').show();
        fetchData('user',['ImageURL'], (data,err)=>{
            if(!err){
                $('.fetch.username').text(data.username);
                $('.fetch.userpic').attr('src',data.ImageURL);
            }
        });
    };
})
