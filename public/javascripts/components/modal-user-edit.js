jQuery.fn.flash = function (color, duration) {
  let current = this.css('backgroundColor')
  this
    .animate({ backgroundColor: color }, duration / 2)
    .animate({ backgroundColor: current }, duration / 2)
}

class ModalUserEdit {
  constructor(modalDOM, row) {
    let self = this

    this.modalDOM = modalDOM
    this.$modal = $(modalDOM)
    this.modalInstance = M.Modal.init(this.modalDOM, {
      onOpenStart: () => {
        this.$modal.css({
          maxHeight: '500px',
          maxWidth: '450px'
        })
        this.$modal.find('#btn_update').css({marginRight: '1.25em'})
      },
      onCloseEnd: () => {
        this.$modal.find('#btn_reset').unbind()
        this.$modal.find('#btn_update').unbind()
      }
    })

    // init checkboxes
    const PRIVILEGES = "ADMIN;STUDENTS_VIEW;STUDENTS_MODIFY;LABRECORDS_VIEW;DASHBOARD_VIEW".split(/;/g)
    let data = row.data()
    let username = data[0]
    let oldPrivileges = data[2].split('<br>')

    this.$modal.find('#div_checkbox').empty()
    PRIVILEGES.forEach(priv => {
      self.$modal.find('#div_checkbox').append(
        $('<p>').append(
          $('<label>').append(
            $('<input>').attr({
              id: priv,
              type: 'checkbox',
              class: 'filled-in',
              checked: oldPrivileges.includes(priv) ? true : false
            })
          ).append(
            $('<span>').text(priv)
          )
        )
      )
    })

    // update handler
    this.$modal.find('#btn_update').click(async() => {
      try {
        // animation
        this.$modal.find('.progress').slideDown('fast')

        // create new data
        let newPrivileges = []
        for (let input of $('input:checked')) newPrivileges.push($(input).attr('id'))
        console.log(newPrivileges)

        // DOM update
        let updatedUser = await $.post(
          `/users/api/${username}/privilege?_method=PUT`, 
          { privilege: newPrivileges.join(';') })
        row.data([data[0], data[1], newPrivileges.join('<br>')].concat(row.data().slice(3, 5)))

        // animation
        M.toast({html: 'Privilege updated!', classes: 'orange', displayLength: 2000})
        $(row.node()).flash('yellow', 800)

        // update old data
        oldPrivileges = newPrivileges
        
        this.modalInstance.close()
      } catch (err) {
        // animation
        console.log('error', err)
        M.toast({html: err.responseJSON.msg, classes: 'red', displayLength: 2000})
      } finally {
        this.$modal.find('.progress').slideUp('fast')
      }
    })

    // reset event handler
    this.$modal.find('#btn_reset').click(() => {
      PRIVILEGES.forEach(priv => {
        $(`input#${priv}`).prop('checked', oldPrivileges.includes(priv))
      })
      M.toast({html: 'Form reset', classes: 'orange', displayLength: 2000})
    })

    // modified event handler
    let modifyLabel = (self, oldValue) => {
      let $label = $(self).siblings('label')
      if ($(self).val() === oldValue) {
        $label.text($label.text().replace(/ \(modified\)/g, ''))
      } else if (!$label.text().includes(' (modified')) {
        $label.text($label.text() + ' (modified)')
      }
    }
  }

  show() {
    this.modalInstance.open()
  }

}