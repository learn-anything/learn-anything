import { Box, Text } from "@chakra-ui/core"

// flag to show full, only host url
export const Link = ({ link }) => {
  return (
    <Box
      mb={1}
      overflow="hidden"
      maxW="sm"
      p={1}
      rounded="md"
      borderWidth="2px"
      border="text-gray-600"
    >
      <Text>{link.title}</Text>
      <Text className="text-gray-600">{link.url}</Text>
    </Box>
  )
}
