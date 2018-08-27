jQuery.fn.flash = function (color, duration) {
  let current = this.css('backgroundColor')
  this
    .animate({ backgroundColor: color }, duration / 2)
    .animate({ backgroundColor: current }, duration / 2)
}

class ModalTokenCreate {
  constructor(modalDOM) {
    let self = this

    this.modalDOM = modalDOM
    this.$modal = $(modalDOM)
    this.modalInstance = M.Modal.init(this.modalDOM, {
      onOpenStart: () => {
        this.$modal.css({
          maxHeight: '350px',
          maxWidth: '425px'
        })
        this.$modal.find('#btn_toggle').text('START').attr('disabled', false).removeClass('red')
        this.$modal.find('#btn_okay').css({marginRight: '1.25em'}).attr('disabled', true)
        self.$modal.find(`#p_token`).text('######')
      },
      onCloseEnd: () => {
        this.$modal.find('#btn_toggle').unbind()
        this.$modal.find('#btn_okay').unbind()
      }
    })
    
    // create event handler
    this.$modal.find('#btn_okay').click(async() => {
      try {
        // animation
        this.$modal.find('.progress').slideDown('fast')

        // AJAX delete
        let newToken = self.$modal.find(`#p_token`).text()
        await $.post(`/api/tokens`, {token: newToken})

        // animation
        this.modalInstance.close()

        $('#collection_token').append(
          $(`
            <li class="collection-item">
              <div>
                <span>${newToken}</span>
                <a href="#!" class="secondary-content"><i class="token-close material-icons">close</i></a>
              </div>
            </li>
          `))
        M.toast({html: 'Token created!', classes: 'orange', displayLength: 2000})
      } catch (err) {
        // animation
        console.log('error', err)
        M.toast({html: err.responseJSON.msg, classes: 'red', displayLength: 2000})
      } finally {
        this.$modal.find('.progress').slideUp('fast')
      }
    })

    // toggle start/stop event handler
    this.$modal.find('#btn_toggle').click(function() {
      let $pToken = self.$modal.find(`#p_token`)
      // clear interval
      if (this.jackpotInterval) {
        clearInterval(this.jackpotInterval)
        delete this.jackpotInterval
        $pToken.removeClass('pulse')
        $(this).removeClass('red').text('START')
        self.$modal.find('#btn_okay').attr('disabled', false)
      } else {
        $pToken.addClass('pulse')
        $(this).addClass('red').text('STOP')
        self.$modal.find('#btn_okay').attr('disabled', true)
        this.jackpotInterval = setInterval(() => {
          let randomToken = getRandomInRange(100000, 999999)
          $pToken.text(randomToken)
        }, 50)
      }
    })

    function getRandomInRange(a, b) {
      return Math.floor(a + (Math.random()*(b-a+1)))
    }
  }

  show() {
    this.modalInstance.open()
  }

}