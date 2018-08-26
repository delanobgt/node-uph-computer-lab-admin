class ModalPasswordEdit {
  constructor(modalDOM) {
    let self = this

    this.modalDOM = modalDOM
    this.$modal = $(modalDOM)
    this.modalInstance = M.Modal.init(this.modalDOM, {
      onOpenStart: () => {
        this.$modal.css({
          maxHeight: '500px',
          maxWidth: '450px'
        })
        this.$modal.find('#new_password').val('')
        this.$modal.find('#confirm_new_password').val('')
        this.$modal.find('#btn_update')
          .css({marginRight: '1.25em'})
          .attr('disabled', true)
      },
      onCloseEnd: () => {
        this.$modal.find('#new_password').unbind()
        this.$modal.find('#confirm_new_password').unbind()
        this.$modal.find('#btn_reset').unbind()
        this.$modal.find('#btn_update').unbind()
      }
    })

    // initial data

    // update handler
    this.$modal.find('#btn_update').click(async() => {
      try {
        let username = $('#username').val()
        let newPassword = this.$modal.find('#new_password').val()
        let confirmNewPassword = this.$modal.find('#confirm_new_password').val()
        if (newPassword !== confirmNewPassword) return

        // animation
        this.$modal.find('.progress').slideDown('fast')

        // AJAX
        let updatedUser = await $.post(
          `/users/api/${username}/password?_method=PUT`, 
          { password: newPassword })

        // animation
        M.toast({html: 'Password updated!', classes: 'orange', displayLength: 2000})
        
        this.modalInstance.close()
      } catch (err) {
        // animation
        console.log('error', err)
        M.toast({html: err.responseJSON.msg, classes: 'red', displayLength: 2000})
      } finally {
        this.$modal.find('.progress').slideUp('fast')
      }
    })

    // cancel event handler
    this.$modal.find('#btn_cancel').click(() => {
      this.modalInstance.close()
    })

    function onPasswordChange () {
      let newPassword = self.$modal.find('#new_password').val()
      let confirmNewPassword = self.$modal.find('#confirm_new_password').val()
      if ((newPassword + confirmNewPassword).length > 0 && newPassword == confirmNewPassword) {
        self.$modal.find('#btn_update').attr('disabled', false)
      } else {
        self.$modal.find('#btn_update').attr('disabled', true)
      }
    }
    
    this.$modal.find('#new_password').on('input', onPasswordChange)
      this.$modal.find('#confirm_new_password').on('input', onPasswordChange)
  }

  show() {
    this.modalInstance.open()
  }

}