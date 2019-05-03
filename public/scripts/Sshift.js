function showbranch(data) {
    var payload = { table:"branch" };
    $.post('/fetchData',payload,(data)=>{
        data.forEach((value,key)=>{
            
            $("#Sbranch").append('<tr class="default-mouse clickTable"><th class="text-white branchTable" scope="col">'+value.BranchName+'</th></tr>');
        });
        console.log(data)
    });
}

function showstaff(data) {
    var payload = { table:"staff" };
    $.post('/fetchData',payload,(data)=>{
        data.forEach((value,key)=>{
            
            $("#Sstaff").append('<tr class="default-mouse clickTable"><th class="text-white branchTable" scope="col">'+value.FirstName+''+value.LastName+'</th></tr>');
        });
        console.log(data)
    });
}

function datetime(){
    $('#time').combodate();  
}

showbranch();
showstaff();
