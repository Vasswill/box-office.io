//var Theatre = [{Name:'Add New Theatre',Branch:'NULL',Detail:{Type:'Create',Old:''}},{Name:'TH01',Branch:'1',Detail:{Type:'Load',Old:''}},{Name:'TH02',Branch:'2',Detail:{Type:'Load',Old:''}},{Name:'TH03',Branch:'3',Detail:{Type:'Load',Old:''}},{Name:'TH04',Branch:'4',Detail:{Type:'Load',Old:''}}];
var Theatre = [{Name:'Add New Theatre',Branch:'NULL',Detail:{Type:'Create',Old:''}}];
var SeatClass,PlanHeight=0,PlanWidth=0;
var count=1
    Thcount=0
    nowTH=0;
var renderCount = [1,1,1,1];

//-------------------------------------Theatre Function--------------------------------------------

function addTable(data) {
    data.forEach((value, key) => {
        var tableRowappend = '<tr id="Th'+Thcount+'" class="default-mouse" ><th onclick="editTh('+Thcount+')" class="text-white pl-3" scope="col">'+value.Name+'</th>'
        if(Thcount>0) tableRowappend += '<th class="text-white" onclick="removeTh('+Thcount+')" scope="col">X</th>';
        else tableRowappend += '<th onclick="editTh(0)"></th>';
        tableRowappend += '</tr>';
        Thcount++;
        if(value.Detail.Type!='Delete')$("#MyTableTr").append(tableRowappend);
    });
    $('#Th'+nowTH).addClass('bg-secondary').siblings().removeClass('bg-secondary');
}

function reRenderTHTable(){
    $('.alert').hide()
    for(var i = Thcount-1 ; i >= 0 ; i--) {
        $('#Th'+i).remove();
        Thcount--;
    }
    addTable(Theatre);
}

function removeTh(id){
    var THName = $('#Th'+id)[0].childNodes[0].innerHTML;
    switch(Theatre[id].Detail.Type){
        case 'Create' : Theatre.splice(Theatre.findIndex((val)=>{return val.Name==THName}),1); break;
        case 'Load' : Theatre[id].Detail = {Type: 'Delete',Old: Theatre[id].Name}; break;
        case 'Update' : Theatre[id].Detail.Type = 'Delete'; break;
    }
    $('#NameTheatre').val('');
    $('#TheatreBranch').val('');
    reRenderTHTable();
    nowTH = 0;
}

function editTh(id){
    $('#Th'+id).addClass('bg-secondary').siblings().removeClass('bg-secondary');
    if(id>0){
        $('#NameTheatre').val(Theatre[id].Name);
        $('#TheatreBranch').val(Theatre[id].Branch);
    }
    else $('#NameTheatre').val('');
    nowTH=id;
}

function saveTheatre(){
    var data = {Name:$('#NameTheatre').val(), Branch:$('#TheatreBranch').val(),Detail:{Type:'Create',Old:''}}
    if(data.Name!='' && data.Branch){
        $('#NameTheatre').val('');
        if(nowTH==0){
            addTable([data]);
            Theatre.push(data);
        }
        else {
            switch (Theatre[nowTH].Detail.Type){
                case 'Load': data.Detail = {Type:'Update',Old:Theatre[nowTH].Name}; break;
                case 'Update' : data.Detail = Theatre[nowTH].Detail; break;
                default : break;
            }
            Theatre[nowTH] = data;
            reRenderTHTable();
        }
        $('#TH-success').fadeTo(2000, 500).slideUp(500, function(){
            $(this).hide(); 
        });
    }
    else $('#TH-alert').fadeTo(2000, 500).slideUp(500, function(){
        $(this).hide(); 
    });
}

function addBranchOption(){
    var payload = { table : "branch" };
    $.post('/fetchData',payload,(data)=>{
            data.forEach((value,key)=>{
            $("#TheatreBranch").append('<option class="form-control-plaintext" value="'+value.BranchNo+'">'+value.BranchName+'</option>');
        })
    });
}

//-------------------------------------Plan Function--------------------------------------------

function planH(){
    PlanHeight = parseFloat(document.getElementById("PlanHeight").value);
    $('#showH')[0].childNodes[0].data = 'Plan Height '+PlanHeight+' m.';
    document.getElementById("PlanHeight").value = PlanHeight;
    //console.log(Height);
}

function planW(){
    PlanWidth = parseFloat(document.getElementById("PlanWidth").value);
    $('#showW')[0].childNodes[0].data = 'Plan Width '+PlanWidth+' m.';
    document.getElementById("PlanWidth").value = PlanWidth;
    reRenderSeat();
    //console.log(Width);
}

