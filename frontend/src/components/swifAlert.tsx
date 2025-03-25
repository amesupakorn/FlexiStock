import Swal from 'sweetalert2';

  
export const handleAlert = () => {
    Swal.fire({
    icon: "success",
    title: "Order success!",
    showConfirmButton: false,
    timer: 1500
    });

};

