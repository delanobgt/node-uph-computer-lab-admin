
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.redirect('/users/auth')
  }
}

function havePermission(...mandatoryPrivileges) {
  return function(req, res, next) {
    if (!req.session.passport) return res.redirect('back')
    
    let user = req.session.passport.user
    let userPrivileges = user.privilege.split(/;/g)
    if (req.isAuthenticated() && isFirstInsideSecond(mandatoryPrivileges, userPrivileges)) {
      next()
    } else {
      res.redirect('back')
    }
  }
}

function isFirstInsideSecond(A, B) {
  A = A || []
  B = B || []

  return A.filter(a => B.includes(a)).length == A.length
}

module.exports = {
  isLoggedIn,
  havePermission
}