import { Trash2 } from "lucide-react";

interface DeleteButtonProps {
  onClick: () => void;
  disabled: boolean;
}

const DeleteButton = ({ onClick, disabled }: DeleteButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`rounded-full p-4 transition-all duration-500 ${
        disabled ? "bg-gray-500" : " bg-red-500"
      } ${
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      } rounded-full p-2 transition-colors duration-300 ease-in-out`}
      disabled={disabled}
    >
      <Trash2 />
    </button>
  );
};

export default DeleteButton;
