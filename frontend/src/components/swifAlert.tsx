import Swal from 'sweetalert2';

export const handleAlert = ({
    title = "Success!",
    icon = "success",
    timer = 1500,
    showConfirmButton = false
  }: {
    title?: string;
    icon?: "success" | "error" | "warning" | "info" | "question";
    timer?: number;
    showConfirmButton?: boolean;
  }) => {
    Swal.fire({
      icon,
      title,
      showConfirmButton,
      timer,
    });
  };