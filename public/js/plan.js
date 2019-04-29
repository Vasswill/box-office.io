var Theatre = [{Name:'Add New Theatre',Branch:'NULL'}];
var SeatClass,Height,Width;
var count=1
    Thcount=0
    nowTH=0;
var renderCount = [1,1,1,1];
$('.alert').hide();

function addTable(data) {
    data.forEach((value, key) => {
        var tableRowappend = '<tr id="Th'+Thcount+'" class="default-mouse" ><th onclick="editTh('+Thcount+')" class="text-white pl-3" scope="col">'+value.Name+'</th>'
        if(Thcount>0) tableRowappend += '<th class="text-white" onclick="removeTh('+Thcount+')" scope="col">X</th>';
        else tableRowappend += '<th onclick="editTh(0)"></th>';
        tableRowappend += '</tr>';
        Thcount++;
        $("#MyTableTr").append(tableRowappend);
    });
    
}

function planH(){
    Height = document.getElementById("Height").value;
    $('#showH')[0].childNodes[0].data = 'Plan Height '+Height+' m.';
    //console.log(Height);
}

function planW(){
    Width = document.getElementById("Width").value;
    $('#showW')[0].childNodes[0].data = 'Plan Width '+Width+' m.';
    //console.log(Width);
}

function reRenderTHTable(){
    for(var i = Thcount-1 ; i >= 0 ; i--) {
        $('#Th'+i).remove();
        Thcount--;
    }
    addTable(Theatre);
}

function removeTh(id){
    var THName = $('#Th'+id)[0].childNodes[0].innerHTML;
    Theatre.splice(Theatre.findIndex((val)=>{return val.Name==THName}),1);
    reRenderTHTable();
}

function editTh(id){
    $('#Th'+id).addClass('bg-secondary').siblings().removeClass('bg-secondary');
    if(id>0){
        $('#NameTheatre').val(Theatre[id].Name);
        $('#Branch').val(Theatre[id].Branch);
    }
    else $('#NameTheatre').val('');
    nowTH=id;
}

function saveTheatre(){
    var data = {Name:$('#NameTheatre').val(), Branch:$('#Branch').val()}
    if(data.Name!=""){
        $('#NameTheatre').val('');
        if(nowTH==0){
            addTable([data]);
            Theatre.push(data);
        }
        else {
            Theatre[nowTH] = data;
            reRenderTHTable();
        }
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
        $("#adj").append('<div id="SeatForm'+count+'" class="form-group row mb-0"><label for="SeatClass'+count+'" class="col-md-2 mt-2 mb-0" style="padding-left: 13px;">Seat Class '+count+'</label><div class="col-md-3 col-sm-3 col-3"><select name="SeatClass'+count+'" id="SeatClass'+count+'" onchange="clearSeat('+count+')" class="form-control-plaintext text-white"></select></div><label for="NoRow'+count+'" class="col-md-2 col-sm-3 col-3 mt-2 mb-0">No.Row</label><div class="col-md-3 col-sm-3 col-3"><button type="button" onclick="deleteSeatTH('+count+')" class="btn text-center text-white btn-white-rounded m-0 pl-2" style="width: 20px !important; min-width: 0px;" >-</button><input type="number" class="mt-2 custom-range text-white" readonly="readonly" style="text-align: center;width: 27px; border: 0px;" min="0" value="0" id="NoRow'+count+'" name="NoRow'+count+'"><button type="button" onclick="appendSeatTH('+count+')" class="btn text-center text-white btn-white-rounded m-0 pl-2" style="width: 24px !important; min-width: 0px;" >+</button></div><div></div></div>');
        if(count>1)appendSeatClass(count);
        count++;
    }
}

function removeSeat() {
    if(count>2) {
        clearSeat(--count);
        $('#SeatForm'+count).remove();
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
    var use=0,min=9999;
    if(SeatClass != null){
        for(var i = 1; i < count; i++){
            var seatHeight = SeatClass.find((val)=>{ return val.ClassName==$('#SeatClass'+i).val()}).Height;
            //console.log(temp+"*"+(renderCount[i-1]-1));
            use += (seatHeight*(renderCount[i-1]-1));
        }

        if(Height-use>=SeatClass.find((val)=>{ return val.ClassName==$('#SeatClass'+num).val()}).Height){
            var seat = '<div id="render'+num+'R'+renderCount[num-1]+'" class="container-fluid pl-0 pr-0 mt-3 mb-3 d-flex justify-content-between" >'
            for (let i = 0; i < Width/SeatClass.find((val)=>{ return val.ClassName==$('#SeatClass'+num).val()}).Width; i++) {
                seat += '<span class="dot ml-1 mr-1"></span>';
            }
            seat += '</div>'
            //console.log(seat);
            $('#render'+num).append(seat);
            renderCount[num-1]++;
            changeValR(1,num);
        }
    }
}

$(document).on("keypress", "form", function(event) { 
    return event.keyCode != 13;
});

function pageRedirect() {
    window.location.href = "http://localhost:8080/plan";
} 

function deleteSeatTH(num) {
    if(renderCount[num-1]>1){
        renderCount[num-1]--;
        $('#render'+num+'R'+renderCount[num-1]).remove();
        changeValR(0,num);
    }
}

function clearSeat(num) {
    while(renderCount[num-1]>1){
        deleteSeatTH(num);
    }
}

function sentForm() {
    var temp = Theatre.slice(1,Theatre.length);
    //temp.shift();
    var payload = {
        PlanName: $('#Name').val(),
        PlanHeight: Height,
        PlanWidth: Width,
        SeatClass1: $('#SeatClass1').val(),
        NoRow1: $('#NoRow1').val(),
        SeatClass2: $('#SeatClass2').val(),
        NoRow2: $('#NoRow2').val(),
        SeatClass3: $('#SeatClass3').val(),
        NoRow3: $('#NoRow3').val(),
        SeatClass4: $('#SeatClass4').val(),
        NoRow4: $('#NoRow4').val(),
        Theater: temp
    };
    if(payload.PlanName!='') $.post('/planAdd',payload,(res)=>{
        pageRedirect();
    });
    else $('.alert').show();
}

addSeat();
addTable(Theatre);
addBranchOption();
getSeatClass();
