
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

function modal (action, target = '') {
  if (action === 'open') {
    $('.modal-container').removeClass('d-none')
    $(target).toggleClass('modal-open')
  } else if (action === 'close') {
    $('.modal-container').addClass('d-none')
    $('.modal-open').toggleClass('modal-open')
  }
}

$(document).ready(function () {
  $('.logout').click(function () {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('payload')
    window.location.href = '/'
  })

  $('[data-modal]').click(function (event) {
    event.preventDefault()

    const target = $(this).attr('data-modal')
    const isOpen = $(target).hasClass('modal-open')

    if (isOpen) {
      $('.modal-container').addClass('d-none')
      $(target).removeClass('modal-open')
    } else {
      modal('close')
      $('.modal-container').removeClass('d-none')
      $(target).addClass('modal-open')
    }
  })

  $('.modal-container').click(function (event) {
    event.preventDefault()

    $('.modal-container').toggleClass('d-none')
    $('.modal-open').removeClass('modal-open')
  })

  $('[data-dropdown="toggle"]').click(function (event) {
    event.preventDefault()

    $(this).parents('.dropdown').find('.dropdown-content').toggleClass('active')
  })

  $(document).click(function (event) {
    const targets = event.originalEvent.composedPath()
    const isDropdown = $(targets).hasClass('dropdown')
    if (!isDropdown) $('.dropdown-content.active').removeClass('active')
  })

  $('[data-print]').click(function (event) {
    event.preventDefault()

    const selector = $(this).attr('data-print')
    const contents = $(selector).clone(true, true)

    $(contents).find('[data-print-style]').each(function () {
      const styles = $(this).attr('data-print-style')
      $(this).attr('style', styles)
    })

    const html = $(contents).html()

    const child = window.open('', '', 'width=900, height=600')
    child.document.write(html)
    child.print()
    // child.close()
  })
})
