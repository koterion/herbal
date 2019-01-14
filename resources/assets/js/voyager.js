require('./components/chart')

tinymce.init({
  menubar: false,
  selector: 'textarea.richTextBox',
  skin: 'voyager',
  min_height: 600,
  resize: 'vertical',
  plugins: 'paste, link, image, code, youtube, giphy, table, textcolor, lists',
  extended_valid_elements: 'input[id|name|value|type|class|style|required|placeholder|autocomplete|onclick]',
  file_browser_callback: function (field_name, url, type, win) {
    if (type === 'image') {
      $('#upload_file').trigger('click')
    }
  },
  toolbar: 'styleselect bold italic underline | forecolor backcolor | alignleft aligncenter alignright | bullist numlist outdent indent | link image table youtube giphy | code',
  convert_urls: false,
  image_caption: true,
  image_title: true
})

$.each($('textarea'), function () {
  if ($(this).attr('name') === 'excerpt') {
    let area = $('textarea[name=excerpt]')
    area.after('<div class="form-control except__num">0</div>')
    let num = $('.except__num')
    num.text(area.val().length)

    area.on('keyup', function () {
      let length = $(this).val().length
      num.text(length)

      if (length > 160) {
        num.addClass('error')
        $(this).addClass('error')
      } else {
        num.removeClass('error')
        $(this).removeClass('error')
      }
    })
  }
})
