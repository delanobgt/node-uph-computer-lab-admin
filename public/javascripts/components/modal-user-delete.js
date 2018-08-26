jQuery.fn.flash = function (color, duration) {
  let current = this.css('backgroundColor')
  this
    .animate({ backgroundColor: color }, duration / 2)
    .animate({ backgroundColor: current }, duration / 2)
}

class ModalUserDelete {
  constructor(modalDOM, row) {
    let self = this

    this.modalDOM = modalDOM
    this.$modal = $(modalDOM)
    this.modalInstance = M.Modal.init(this.modalDOM, {
      onOpenStart: () => {
        this.$modal.css({
          maxHeight: '350px',
          maxWidth: '450px'
        })
        this.$modal.find('#confirmation').val('')
        this.$modal.find('#btn_delete').css({marginRight: '1.25em'}).attr('disabled', true)
      },
      onCloseEnd: () => {
        this.$modal.find('#confirmation').unbind()
        this.$modal.find('#btn_cancel').unbind()
        this.$modal.find('#btn_delete').unbind()
      }
    })
    
    // initial data
    let data = row.data()
    let username = data[0].trim()
    let email = data[1].trim()
    
    this.$modal.find('span.confirmation').text(username)

    // confirmation text onChange event handler
    this.$modal.find('#confirmation').on('input', function () {
      if ($(this).val() === username) {
        self.$modal.find('#btn_delete').attr('disabled', false)
      } else {
        self.$modal.find('#btn_delete').attr('disabled', true)
      }
    })

    // delete event handler
    this.$modal.find('#btn_delete').click(async() => {
      try {
        // animation
        this.$modal.find('.progress').slideDown('fast')

        // AJAX delete
        await $.post(`/users/api/${username}?_method=DELETE`)

        // animation
        this.modalInstance.close()
        M.toast({html: 'User deleted!', classes: 'orange', displayLength: 2000})
        $(row.node())
          .css({backgroundColor: 'lightgray'})
          .delay(350)
          .hide('slow', () => row.remove().draw('full-hold'))
      } catch (err) {
        // animation
        console.log('error', err)
        M.toast({html: err.responseJSON.msg, classes: 'red', displayLength: 2000})
      } finally {
        this.$modal.find('.progress').slideUp('fast')
      }
    })

    // reset event handler
    this.$modal.find('#btn_cancel').click(() => {
      this.modalInstance.close()
    })
  }

  show() {
    this.modalInstance.open()
  }

}