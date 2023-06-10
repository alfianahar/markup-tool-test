import { Trash2 } from "lucide-react";

interface DeleteButtonProps {
  onClick: () => void;
  disabled: boolean;
}

const DeleteButton = ({ onClick, disabled }: DeleteButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={` ${disabled ? "" : " bg-red-500"} ${
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      } rounded-xl p-2 transition-all duration-150 ease-in`}
      disabled={disabled}
    >
      <Trash2 size={22} />
    </button>
  );
};

export default DeleteButton;
