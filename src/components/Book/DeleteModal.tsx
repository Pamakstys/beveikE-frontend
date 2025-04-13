import { Dialog, Button } from "@chakra-ui/react";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteModal = ({ isOpen, onClose, onConfirm }: DeleteModalProps) => {
  return (
    <Dialog.Root open={isOpen} onClose={onClose}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content style={{ background:"white"}}>
          <Dialog.Header>
            <Dialog.Title>Confirm Deletion</Dialog.Title>
          </Dialog.Header>

          <Dialog.Body>
            Are you sure you want to delete this book?
          </Dialog.Body>

          <Dialog.Footer display="flex" justifyContent="flex-end" gap="1rem">
            <Button onClick={onClose} bg={"blue"} color={"white"}>Cancel</Button>
            <Button colorScheme="red" onClick={onConfirm} bg={"red"} color={"white"}>Delete</Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};

export default DeleteModal;
