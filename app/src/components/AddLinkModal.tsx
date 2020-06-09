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
import { Plus } from "./icons"

const AddLinkModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { handleSubmit, register } = useForm()

  const [addLinkResult, addLink] = useMutation(createLinkMutation)

  const onCreateSite = (values) => {
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
      <span onClick={onOpen} style={{ cursor: "pointer" }}>
        <Plus size={28} />
      </span>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(onCreateSite)}>
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
