export default function goTo (elements, delta = 0) {
  $(elements).click(function () {
    let scrollEl = $(this).attr('href')

    if ($(scrollEl).length !== 0) {
      $('html, body').animate({scrollTop: $(scrollEl).offset().top + delta}, 700)
    }

    return false
  })
}