function appendSeatClass(number) {
    SeatClass.forEach((value,key)=>{
        $("#SeatClass"+number).append('<option class="form-control-plaintext" value="'+value.ClassName+'">'+value.ClassName+'</option>');
    });   
}

function getSeatClass(){
    var payload = { table : "seatclass" };
    $.post('/fetchData',payload,(data)=>{
            SeatClass = data;
            appendSeatClass(1);
    });
}

function addSeat() {
    if(count<=4){
        $("#adj").append('<div id="SeatForm'+count+'" class="form-group row mb-0"><label for="SeatClass'+count+'" class="col-md-2 mt-2 mb-0" style="padding-left: 13px;">Seat Class '+count+'</label><div class="col-md-3 col-sm-3 col-3"><select name="SeatClass'+count+'" id="SeatClass'+count+'" onchange="reRenderSeat()" class="form-control-plaintext text-white"></select></div><label for="NoRow'+count+'" class="col-md-2 col-sm-3 col-3 mt-2 mb-0">No.Row</label><div class="col-md-3 col-sm-3 col-3"><button type="button" onclick="deleteSeatTH('+count+')" class="btn text-center text-white btn-white-rounded m-0 pl-2" style="width: 20px !important; min-width: 0px;" >-</button><input type="number" class="mt-2 custom-range text-white" readonly="readonly" style="text-align: center;width: 27px; border: 0px;" min="0" value="0" id="NoRow'+count+'" name="NoRow'+count+'"><button type="button" onclick="appendSeatTH('+count+')" class="btn text-center text-white btn-white-rounded m-0 pl-2" style="width: 24px !important; min-width: 0px;" >+</button></div><div></div></div>');
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
    var value = parseFloat($('#NoRow'+num).val());
    if(op===1){
        $('#NoRow'+num).val(value+1);
    }
    else{
        $('#NoRow'+num).val(value-1);
    }
}

function appendSeatTH(num){
    var use=0,min=9999;
    if(SeatClass != null && PlanWidth>0){
        for(var i = 1; i < count; i++){
            var seatHeight = SeatClass.find((val)=>{ return val.ClassName==$('#SeatClass'+i).val()}).PlanHeight;
            //console.log(temp+"*"+(renderCount[i-1]-1));
            use += (seatHeight*(renderCount[i-1]-1));
        }
        var SeatClassData = SeatClass.find((val)=>{ return val.ClassName==$('#SeatClass'+num).val()});
        if(PlanHeight-use>=SeatClassData.Height && SeatClassData.Width<=PlanWidth){
            var seat = '<div id="render'+num+'R'+renderCount[num-1]+'" class="container-fluid pl-0 pr-0 mt-3 mb-3 d-flex justify-content-between" >'
            for (let i = 0; i < PlanWidth/SeatClassData.Width; i++) {
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

function reRenderSeat() {
    let tempCount = [...renderCount];
    for(var i=count; i>1; i--){
        clearSeat(i-1);
        for(var j=1; j<tempCount[i-2]; j++){
            appendSeatTH(i-1);
        }
    }
}

//-------------------------------------Plan Form Function--------------------------------------------

$(document).on("keypress", "form", function(event) { 
    return event.keyCode != 13;
});

function pageRedirect() {
    window.location.href = "http://localhost:8080/plan";
} 

function sentPlanForm() {
    var temp = [...Theatre];
    //temp.shift();
    var payload = {
        PlanName: $('#PalnName').val(),
        PlanHeight: PlanHeight,
        PlanWidth: PlanWidth,
        SeatClass1: $('#SeatClass1').val(),
        NoRow1: $('#NoRow1').val(),
        SeatClass2: $('#SeatClass2').val(),
        NoRow2: $('#NoRow2').val(),
        SeatClass3: $('#SeatClass3').val(),
        NoRow3: $('#NoRow3').val(),
        SeatClass4: $('#SeatClass4').val(),
        NoRow4: $('#NoRow4').val(),
        Theatre: temp.slice(1,temp.length)
    };
    if(payload.PlanName!='' && PlanHeight>0 && PlanWidth>0) $.post('/plan',payload,(res)=>{
        $('#plan-success').fadeTo(2000, 500).slideUp(500, function(){
            $(this).hide(); 
        });
        //pageRedirect();
    });
    else $('#plan-warning').fadeTo(2000, 500).slideUp(500, function(){
        $(this).hide(); 
    });
}

addSeat();
addTable(Theatre);
addBranchOption();
getSeatClass();
