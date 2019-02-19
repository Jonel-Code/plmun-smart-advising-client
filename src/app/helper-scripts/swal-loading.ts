import swal from 'sweetalert';

export function swal_load(message = 'currently sending data please wait.') {
    swal({
        title: 'SENDING DATA',
        text: message,
        closeOnEsc: false,
        closeOnClickOutside: false,
        buttons: [false]
    });
}