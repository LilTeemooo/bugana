
$(document).ready(function () {
  const token = sessionStorage.getItem('token')
  if (token === null) {
    window.location.href = '/'
    return
  }

  const tempItem = $('#temp-item').prop('content')
  const tempPageBtn = $('#temp-page-btn').prop('content')
  let page = 1
  let limit = parseInt($('#limit-page').val())
  let transactionCode = $('#transaction-search').val()

  async function displayStocks () {
    $('#inventory').empty()

    const params = new URLSearchParams()
    params.set('token', token)
    params.set('page', page.toString())
    params.set('limit', limit.toString())
    if (transactionCode) params.set('search', transactionCode)

    const response = await $.ajax(`/api/admin/stock/stockout.php?${params.toString()}`, {
      method: 'get',
      dataType: 'json'
    })
    if (!response.success) return

    $('#pages').empty()
    if (response.prev) $('[data-prev]').removeClass('d-none').attr('data-page', page - 1)
    else $('[data-prev]').addClass('d-none')

    if (response.next) $('[data-next]').removeClass('d-none').attr('data-page', page + 1)
    else $('[data-next]').addClass('d-none')

    let i = page > 2 ? page - 2 : 1
    if (i > 2) $('#pages').append('<span class="mr-2">...</span>')
    $('[data-page="1"]').toggleClass('active', page === i && page === 1)

    for (i; i < page + 3; i++) {
      if (i <= 1 || i > response.pages) continue

      const elem = $(tempPageBtn).clone(true, true)
      $(elem).find('[data-page]').attr('data-page', i).text(i)
      if (page === i) $(elem).find('[data-page]').addClass('active')
      $('#pages').append(elem)
    }

    if (i <= response.pages) {
      const elem = $(tempPageBtn).clone(true, true)
      $(elem).find('[data-page]').attr('data-page', response.pages).text(response.pages)
      if (i !== response.pages) $('#pages').append('<span class="mr-2">...</span>')
      $('#pages').append(elem)
    }

    for (let i = 0; i < response.stocks.length; i++) {
      const stock = response.stocks[i]
      const elem = $(tempItem).clone(true, true)

      let category = ''
      let status = ''

      switch (stock.product.category) {
        case 'vegetable':
          category = 'Vegetable'
          break

        case 'root-crops':
          category = 'Root Crops'
          break

        case 'fruits':
          category = 'Fruits'
          break
      }

      switch (stock.status) {
        case 'sold':
          status = 'Sold'
          break
        
        case 'perished':
          status = 'Perished'
          break
      }

      $(elem).find('.item-tx-code').text(stock.transaction_code)
      $(elem).find('.item-farmer-id').text(stock.product.user)
      $(elem).find('.item-category').text(category)
      $(elem).find('.item-product-name').text(stock.product.name)
      $(elem).find('.item-stock-out-date').text(stock.date)
      $(elem).find('.item-quantity').text(parseFloat(stock.quantity))
      $(elem).find('.item-price').text(stock.product.price)
      $(elem).find('.item-product-revenue').text(stock.revenue)
      $(elem).find('.item-status').text(status)
      $('#inventory').append(elem)
    }
  }

  let codeTimer = null
  let limitTimer = null

  $('#transaction-search').on('keyup', function () {
    const value = $(this).val()
    clearTimeout(codeTimer)
    codeTimer = setTimeout(function () {
      transactionCode = value
      page = 1
      displayStocks()
    }, 1250)
  })

  $('#transaction-search').on('keydown', function () {
    if (codeTimer) clearTimeout(codeTimer)
  })

  $('#limit-page').on('keyup', function () {
    const value = $(this).val()
    clearTimeout(limitTimer)
    limitTimer = setTimeout(function () {
      limit = parseInt(value)
      page = 1
      displayStocks()
    }, 1250)
  })

  $('#limit-page').on('keydown', function () {
    if (limitTimer) clearTimeout(limitTimer)
  })

  $(document).on('click', '[data-page]', function (event) {
    const target = event.currentTarget
    const value = $(target).attr('data-page')
    page = parseInt(value)
    displayStocks()
  })

  displayStocks()
})
