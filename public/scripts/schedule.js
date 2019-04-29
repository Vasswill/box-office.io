function showmovie(data) {
    var payload = { table:"movie" };
    $.post('/fetchData',payload,(data)=>{
        data.forEach((value,key)=>{
            
            $("#Movie").append('<tr class="default-mouse"><th class="text-white pl-3 movieTable" scope="col">'+value.MovieName+'</th></tr>');
        });
        console.log(data)
    });
    
}
function showbranch(data) {
    var payload = { table:"branch" };
    $.post('/fetchData',payload,(data)=>{
        data.forEach((value,key)=>{
            
            $("#Branch").append('<tr class="default-mouse"><th class="text-white pl-3 branchTable" scope="col">'+value.BranchNo+'</th></tr>');
        });
        console.log(data)
    });
    
}

function showTheater(data) {
    var payload = { table:"theater" };
    $.post('/fetchData',payload,(data)=>{
        data.forEach((value,key)=>{
            if(branch.temp==value.BranchNo)
            $("#theater").append('<tr class="default-mouse"><th class="text-white pl-3 branchTable" scope="col">'+value.TheaterCode+'</th></tr>');
        });
        console.log(data)
    });
    
}


function movie(){
    console.log(this.innerHTML);
    var temp = this.innerHTML;
}
function branch(){
    console.log(this.innerHTML);
    var temp = this.innerHTML;
    
}

showmovie();
showbranch();
$(document).on('click',".movieTable",movie);
$(document).on('click',".branchTable",branch);
showTheater();


