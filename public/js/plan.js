var Theatre = [{Name:'Add New Theatre',Branch:'NULL'}];
var SeatClass,Height,Width;
var count=1;
var renderCount = [1,1,1,1];

function addTable(data) {
    data.forEach((value, key) => {
        $("#MyTableTr").append('<tr><th class="text-white" scope="col">'+value.Name+'</th></tr>');
    });
    
}

function planH(){
    Height = document.getElementById("Height").value;
    $('#showH')[0].childNodes[0].data = 'Plan Height '+Height+' m.';
    console.log(Height);
}

function planW(){
    Width = document.getElementById("Width").value;
    $('#showW')[0].childNodes[0].data = 'Plan Width '+Width+' m.';
    console.log(Width);
}

function saveTheatre(){
    var data = {Name:$('#NameTheatre').val(), Branch:$('#Branch').val()}
    if(data.Name!=""){
        $('#NameTheatre').val('');
        addTable([data]);
        Theatre.push(data);
    }
}

function addBranchOption(){
    $.get('/fetchBranchData',(data)=>{
            data.forEach((value,key)=>{
            $("#Branch").append('<option class="form-control-plaintext" value="'+value.BranchNo+'">'+value.BranchName+'</option>');
        })
    });
}

function appendSeatClass(number) {
    SeatClass.forEach((value,key)=>{
        $("#SeatClass"+number).append('<option class="form-control-plaintext" value="'+value.ClassName+'">'+value.ClassName+'</option>');
    });   
}

function getSeatClass(){
    $.get('/fetchSeatClasshData',(data)=>{
            SeatClass = data;
            appendSeatClass(1);
    });
}

function addSeat() {
    if(count<=4){
        $("#adj").append('<div class="form-group row mb-0"><label for="SeatClass'+count+'" class="col-md-2 mt-2 mb-0" style="padding-left: 13px;">Seat Class '+count+'</label><div class="col-md-3 col-sm-3 col-3"><select name="SeatClass'+count+'" id="SeatClass'+count+'" class="form-control-plaintext text-white"></select></div><label for="NoRow'+count+'" class="col-md-2 col-sm-3 col-3 mt-2 mb-0">No.Row</label><div class="col-md-3 col-sm-3 col-3"><button type="button" onclick="deleteSeatTH('+count+')" class="btn text-center text-white btn-white-rounded m-0 pl-2" style="width: 20px !important; min-width: 0px;" >-</button><input type="number" class="mt-2 custom-range text-white" readonly="readonly" style="text-align: center;width: 27px;" min="0" value="0" id="NoRow'+count+'" name="NoRow'+count+'"><button type="button" onclick="appendSeatTH('+count+')" class="btn text-center text-white btn-white-rounded m-0 pl-2" style="width: 20px !important; min-width: 0px;" >+</button></div><div></div></div>');
        if(count>1)appendSeatClass(count);
        count++;
    }
}

function changeValR(op,num) {
    var value = parseInt($('#NoRow'+num).val());
    if(op===1){
        $('#NoRow'+num).val(value+1);
    }
    else{
        $('#NoRow'+num).val(value-1);
    }
}

function appendSeatTH(num){
    var seat = '<div id="render'+num+'R'+renderCount[num-1]+'">'
    for (let i = 0; i < (Width*80)/SeatClass[num-1].Width; i++) {
        seat += 'A';
    }
    seat += '</div>'
    //console.log(seat);
    $('#render'+num).append(seat);
    renderCount[num-1]++;
    changeValR(1,num);
}

function deleteSeatTH(num) {
    if(renderCount[num-1]>1){
        renderCount[num-1]--;
        $('#render'+num+'R'+renderCount[num-1]).remove();
        changeValR(0,num);
    }
}
addSeat();
addTable(Theatre);
addBranchOption();
getSeatClass();
