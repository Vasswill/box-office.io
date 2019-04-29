const fetchData = (topic, columns, next) => {
    switch(topic){
        case 'user':{
            $.get('/userdata', {
                columns:columns
            },(data)=>{
                next(data,null);
            }).fail((err)=>{
                next(null,err);
            });
            break;
        }
    }
}