import _Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const Swal = withReactContent(_Swal)

const Toast = Swal.mixin({
    toast: true,
    position: 'bottom-end',
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

export {Toast}

export default Swal