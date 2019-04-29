function showmovie(data) {
    var payload = { table:"movie" };
    $.post('/fetchData',payload,(data)=>{
        data.forEach((value,key)=>{
            
            $("#Movie").append('<tr class="default-mouse"><th class="text-white pl-3 movieTable" scope="col">'+value.MovieName+'</th></tr>');
        });
        // data.forEach((value, key) => {
        // var tableRowappend = '<tr id="Th'+Thcount+'" class="default-mouse" ><th onclick="editTh('+Thcount+')" class="text-white pl-3" scope="col">'+value.Name+'</th>'
        
        // if(Thcount>0) tableRowappend += '<th class="text-white" onclick="removeTh('+Thcount+')" scope="col">X</th>';
        // else tableRowappend += '<th onclick="editTh(0)"></th>';
        // tableRowappend += '</tr>';
        // Thcount++;
        // $("#MyTableTr").append(tableRowappend);
        console.log(data)
    });
    
}

function test(){
    console.log(this.innerHTML);
    var temp = this.innerHTML;
}

showmovie();
$(document).on('click',".movieTable",test);

