import { Flex } from "@chakra-ui/core"

// flag to show full, only host url
export const Link = ({ link }) => {
  return (
    <Flex mb={1} overflow="hidden" maxW="sm" p={1} borderWidth="1px" border="text-gray-600">
      <span>{link.title}</span>
      <span className="text-gray-600">{link.url}</span>
    </Flex>
  )
}

{
  /* <Box bg="tomato" w="100%" p={4} color="white">
  This is the Box
</Box> */
}
