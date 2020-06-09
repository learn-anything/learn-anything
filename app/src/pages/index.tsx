import { useAuth } from "../lib/auth"
import { Flex, Icon, Tag, Button, Stack } from "@chakra-ui/core"

const Home = () => {
  const auth = useAuth()

  return (
    <Flex
      as="main"
      direction="column"
      align="center"
      justify="center"
      h="100vh"
    >
      <Icon name="logo" size="64px" />
      {auth.user ? (
        <Tag mt={4}>WIP</Tag>
      ) : (
        <Stack mt={4} isInline>
          <Button size="sm" onClick={(e) => auth.signinWithGitHub()}>
            GitHub
          </Button>
          <Button isDisabled size="sm" onClick={(e) => auth.signinWithGoogle()}>
            Google
          </Button>
        </Stack>
      )}
    </Flex>
  )
}

export default Home
