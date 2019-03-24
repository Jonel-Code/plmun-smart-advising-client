import swal from 'sweetalert';

const imageURL = '../../assets/loading.io.spinner.coffee.svg';


export function swal_load(message = 'currently sending data please wait.') {
    swal({
        title: 'SENDING DATA',
        text: message,
        closeOnEsc: false,
        closeOnClickOutside: false,
        buttons: [false],
        icon: imageURL
    });
}

export function swal_close() {
    setTimeout(() => {
        swal.close();
    });

}
