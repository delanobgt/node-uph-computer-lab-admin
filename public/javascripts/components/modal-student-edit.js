jQuery.fn.flash = function (color, duration) {
  let current = this.css('backgroundColor')
  this
    .animate({ backgroundColor: color }, duration / 2)
    .animate({ backgroundColor: current }, duration / 2)
}

class ModalStudentEdit {
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
        this.$modal.find('label').not('label[for="study_program"]').addClass('active')
      },
      onCloseEnd: () => {
        this.$modal.find('#student_id').unbind()
        this.$modal.find('#name').unbind()
        this.$modal.find('#div_select').unbind()
        this.$modal.find('#btn_reset').unbind()
        this.$modal.find('#btn_update').unbind()
      }
    })
    
    // initial data
    let data = row.data()
    let oldStudentID = data[0].trim()
    let oldName = data[1].trim()
    let oldStudyProgram = data[2].trim()
    this.$modal.find('#student_id').val(oldStudentID)
    this.$modal.find('#name').val(oldName)

    this.$select = this.$modal.find('select')
    this.selectDOM = this.$select[0]
    this.selectInstance = M.FormSelect.init(this.selectDOM, {})

    this.$select.empty().append($('<option>').text('Loading Study Programs..'))
    $.get('/api/study-programs')
      .then(studyPrograms => {
        this.$select.empty()
        studyPrograms.forEach(studyProgram => {
          let $newOption = $('<option>').attr('value', studyProgram.name).text(studyProgram.name)
          this.$select.append($newOption)
        })
        this.selectInstance = M.FormSelect.init(this.selectDOM, {})

        this.$modal.find('span').click(function () {
          let $label = $(this).parent().parent().parent().siblings('label')
          console.log($label)
          if ($(this).text() === oldStudyProgram) {
            $label.text($label.text().replace(/ \(modified\)/g, ''))
          } else if (!$label.text().includes(' (modified')) {
            $label.text($label.text() + ' (modified)')
          }
        })
        this.$modal.find(`span:contains('${oldStudyProgram}')`).click()
      })
      .catch(err => {
        M.toast({html: 'Failed to fetch Study Programs', classes: 'red', displayLength: 2000})
        console.log(err)
      })
    
    // update handler
    this.$modal.find('#btn_update').click(async() => {
      let newStudentID = this.$modal.find('#student_id').val().trim()
      let newName = this.$modal.find('#name').val().trim()
      let newStudyProgram = this.$modal.find('.selected span').text().trim()
      if (newStudentID === '' || newName === '') {
        M.toast({html: 'Fields can\'t be empty', classes: 'orange', displayLength: 2000})
        return
      }
      try {
        // animation
        this.$modal.find('.progress').slideDown('fast')

        // DOM update
        let updatedStudent = await $.post(`/students/api/${oldStudentID}?_method=PUT`, 
            { newStudentID, newName, newStudyProgram })
        let newData = [newStudentID, newName, newStudyProgram].concat(row.data().slice(3, 5))
        row.data(newData)

        // animation
        M.toast({html: 'Student updated!', classes: 'orange', displayLength: 2000})
        $(row.node()).flash('yellow', 800)

        // update old data
        oldStudentID = newStudentID
        oldName = newName
        oldStudyProgram = newStudyProgram
        this.$modal.find('#student_id').trigger('input')
        this.$modal.find('#name').trigger('input')
        this.$modal.find(`span:contains('${oldStudyProgram}')`).click()

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
      this.$modal.find('#student_id').val(oldStudentID).trigger('input')
      this.$modal.find('#name').val(oldName).trigger('input')
      this.$modal.find(`span:contains('${oldStudyProgram}')`).click()
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
    this.$modal.find('#student_id').on('input', function () {
      modifyLabel(this, oldStudentID)
    })
    this.$modal.find('#name').on('input', function () {
      modifyLabel(this, oldName)
    })
  }

  show() {
    this.modalInstance.open()
  }

}