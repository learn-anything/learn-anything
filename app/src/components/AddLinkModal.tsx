import { useForm } from "react-hook-form"
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  FormControl,
  FormLabel,
  Button,
  Input,
  useDisclosure,
} from "@chakra-ui/core"

import { useKeyBindings } from "../lib/key"

import { useMutation } from "urql"
import { createLinkMutation } from "../lib/mutations"

const AddLinkModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { handleSubmit, register } = useForm()

  const [addLinkResult, addLink] = useMutation(createLinkMutation)

  const onCreateLink = (values) => {
    addLink({ object: values })
    onClose()
  }

  useKeyBindings({
    KeyN: {
      fn: () => onOpen(),
    },
  })

  return (
    <>
      <Button
        backgroundColor="gray.900"
        color="white"
        fontWeight="medium"
        _hover={{ bg: "gray.700" }}
        _active={{
          bg: "gray.800",
          transform: "scale(0.95)",
        }}
        onClick={onOpen}
      >
        + Add Link
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(onCreateLink)}>
          <ModalHeader fontWeight="bold">Add Link</ModalHeader>
          <ModalBody pb={6}>
            <FormControl isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                name="name"
                ref={register({
                  required: "Required",
                })}
              />
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>Link</FormLabel>
              <Input
                name="url"
                ref={register({
                  required: "Required",
                })}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Comment</FormLabel>
              <Input name="comment" ref={register()} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button fontWeight="medium" type="submit">
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default AddLinkModal
