$('.nshowing').text($('.program-row .poster-card').length);
$('#popup-close, .popup-area').click(function(e){
    if (e.target !== this&&this!=$('#popup-close')[0])return;
    $('.web-body').removeClass('overlay');
    $(this).closest('.popup-area').hide();
});
$('button').click(function(){
    let popupId = $(this).data('popup');
    if(popupId){
        $('.web-body').addClass('overlay');
        $('#'+popupId).show();
    }
})
$('.logo').dblclick(function(){
    $('.content-box').toggleClass('special-mode');
});