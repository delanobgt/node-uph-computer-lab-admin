class CollapsibleCreate {

  constructor(collapsibleDOM, table) {
    let self = this

    this.collapsibleDOM = collapsibleDOM
    this.$collapsible = $(collapsibleDOM)
    this.collapsibleInstance = M.Collapsible.init(collapsibleDOM, {
      onOpenStart: () => {
        resetForm()
        fetchStudyPrograms()
      },
      onCloseEnd: () => {
        resetForm()
      }
    })

    this.$select = this.$collapsible.find('select')
    this.selectDOM = this.$select[0]
    this.selectInstance = M.FormSelect.init(this.selectDOM, {})

    // create event handler
    this.$collapsible.find('#btn_create').click(async() => {
      let studentID = this.$collapsible.find('#student_id').val().trim()
      let name = this.$collapsible.find('#name').val().trim()
      let studyProgram = this.$collapsible.find('.selected span').text().trim()
      if (studentID === '' || name === '') {
        M.toast({html: 'Fields can\'t be empty', classes: 'orange', displayLength: 2000})
        return
      }
      try {
        // animation
        this.$collapsible.find('.progress').slideDown('fast')

        // AJAX create
        let newStudent = await $.post(`/api/students`, 
            { studentID, name, studyProgram })
        // DOM update
        table.row
          .add([studentID, name, studyProgram, '<i class="my-edit material-icons">border_color</i>',
          '<i class="my-close material-icons">close</i>'])
          .draw('full-hold')

        // animation
        M.toast({html: 'New Student created!', classes: 'orange', displayLength: 2000})
        self.collapsibleInstance.close(0)
        resetForm()
      } catch (err) {
        // animation
        console.log('error', err)
        M.toast({html: err.responseJSON.msg, classes: 'red', displayLength: 2000})
      } finally {
        this.$collapsible.find('.progress').slideUp('fast')
      }
    })

    // reset event handler
    this.$collapsible.find('#btn_cancel').click(() => {
      this.collapsibleInstance.close(0)
      resetForm()
    })

    function resetForm() {
      self.$collapsible.find('#student_id').val('')
      self.$collapsible.find('#name').val('')
      self.$select.empty().append($('<option>').text('Loading Study Programs..').attr('disabled', true))
      self.selectInstance = M.FormSelect.init(self.selectDOM, {})
    }

    function fetchStudyPrograms() {
      $.get('/api/study-programs')
        .then(studyPrograms => {
          self.$select.empty()
          studyPrograms.forEach(studyProgram => {
            let $newOption = $('<option>').attr('value', studyProgram.name).text(studyProgram.name)
            self.$select.append($newOption)
          })
          self.selectInstance = M.FormSelect.init(self.selectDOM, {})
        })
        .catch(err => {
          console.log(err)
          M.toast({html: 'Failed to fetch Study Programs', classes: 'red', displayLength: 2000})
        })
    }

  }

}