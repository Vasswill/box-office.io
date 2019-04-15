var Theatre = [{Name:'Add New Theatre',Branch:'NULL'}];
var SeatClass;
var count=2;

function addTable(data) {
    data.forEach((value, key) => {
        $("#MyTableTr").append('<tr><th class="text-white" scope="col">'+value.Name+'</th></tr>');
    });
    
}

function saveTheatre(){
    var data = {Name:$('#NameTheatre').val(), Branch:$('#Branch').val()}
    $('#NameTheatre').val('');
    addTable([data]);
    Theatre.push(data);
}

function addBranchOption(){
    $.get('/fetchBranchData',(data)=>{
            data.forEach((value,key)=>{
            $("#Branch").append('<option class="form-control-plaintext" value="'+value.BranchName+'">'+value.BranchName+'</option>');
        })
    });
}

function getSeatClass(){
    $.get('/fetchSeatClasshData',(data)=>{
            SeatClass = data;
            data.forEach((value,key)=>{
                $("#SeatClass1").append('<option class="form-control-plaintext" value="'+value.ClassName+'">'+value.ClassName+'</option>');
            });
    });
}

function addSeat() {
    if(count<=4){
        $("#adj").append('<div class="form-group row mb-0"><label for="SeatClass'+count+'" class="col-md-2 mt-2 mb-0" style="padding-left: 13px;">Seat Class '+count+'</label><div class="col-md-3 col-sm-3 col-3"><select name="SeatClass'+count+'" id="SeatClass'+count+'" class="form-control-plaintext text-white"></select></div><label for="NoRow'+count+'" class="col-md-2 col-sm-3 col-3 mt-2 mb-0">No.Row</label><div class="col-md-3 col-sm-3 col-3"><input type="range" class="mt-2 custom-range" min="0" max="5" value="0" min="0" id="NoRow'+count+'" name="NoRow'+count+'"></div><div></div></div>');
        SeatClass.forEach((value,key)=>{
            $("#SeatClass"+count).append('<option class="form-control-plaintext" value="'+value.ClassName+'">'+value.ClassName+'</option>');
        });
        count++;
    }
}

addTable(Theatre);
addBranchOption();
getSeatClass();
